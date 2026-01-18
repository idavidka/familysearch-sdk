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
	PersonSourcesResponse,
	TreePersonMatchesResponse,
	TreePersonMatchesOptions,
	PersonMatchInput,
	PersonMatchOptions,
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
	 * Get person with full details
	 * @param personId - FamilySearch person ID
	 * @param options - Optional query parameters
	 * @param options.sourceDescriptions - Include source descriptions (default: false)
	 */
	async getPersonWithDetails(
		personId: string,
		options: { sourceDescriptions?: boolean } = {}
	): Promise<PersonWithRelationships | null> {
		try {
			const queryParams = options.sourceDescriptions
				? "?sourceDescriptions=true"
				: "";
			const response = await this.get(
				`/platform/tree/persons/${personId}${queryParams}`
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
	 * Get sources for a person
	 * Fetches all source references linked to a person
	 *
	 * @param personId - FamilySearch person ID
	 * @returns Person sources response with source references and descriptions, or null if error
	 *
	 * @example
	 * ```typescript
	 * const sources = await sdk.getPersonSources('KWQS-BBQ');
	 * if (sources?.persons?.[0]?.sources) {
	 *   sources.persons[0].sources.forEach(source => {
	 *     console.log('Source:', source.descriptionId);
	 *   });
	 * }
	 * ```
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
				`[FamilySearch SDK] Failed to get sources for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get tree person matches
	 * Fetches possible matches between a person in the FamilySearch Tree and historical records
	 *
	 * @param personId - FamilySearch person ID
	 * @param options - Optional query parameters
	 * @returns Tree person matches response with match information, or null if error
	 *
	 * @example
	 * ```typescript
	 * const matches = await sdk.getTreePersonMatches('KWQS-BBQ');
	 * if (matches?.sourceDescriptions) {
	 *   matches.sourceDescriptions.forEach(match => {
	 *     console.log('Match:', match.titles?.[0]?.value);
	 *   });
	 * }
	 * ```
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
			const url = `/platform/tree/persons/${personId}/matches${
				queryString ? `?${queryString}` : ""
			}`;

			const response = await this.get<TreePersonMatchesResponse>(url);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get matches for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Match person from external GEDCOM data
	 * Submits a virtual person profile to find matching persons in the FamilySearch Tree
	 * Use this for persons from external GEDCOM files or manually created trees
	 *
	 * @param person - Person data to match (name, dates, places, etc.)
	 * @param options - Optional query parameters
	 * @returns Tree person matches response with potential matches, or null if error
	 *
	 * @example
	 * ```typescript
	 * const matches = await sdk.matchPerson({
	 *   givenName: 'John',
	 *   familyName: 'Smith',
	 *   birthDate: '1850',
	 *   birthPlace: 'London, England',
	 *   deathDate: '1920',
	 *   deathPlace: 'New York, USA'
	 * });
	 *
	 * if (matches?.entries) {
	 *   matches.entries.forEach(match => {
	 *     console.log('Potential match:', match.title);
	 *     console.log('Score:', match.content?.score);
	 *   });
	 * }
	 * ```
	 */
	async matchPerson(
		person: PersonMatchInput,
		options: PersonMatchOptions = {}
	): Promise<TreePersonMatchesResponse | null> {
		try {
			// Build the GedcomX person object for the API
			const gedcomxPerson: {
				names?: Array<{ nameForms?: Array<{ fullText?: string; parts?: Array<{ type?: string; value?: string }> }> }>;
				gender?: { type?: string };
				facts?: Array<{ type?: string; date?: { original?: string }; place?: { original?: string } }>;
			} = {};

			// Add name information
			if (person.fullName || person.givenName || person.familyName) {
				const nameParts: Array<{ type?: string; value?: string }> = [];
				if (person.givenName) {
					nameParts.push({ type: "http://gedcomx.org/Given", value: person.givenName });
				}
				if (person.familyName) {
					nameParts.push({ type: "http://gedcomx.org/Surname", value: person.familyName });
				}

				gedcomxPerson.names = [{
					nameForms: [{
						fullText: person.fullName || `${person.givenName || ""} ${person.familyName || ""}`.trim(),
						parts: nameParts.length > 0 ? nameParts : undefined,
					}],
				}];
			}

			// Add gender
			if (person.gender) {
				gedcomxPerson.gender = {
					type: `http://gedcomx.org/${person.gender}`,
				};
			}

			// Add facts (birth, death, marriage)
			const facts: Array<{ type?: string; date?: { original?: string }; place?: { original?: string } }> = [];

			if (person.birthDate || person.birthPlace) {
				facts.push({
					type: "http://gedcomx.org/Birth",
					date: person.birthDate ? { original: person.birthDate } : undefined,
					place: person.birthPlace ? { original: person.birthPlace } : undefined,
				});
			}

			if (person.deathDate || person.deathPlace) {
				facts.push({
					type: "http://gedcomx.org/Death",
					date: person.deathDate ? { original: person.deathDate } : undefined,
					place: person.deathPlace ? { original: person.deathPlace } : undefined,
				});
			}

			if (person.marriageDate || person.marriagePlace) {
				facts.push({
					type: "http://gedcomx.org/Marriage",
					date: person.marriageDate ? { original: person.marriageDate } : undefined,
					place: person.marriagePlace ? { original: person.marriagePlace } : undefined,
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

			// Submit the person data to the matches endpoint
			const requestBody = {
				persons: [gedcomxPerson],
			};

			const response = await this.post<TreePersonMatchesResponse>(url, requestBody);
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
