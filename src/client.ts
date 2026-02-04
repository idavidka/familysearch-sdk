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

import { DiscussionsAPI } from "./api/discussions";
import {
	GenealogyOtherAPI,
	GenealogyPersonsAPI,
	GenealogyRelationshipsAPI,
	GenealogySourcesAPI,
	TreesAPI as GenealogyTreesAPI,
} from "./api/genealogies";
import { MemoriesAPI } from "./api/memories";
import {
	DatesAPI,
	NamesAPI,
	PlacesAPI,
	VocabulariesAPI,
} from "./api/standards";
import {
	AgentAPI,
	ConclusionsAPI,
	GroupsAPI,
	MatchesAPI,
	MergesAPI,
	NotesAPI,
	PedigreesAPI,
	PendingModificationsAPI,
	PersonsAPI,
	PreferencesAPI,
	RelationshipsAPI,
	SearchAPI,
	SourceAttachmentsAPI,
	SourceBoxAPI,
	SourcesAPI,
	TreeChangesAPI,
	TreesManagementAPI,
} from "./api/tree";
import { CurrentTreeAPI } from "./api/trees";
import { UserAPI } from "./api/user";
import { VocabAPI } from "./api/vocab";
import { OAuthAPI } from "./auth";
import {
	createErrorFromResponse,
	createNetworkError,
	FamilySearchError,
} from "./errors";
import { RateLimiter } from "./rate-limiter";
import { PedigreeAPI } from "./tree";
import type {
	EnvironmentConfig,
	FamilySearchApiError,
	FamilySearchApiResponse,
	FamilySearchEnvironment,
	FamilySearchSDKConfig,
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
 * const user = await sdk.readCurrentUser();
 * console.log(user?.displayName);
 * ```
 */
export class FamilySearchSDK {
	private environment: FamilySearchEnvironment;
	private accessToken: string | null = null;
	private appKey: string | null = null;
	private rateLimiter: RateLimiter;
	logger: SDKLogger;

	// Authentication
	public readonly oauth: OAuthAPI;

	// API module instances
	public readonly persons: PersonsAPI;
	public readonly notes: NotesAPI;
	public readonly pedigrees: PedigreesAPI;
	public readonly relationships: RelationshipsAPI;
	public readonly matches: MatchesAPI;
	public readonly discussions: DiscussionsAPI;
	public readonly memories: MemoriesAPI;
	public readonly sources: SourcesAPI;
	public readonly places: PlacesAPI;
	public readonly user: UserAPI;
	public readonly dates: DatesAPI;
	public readonly names: NamesAPI;
	public readonly vocabularies: VocabulariesAPI;
	// Tree-specific modules
	public readonly agent: AgentAPI;
	public readonly conclusions: ConclusionsAPI;
	public readonly groups: GroupsAPI;
	public readonly merges: MergesAPI;
	public readonly pendingModifications: PendingModificationsAPI;
	public readonly preferences: PreferencesAPI;
	public readonly treesManagement: TreesManagementAPI;
	public readonly search: SearchAPI;
	public readonly sourceAttachments: SourceAttachmentsAPI;
	public readonly sourceBox: SourceBoxAPI;
	public readonly treeChanges: TreeChangesAPI;
	public readonly currentTree: CurrentTreeAPI;
	public readonly vocab: VocabAPI;
	// Genealogies sub-modules
	public readonly trees: GenealogyTreesAPI;
	public readonly genealogyPersons: GenealogyPersonsAPI;
	public readonly genealogyRelationships: GenealogyRelationshipsAPI;
	public readonly genealogySources: GenealogySourcesAPI;
	public readonly genealogyOther: GenealogyOtherAPI;
	// Helper modules
	public readonly pedigree: PedigreeAPI;

	constructor(config: FamilySearchSDKConfig = {}) {
		this.environment = config.environment || "integration";
		this.accessToken = config.accessToken || null;
		this.appKey = config.appKey || null;
		this.logger = config.logger || noopLogger;

		// Initialize rate limiter with optional config
		const rateLimiterConfig: RateLimiterConfig = config.rateLimiter || {};
		this.rateLimiter = new RateLimiter(rateLimiterConfig);

		// Initialize OAuth API (requires config)
		this.oauth = new OAuthAPI({
			clientId: config.appKey || "",
			redirectUri: config.redirectUri || "",
			environment: this.environment,
		});

		// Initialize API modules
		this.persons = new PersonsAPI(this);
		this.notes = new NotesAPI(this);
		this.pedigrees = new PedigreesAPI(this);
		this.relationships = new RelationshipsAPI(this);
		this.matches = new MatchesAPI(this);
		this.discussions = new DiscussionsAPI(this);
		this.memories = new MemoriesAPI(this);
		this.sources = new SourcesAPI(this);
		this.places = new PlacesAPI(this);
		this.user = new UserAPI(this);
		this.dates = new DatesAPI(this);
		this.names = new NamesAPI(this);
		this.vocabularies = new VocabulariesAPI(this);
		// Tree-specific modules
		this.agent = new AgentAPI(this);
		this.conclusions = new ConclusionsAPI(this);
		this.groups = new GroupsAPI(this);
		this.merges = new MergesAPI(this);
		this.pendingModifications = new PendingModificationsAPI(this);
		this.preferences = new PreferencesAPI(this);
		this.treesManagement = new TreesManagementAPI(this);
		this.search = new SearchAPI(this);
		this.sourceAttachments = new SourceAttachmentsAPI(this);
		this.sourceBox = new SourceBoxAPI(this);
		this.treeChanges = new TreeChangesAPI(this);
		this.currentTree = new CurrentTreeAPI(this);
		this.vocab = new VocabAPI(this);
		// Genealogies sub-modules
		this.trees = new GenealogyTreesAPI(this);
		this.genealogyPersons = new GenealogyPersonsAPI(this);
		this.genealogyRelationships = new GenealogyRelationshipsAPI(this);
		this.genealogySources = new GenealogySourcesAPI(this);
		this.genealogyOther = new GenealogyOtherAPI(this);
		// Helper modules
		this.pedigree = new PedigreeAPI(this);
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
	 * Get web base URL for current environment
	 * (e.g., https://www.familysearch.org for production)
	 */
	getWebBaseUrl(): string {
		switch (this.environment) {
			case "beta":
				return "https://beta.familysearch.org";
			case "integration":
				return "https://integration.familysearch.org";
			default:
				return "https://www.familysearch.org";
		}
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

	/**
	 * OPTIONS request
	 *
	 * Used to check endpoint capabilities and availability.
	 * Returns response headers that indicate allowed methods, warnings, etc.
	 */
	async options(
		url: string,
		requestOptions: RequestInit = {}
	): Promise<FamilySearchApiResponse<void>> {
		return this.request<void>(url, {
			...requestOptions,
			method: "OPTIONS",
		});
	}

	/**
	 * HEAD request
	 *
	 * Used to check resource existence and retrieve metadata without fetching the body.
	 * Returns response headers including content-type, last-modified, etc.
	 */
	async head(
		url: string,
		requestOptions: RequestInit = {}
	): Promise<FamilySearchApiResponse<void>> {
		return this.request<void>(url, { ...requestOptions, method: "HEAD" });
	}

	// ====================================
	// User API
	// ====================================
	// Note: Use this.user.readCurrentUser() instead of direct implementation

	// ====================================
	// Tree/Pedigree API
	// ====================================
	// Note: Person matching, searching moved to api/tree modules
	// Use this.matches.* and this.search.* for these operations

	// ====================================
	// Places API
	// ====================================
	// Note: Use this.places.* for place operations

	// ====================================
	// Import/Export API
	// ====================================
	// Note: GEDCOM export moved to api/tree/export module
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
