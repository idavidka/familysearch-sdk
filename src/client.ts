/**
 * FamilySearch SDK Client
 *
 * A modern, TypeScript-first SDK for FamilySearch API v3
 *
 * Features:
 * - Full TypeScript support with comprehensive type definitions
 * - OAuth v3 compatible
 * - Promise-based API
 * - Environment support (production, beta, integration)
 * - Configurable logging
 */

import {
	createErrorFromResponse,
	createNetworkError,
	FamilySearchError,
} from "./errors";
import { RateLimiter } from "./rate-limiter";
import type {
	EnvironmentConfig,
	FamilySearchApiError,
	FamilySearchApiResponse,
	FamilySearchEnvironment,
	FamilySearchSDKConfig,
	FamilySearchUser,
	FamilySearchPlace,
	RateLimiterConfig,
	SDKLogger,
} from "./types";

// Environment configuration
const ENVIRONMENT_CONFIGS: Record<FamilySearchEnvironment, EnvironmentConfig> =
	{
		production: {
			identHost: "https://ident.familysearch.org",
			platformHost: "https://api.familysearch.org",
		},
		beta: {
			identHost: "https://identbeta.familysearch.org",
			platformHost: "https://apibeta.familysearch.org",
		},
		integration: {
			identHost: "https://identint.familysearch.org",
			platformHost: "https://api-integ.familysearch.org",
		},
	};

// Default no-op logger
const noopLogger: SDKLogger = {
	log: () => {},
	warn: () => {},
	error: () => {},
};

/**
 * FamilySearch SDK Client
 *
 * @example
 * ```typescript
 * const sdk = new FamilySearchSDK({
 *   environment: 'production',
 *   accessToken: 'your-oauth-token'
 * });
 *
 * const user = await sdk.getCurrentUser();
 * console.log(user?.displayName);
 * ```
 */
export class FamilySearchSDK {
	private environment: FamilySearchEnvironment;
	private accessToken: string | null = null;
	private appKey: string | null = null;
	private logger: SDKLogger;
	private rateLimiter: RateLimiter;

	constructor(config: FamilySearchSDKConfig = {}) {
		this.environment = config.environment || "integration";
		this.accessToken = config.accessToken || null;
		this.appKey = config.appKey || null;
		this.logger = config.logger || noopLogger;

		// Initialize rate limiter with optional config
		const rateLimiterConfig: RateLimiterConfig = config.rateLimiter || {};
		this.rateLimiter = new RateLimiter(rateLimiterConfig);
	}

	/**
	 * Get the current environment
	 */
	getEnvironment(): FamilySearchEnvironment {
		return this.environment;
	}

	/**
	 * Set OAuth access token
	 */
	setAccessToken(token: string): void {
		this.accessToken = token;
	}

	/**
	 * Get current access token
	 */
	getAccessToken(): string | null {
		return this.accessToken;
	}

	/**
	 * Clear access token
	 */
	clearAccessToken(): void {
		this.accessToken = null;
	}

	/**
	 * Check if SDK has a valid access token
	 */
	hasAccessToken(): boolean {
		return !!this.accessToken;
	}

	/**
	 * Get environment configuration
	 */
	getConfig(): EnvironmentConfig {
		return ENVIRONMENT_CONFIGS[this.environment];
	}

	/**
	 * Make authenticated API request with rate limiting and error handling
	 */
	private async request<T>(
		url: string,
		options: RequestInit = {},
		context?: { resourceType?: string; resourceId?: string }
	): Promise<FamilySearchApiResponse<T>> {
		// Use rate limiter to execute request with automatic retry on 429
		return this.rateLimiter.execute(
			async () => {
				const config = this.getConfig();
				const fullUrl = url.startsWith("http")
					? url
					: `${config.platformHost}${url}`;

				const headers: Record<string, string> = {
					Accept: "application/json",
					...(options.headers as Record<string, string>),
				};

				// Add authorization header if token is available
				// FamilySearch API endpoints that require auth start with /platform/
				const requiresAuth = fullUrl.includes("/platform/");
				if (this.accessToken && requiresAuth) {
					headers.Authorization = `Bearer ${this.accessToken}`;
				}

				// Add app key if available
				if (this.appKey) {
					headers["X-FS-App-Key"] = this.appKey;
				}

				this.logger.log(
					`[FamilySearch SDK] ${options.method || "GET"} ${fullUrl}`
				);

				try {
					const response = await fetch(fullUrl, {
						...options,
						headers,
					});

					const responseHeaders: Record<string, string> = {};
					response.headers.forEach((value, key) => {
						responseHeaders[key] = value;
					});

					let data: T | undefined;
					const contentType = response.headers.get("content-type");
					if (
						contentType &&
						contentType.includes("application/json")
					) {
						try {
							data = await response.json();
						} catch (error) {
							this.logger.warn(
								"[FamilySearch SDK] Failed to parse JSON response:",
								error
							);
						}
					}

					const apiResponse: FamilySearchApiResponse<T> = {
						data,
						statusCode: response.status,
						statusText: response.statusText,
						headers: responseHeaders,
					};

					if (!response.ok) {
						// Use enhanced error handling
						const fsError = createErrorFromResponse(
							apiResponse,
							context
						);
						// Add response to error for backward compatibility
						// Since all errors from createErrorFromResponse extend FamilySearchError,
						// we can safely add these properties
						Object.assign(fsError, {
							response: apiResponse,
							statusCode: response.status,
						} as Partial<FamilySearchApiError>);
						throw fsError;
					}

					return apiResponse;
				} catch (error) {
					// If it's already a FamilySearchError (from our error handling), rethrow
					if (error instanceof FamilySearchError) {
						throw error;
					}
					// Otherwise, wrap in NetworkError
					this.logger.error(
						"[FamilySearch SDK] Request failed:",
						error
					);
					throw createNetworkError(error);
				}
			},
			{
				onRetry: (attempt, delay) => {
					this.logger.warn(
						`[FamilySearch SDK] Rate limit hit, retrying (attempt ${attempt}) after ${delay}ms`
					);
				},
			}
		);
	}

