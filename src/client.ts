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

import { readPersonNotes as readPersonNotesAPI } from "./api/tree/notes";
import { readAncestry, readDescendancy } from "./api/tree/pedigrees";
import { readPerson, readPersonWithDetails } from "./api/tree/persons";
import {
	readCoupleRelationship,
	readChildAndParentsRelationship,
} from "./api/tree/relationships";
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
	FamilySearchPerson,
	FamilySearchPlace,
	PersonNotesResponse,
	PersonMemoriesResponse,
	PersonSourcesResponse,
	TreePersonMatchesResponse,
	TreePersonMatchesOptions,
	PersonMatchInput,
	PersonMatchOptions,
	PedigreeResponse,
	PersonSearchResponse,
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
	private rateLimiter: RateLimiter;
	logger: SDKLogger;

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

	/**
	 * Get person by ID
	 *
	 * @deprecated Use `getPerson` from `@treeviz/familysearch-sdk/api/tree/persons` instead
	 */
	async getPerson(personId: string): Promise<FamilySearchPerson | null> {
		return readPerson(this, personId);
	}

	/**
	 * Get person with full details including relationships
	 *
	 * @deprecated Use `getPersonWithDetails` from `@treeviz/familysearch-sdk/api/tree/persons` instead
	 */
	async getPersonWithDetails(
		personId: string,
		options: { sourceDescriptions?: boolean } = {}
	) {
		return readPersonWithDetails(this, personId, options);
	}

	/**
	 * Get person notes
	 *
	 * @deprecated Use `getPersonNotes` from `@treeviz/familysearch-sdk/api/tree/notes` instead
	 */
	async getPersonNotes(
		personId: string
	): Promise<PersonNotesResponse | null> {
		return readPersonNotesAPI(this, personId);
	}

	/**
	 * Get person memories (photos, stories, documents)
	 *
	 * @deprecated Use `getPersonMemories` from `@treeviz/familysearch-sdk/api/tree/persons` instead
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
				`[FamilySearch SDK] Failed to get person memories for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get person source attachments
	 *
	 * @deprecated Use `getPersonSources` from `@treeviz/familysearch-sdk/api/tree/persons` instead
	 */
	async getPersonSources(
		personId: string
	): Promise<PersonSourcesResponse | null> {
		try {
			const response = await this.get<PersonSourcesResponse>(
				`/platform/tree/persons/${personId}/sources`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get person sources for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get tree person matches (record hints and possible duplicates)
	 *
	 * This is a convenience wrapper for the matches API with filtering options.
	 */
	async getTreePersonMatches(
		personId: string,
		options: TreePersonMatchesOptions = {}
	): Promise<TreePersonMatchesResponse | null> {
		try {
			const params = new URLSearchParams();
			if (options.status) params.append("status", options.status);
			if (options.collection)
				params.append("collection", options.collection);
			if (options.count !== undefined)
				params.append("count", options.count.toString());
			if (options.start !== undefined)
				params.append("start", options.start.toString());

			const queryString = params.toString();
			const url = `/platform/tree/persons/${personId}/matches${queryString ? `?${queryString}` : ""}`;

			const response = await this.get<TreePersonMatchesResponse>(url);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get tree person matches for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Match person using external GEDCOM data
	 *
	 * Submits person data in GedcomX format to find matching persons in FamilySearch.
	 * This method constructs a proper GedcomX person object and posts it to the matches endpoint.
	 *
	 * @param person - Person data with name, gender, birth/death/marriage facts
	 * @param options - Match options (collection filter, result count)
	 * @returns Tree person matches response with potential matches
	 *
	 * @example
	 * ```typescript
	 * const matches = await sdk.matchPerson({
	 *   givenName: 'John',
	 *   familyName: 'Smith',
	 *   birthDate: '1850',
	 *   birthPlace: 'London, England'
	 * }, { count: 20 });
	 * ```
	 */
	async matchPerson(
		person: PersonMatchInput,
		options: PersonMatchOptions = {}
	): Promise<TreePersonMatchesResponse | null> {
		try {
			// Build the GedcomX person object for the API
			const gedcomxPerson: {
				names?: Array<{
					nameForms?: Array<{
						fullText?: string;
						parts?: Array<{ type?: string; value?: string }>;
					}>;
				}>;
				gender?: { type?: string };
				facts?: Array<{
					type?: string;
					date?: { original?: string };
					place?: { original?: string };
				}>;
			} = {};

			// Add name information
			if (person.fullName || person.givenName || person.familyName) {
				const nameParts: Array<{ type?: string; value?: string }> = [];
				if (person.givenName) {
					nameParts.push({
						type: "http://gedcomx.org/Given",
						value: person.givenName,
					});
				}
				if (person.familyName) {
					nameParts.push({
						type: "http://gedcomx.org/Surname",
						value: person.familyName,
					});
				}

				// Build full name, avoiding extra spaces
				const fullText =
					person.fullName ||
					[person.givenName, person.familyName]
						.filter(Boolean)
						.join(" ");

				gedcomxPerson.names = [
					{
						nameForms: [
							{
								fullText,
								parts:
									nameParts.length > 0
										? nameParts
										: undefined,
							},
						],
					},
				];
			}

			// Add gender (validate against known GedcomX types)
			if (person.gender) {
				// Normalize gender to proper case and validate
				const normalizedGender =
					person.gender.charAt(0).toUpperCase() +
					person.gender.slice(1).toLowerCase();
				// Only add if it's a valid GedcomX gender type
				if (["Male", "Female", "Unknown"].includes(normalizedGender)) {
					gedcomxPerson.gender = {
						type: `http://gedcomx.org/${normalizedGender}`,
					};
				}
			}

			// Add facts (birth, death, marriage)
			const facts: Array<{
				type?: string;
				date?: { original?: string };
				place?: { original?: string };
			}> = [];

			if (person.birthDate || person.birthPlace) {
				facts.push({
					type: "http://gedcomx.org/Birth",
					date: person.birthDate
						? { original: person.birthDate }
						: undefined,
					place: person.birthPlace
						? { original: person.birthPlace }
						: undefined,
				});
			}

			if (person.deathDate || person.deathPlace) {
				facts.push({
					type: "http://gedcomx.org/Death",
					date: person.deathDate
						? { original: person.deathDate }
						: undefined,
					place: person.deathPlace
						? { original: person.deathPlace }
						: undefined,
				});
			}

			if (person.marriageDate || person.marriagePlace) {
				facts.push({
					type: "http://gedcomx.org/Marriage",
					date: person.marriageDate
						? { original: person.marriageDate }
						: undefined,
					place: person.marriagePlace
						? { original: person.marriagePlace }
						: undefined,
				});
			}

			if (facts.length > 0) {
				gedcomxPerson.facts = facts;
			}

			// Build query parameters
			const params = new URLSearchParams();
			if (options.collection) {
				params.append("collection", options.collection);
			}
			if (options.count !== undefined) {
				params.append("count", options.count.toString());
			}

			const queryString = params.toString();
			const url = `/platform/tree/matches${queryString ? `?${queryString}` : ""}`;

			// Create a source description for the external GEDCOM person
			const sourceDescription = {
				id: "sd1",
				about: "#primaryPerson",
				resourceType: "http://gedcomx.org/DigitalArtifact",
				titles: [
					{
						value: "External GEDCOM File",
					},
				],
			};

			// Submit the person data to the matches endpoint
			// The description field links to the source description via fragment identifier
			const requestBody = {
				description: "#sd1",
				persons: [
					{
						id: "primaryPerson",
						...gedcomxPerson,
					},
				],
				sourceDescriptions: [sourceDescription],
			};

			const response = await this.post<TreePersonMatchesResponse>(
				url,
				requestBody
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to match person:",
				error
			);
			return null;
		}
	}

	/**
	 * Search for persons using external GEDCOM data
	 *
	 * Converts person data to search query parameters and searches FamilySearch.
	 * Works with both Tree and Records collections.
	 *
	 * @param person - Person data to search for (name, dates, places, etc.)
	 * @param options - Search options (collection, pagination)
	 * @returns FamilySearch API response with search results
	 *
	 * @example
	 * ```typescript
	 * const results = await sdk.searchPersonByData({
	 *   givenName: 'John',
	 *   familyName: 'Smith',
	 *   birthDate: '1850',
	 *   birthPlace: 'London, England'
	 * }, { collection: 'tree', count: 20 });
	 * ```
	 */
	async searchPersonByData(
		person: PersonMatchInput,
		options: {
			start?: number;
			count?: number;
			collection?: "tree" | "records";
		} = {}
	): Promise<FamilySearchApiResponse<PersonSearchResponse>> {
		// Build query parameters from person data
		const query: Record<string, string> = {};

		// Add name
		if (person.givenName) {
			query["q.givenName"] = person.givenName;
		}
		if (person.familyName) {
			query["q.surname"] = person.familyName;
		}

		// Add birth info
		if (person.birthDate) {
			// Extract year from date (FamilySearch expects +YYYY format)
			const year = person.birthDate.match(/\d{4}/)?.[0];
			if (year) {
				query["q.birthLikeDate"] = `+${year}`;
			}
		}
		if (person.birthPlace) {
			query["q.birthLikePlace"] = person.birthPlace;
		}

		// Add death info
		if (person.deathDate) {
			const year = person.deathDate.match(/\d{4}/)?.[0];
			if (year) {
				query["q.deathLikeDate"] = `+${year}`;
			}
		}
		if (person.deathPlace) {
			query["q.deathLikePlace"] = person.deathPlace;
		}

		// Add marriage info
		if (person.marriageDate) {
			const year = person.marriageDate.match(/\d{4}/)?.[0];
			if (year) {
				query["q.marriageLikeDate"] = `+${year}`;
			}
		}
		if (person.marriagePlace) {
			query["q.marriageLikePlace"] = person.marriagePlace;
		}

		// Add father info
		if (person.fatherGivenName) {
			query["q.fatherGivenName"] = person.fatherGivenName;
		}
		if (person.fatherFamilyName) {
			query["q.fatherSurname"] = person.fatherFamilyName;
		}

		// Add mother info
		if (person.motherGivenName) {
			query["q.motherGivenName"] = person.motherGivenName;
		}
		if (person.motherFamilyName) {
			query["q.motherSurname"] = person.motherFamilyName;
		}

		// Add spouse info
		if (person.spouseGivenName) {
			query["q.spouseGivenName"] = person.spouseGivenName;
		}
		if (person.spouseFamilyName) {
			query["q.spouseSurname"] = person.spouseFamilyName;
		}

		return this.searchPersons(query, options);
	}

	/**
	 * Search for persons in FamilySearch
	 *
	 * Low-level search method that accepts query parameters as a Record.
	 * Use `searchPersonByData` for a higher-level interface.
	 *
	 * @param query - Query parameters as key-value pairs
	 * @param options - Search options (collection, pagination)
	 * @returns FamilySearch API response with search results
	 */
	async searchPersons(
		query: Record<string, string>,
		options: {
			start?: number;
			count?: number;
			collection?: "tree" | "records";
		} = {}
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

		// Note: Collection filtering is not supported in the current FamilySearch Search API
		// The search will return results from all available collections
		// We'll need to filter results client-side if needed

		return this.get<PersonSearchResponse>(
			`/platform/tree/search?${params.toString()}`
		);
	}

	/**
	 * Get couple relationship by ID
	 *
	 * @deprecated Use `getCoupleRelationship` from `@treeviz/familysearch-sdk/api/tree/relationships` instead
	 */
	async getCoupleRelationship(relationshipId: string) {
		return readCoupleRelationship(this, relationshipId);
	}

	/**
	 * Get child and parents relationship by ID
	 *
	 * @deprecated Use `getChildAndParentsRelationship` from `@treeviz/familysearch-sdk/api/tree/relationships` instead
	 */
	async getChildAndParentsRelationship(relationshipId: string) {
		return readChildAndParentsRelationship(this, relationshipId);
	}

	/**
	 * Get ancestry for a person
	 *
	 * @deprecated Use `getAncestry` from `@treeviz/familysearch-sdk/api/tree/pedigrees` instead
	 */
	async getAncestry(
		personId: string,
		generations: number = 4
	): Promise<PedigreeResponse | null> {
		return readAncestry(this, personId, generations);
	}

	/**
	 * Get descendancy for a person
	 *
	 * @deprecated Use `getDescendancy` from `@treeviz/familysearch-sdk/api/tree/pedigrees` instead
	 */
	async getDescendancy(
		personId: string,
		generations: number = 2
	): Promise<PedigreeResponse | null> {
		return readDescendancy(this, personId, generations);
	}

	// ====================================
	// Places API
	// ====================================

	/**
	 * Search for places with advanced filtering options
	 *
	 * This is a convenience wrapper that provides additional filtering capabilities
	 * beyond the basic place search API (parent, type, date filters).
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
	 * Get place by ID and extract the first place from response
	 *
	 * This is a convenience wrapper that simplifies the place details API
	 * by returning just the place object instead of the full response structure.
	 *
	 * @deprecated Use `getPlaceDetails` from `@treeviz/familysearch-sdk/api/standards/places` for full response
	 */
	async getPlace(placeId: string): Promise<FamilySearchPlace | null> {
		try {
			const response = await this.get<{ places: FamilySearchPlace[] }>(
				`/platform/places/${placeId}`
			);
			return response.data?.places?.[0] || null;
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
