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

import type {
	EnvironmentConfig,
	FamilySearchApiError,
	FamilySearchApiResponse,
	FamilySearchEnvironment,
	FamilySearchPlace,
	FamilySearchPerson,
	FamilySearchSDKConfig,
	FamilySearchUser,
	PersonWithRelationships,
	PersonNotesResponse,
	PersonMemoriesResponse,
	PersonSearchResponse,
	PedigreeData,
	RelationshipDetails,
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

	constructor(config: FamilySearchSDKConfig = {}) {
		this.environment = config.environment || "integration";
		this.accessToken = config.accessToken || null;
		this.appKey = config.appKey || null;
		this.logger = config.logger || noopLogger;
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
	 * Make authenticated API request
	 */
	private async request<T>(
		url: string,
		options: RequestInit = {}
	): Promise<FamilySearchApiResponse<T>> {
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
			if (contentType && contentType.includes("application/json")) {
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
				const error = new Error(
					`FamilySearch API error: ${response.status} ${response.statusText}`
				) as FamilySearchApiError;
				error.statusCode = response.status;
				error.response = apiResponse;
				throw error;
			}

			return apiResponse;
		} catch (error) {
			this.logger.error("[FamilySearch SDK] Request failed:", error);
			throw error;
		}
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

	/**
	 * Get person by ID
	 */
	async getPerson(personId: string): Promise<FamilySearchPerson | null> {
		try {
			const response = await this.get<{ persons: FamilySearchPerson[] }>(
				`/platform/tree/persons/${personId}`
			);

			const person = response.data?.persons?.[0];
			return person || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get person ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get person with full details including sources
	 */
	async getPersonWithDetails(
		personId: string
	): Promise<PersonWithRelationships | null> {
		try {
			const response = await this.get(
				`/platform/tree/persons/${personId}?sourceDescriptions=true`
			);
			return (response.data as PersonWithRelationships) || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get person details ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get notes for a person
	 */
	async getPersonNotes(
		personId: string
	): Promise<PersonNotesResponse | null> {
		try {
			const response = await this.get<PersonNotesResponse>(
				`/platform/tree/persons/${personId}/notes`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get notes for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get memories for a person
	 */
	async getPersonMemories(
		personId: string
	): Promise<PersonMemoriesResponse | null> {
		try {
			const response = await this.get<PersonMemoriesResponse>(
				`/platform/tree/persons/${personId}/memories`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get memories for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get couple relationship details
	 */
	async getCoupleRelationship(
		relationshipId: string
	): Promise<RelationshipDetails | null> {
		try {
			const response = await this.get<RelationshipDetails>(
				`/platform/tree/couple-relationships/${relationshipId}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get couple relationship ${relationshipId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get child-and-parents relationship details
	 */
	async getChildAndParentsRelationship(
		relationshipId: string
	): Promise<RelationshipDetails | null> {
		try {
			const response = await this.get<RelationshipDetails>(
				`/platform/tree/child-and-parents-relationships/${relationshipId}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get child-and-parents relationship ${relationshipId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get ancestry for a person
	 */
	async getAncestry(
		personId: string,
		generations: number = 4
	): Promise<FamilySearchApiResponse<PedigreeData>> {
		return this.get<PedigreeData>(
			`/platform/tree/ancestry?person=${personId}&generations=${generations}`
		);
	}

	/**
	 * Get descendancy for a person
	 */
	async getDescendancy(
		personId: string,
		generations: number = 2
	): Promise<FamilySearchApiResponse<PedigreeData>> {
		return this.get<PedigreeData>(
			`/platform/tree/descendancy?person=${personId}&generations=${generations}`
		);
	}

	/**
	 * Search for persons
	 */
	async searchPersons(
		query: Record<string, string>,
		options: { start?: number; count?: number } = {}
	): Promise<FamilySearchApiResponse<PersonSearchResponse>> {
		const params = new URLSearchParams({
			...query,
			...(options.start !== undefined && {
				start: options.start.toString(),
			}),
			...(options.count !== undefined && {
				count: options.count.toString(),
			}),
		});

		return this.get<PersonSearchResponse>(
			`/platform/tree/search?${params.toString()}`
		);
	}

	// ====================================
	// Places API
	// ====================================

	/**
	 * Search for places
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

	/**
	 * Get place by ID
	 */
	async getPlace(placeId: string): Promise<FamilySearchPlace | null> {
		try {
			const response = await this.get<{ places: FamilySearchPlace[] }>(
				`/platform/places/${placeId}`
			);

			const place = response.data?.places?.[0];
			return place || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get place ${placeId}:`,
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