	/**
	 * GET request
	 */
	async get<T>(
		url: string,
		options: RequestInit = {}
	): Promise<FamilySearchApiResponse<T>> {
		return this.request<T>(url, { ...options, method: "GET" });
	}

	/**
	 * POST request
	 */
	async post<T>(
		url: string,
		body?: unknown,
		options: RequestInit = {}
	): Promise<FamilySearchApiResponse<T>> {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};

		return this.request<T>(url, {
			...options,
			method: "POST",
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	/**
	 * PUT request
	 */
	async put<T>(
		url: string,
		body?: unknown,
		options: RequestInit = {}
	): Promise<FamilySearchApiResponse<T>> {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers as Record<string, string>),
		};

		return this.request<T>(url, {
			...options,
			method: "PUT",
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T>(
		url: string,
		options: RequestInit = {}
	): Promise<FamilySearchApiResponse<T>> {
		return this.request<T>(url, { ...options, method: "DELETE" });
	}

	// ====================================
	// User API
	// ====================================

	/**
	 * Get current authenticated user
	 */
	async getCurrentUser(): Promise<FamilySearchUser | null> {
		try {
			const response = await this.get<{ users: FamilySearchUser[] }>(
				"/platform/users/current"
			);

			const user = response.data?.users?.[0];
			return user || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to get current user:",
				error
			);
			return null;
		}
	}

	// ====================================
	// Tree/Pedigree API
	// ====================================

	// ====================================
	// Places API
	// ====================================

	/**
	 * Search for places
	 * 
	 * @deprecated Use `searchPlaces` from `@treeviz/familysearch-sdk/api/standards/places` instead
	 * @see {@link searchPlacesAPI}
	 */
	async searchPlaces(
		name: string,
		options: {
			parentId?: string;
			typeId?: string;
			date?: string;
			start?: number;
			count?: number;
		} = {}
	): Promise<{ places: FamilySearchPlace[] } | null> {
		try {
			const params = new URLSearchParams({
				name,
				...(options.parentId && { parentId: options.parentId }),
				...(options.typeId && { typeId: options.typeId }),
				...(options.date && { date: options.date }),
				...(options.start !== undefined && {
					start: options.start.toString(),
				}),
				...(options.count !== undefined && {
					count: options.count.toString(),
				}),
			});

			const response = await this.get<{ places: FamilySearchPlace[] }>(
				`/platform/places/search?${params.toString()}`
			);

			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to search places:",
				error
			);
			return null;
		}
	}

	// ====================================
	// Import/Export API
	// ====================================

	/**
	 * Get GEDCOM export for a person and their ancestors
	 */
	async exportGEDCOM(personId: string): Promise<string | null> {
		try {
			const response = await this.get<string>(
				`/platform/tree/persons/${personId}/gedcomx`,
				{
					headers: {
						Accept: "application/x-gedcomx-v1+json",
					},
				}
			);

			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to export GEDCOM:",
				error
			);
			return null;
		}
	}
}

// ====================================
// Singleton Instance Management
// ====================================

let sdkInstance: FamilySearchSDK | null = null;

/**
 * Initialize the global SDK instance
 */
export function initFamilySearchSDK(
	config: FamilySearchSDKConfig = {}
): FamilySearchSDK {
	if (!sdkInstance) {
		sdkInstance = new FamilySearchSDK(config);
	} else {
		// Update existing instance with new config
		if (config.accessToken !== undefined) {
			sdkInstance.setAccessToken(config.accessToken);
		}
		if (config.environment !== undefined) {
			// Re-create instance if environment changes
			sdkInstance = new FamilySearchSDK(config);
		}
	}
	return sdkInstance;
}

/**
 * Get the global SDK instance
 */
export function getFamilySearchSDK(): FamilySearchSDK {
	if (!sdkInstance) {
		sdkInstance = new FamilySearchSDK();
	}
	return sdkInstance;
}

/**
 * Create a new SDK instance (for testing or multiple environments)
 */
export function createFamilySearchSDK(
	config: FamilySearchSDKConfig = {}
): FamilySearchSDK {
	return new FamilySearchSDK(config);
}

/**
 * Reset the global SDK instance (mainly for testing)
 */
export function resetFamilySearchSDK(): void {
	sdkInstance = null;
}

// Export environment configs for external use
export { ENVIRONMENT_CONFIGS };
