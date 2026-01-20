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

import type { FamilySearchError as FamilySearchErrorType } from "./errors";
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
	PersonDiscussionsResponse,
	PersonPortraitsResponse,
	PersonChangeHistoryResponse,
	SourceDescriptionResponse,
	SourceDescriptionsResponse,
	MemoryWithCommentsResponse,
	UserMemoriesResponse,
	PedigreeData,
	RelationshipDetails,
	RateLimiterConfig,
	SDKLogger,
	// Person CRUD types
	PersonInput,
	CreatePersonResponse,
	UpdatePersonResponse,
	DeletePersonResponse,
	// Relationship CRUD types
	CreateCoupleRelationshipInput,
	CreateChildAndParentsRelationshipInput,
	CreateRelationshipResponse,
	UpdateRelationshipResponse,
	// Person Merge types
	PersonMergeAnalysis,
	PersonMergeInput,
	PersonMergeResponse,
	// Notes CRUD types
	NoteInput,
	NoteResponse,
	// Source Attachment types
	AttachSourceInput,
	AttachSourceResponse,
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
	 * Create a new person in the tree
	 * 
	 * @param person - Person data to create
	 * @returns Created person data with ID
	 * 
	 * @example
	 * ```typescript
	 * const newPerson = await sdk.createPerson({
	 *   names: [{
	 *     nameForms: [{
	 *       fullText: 'John Smith',
	 *       parts: [
	 *         { type: 'http://gedcomx.org/Given', value: 'John' },
	 *         { type: 'http://gedcomx.org/Surname', value: 'Smith' }
	 *       ]
	 *     }]
	 *   }],
	 *   gender: { type: 'http://gedcomx.org/Male' },
	 *   facts: [{
	 *     type: 'http://gedcomx.org/Birth',
	 *     date: { original: '1850' },
	 *     place: { original: 'London, England' }
	 *   }]
	 * });
	 * ```
	 */
	async createPerson(person: PersonInput): Promise<CreatePersonResponse | null> {
		try {
			const response = await this.post<CreatePersonResponse>(
				"/platform/tree/persons",
				{ persons: [person] }
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to create person:",
				error
			);
			throw error;
		}
	}

	/**
	 * Update an existing person in the tree
	 * 
	 * @param personId - ID of the person to update
	 * @param person - Updated person data
	 * @returns Updated person data
	 * 
	 * @example
	 * ```typescript
	 * const updated = await sdk.updatePerson('KWQS-BBQ', {
	 *   facts: [{
	 *     type: 'http://gedcomx.org/Death',
	 *     date: { original: '1920' },
	 *     place: { original: 'New York, USA' }
	 *   }]
	 * });
	 * ```
	 */
	async updatePerson(
		personId: string,
		person: PersonInput
	): Promise<UpdatePersonResponse | null> {
		try {
			const response = await this.post<UpdatePersonResponse>(
				`/platform/tree/persons/${personId}`,
				{ persons: [{ ...person, id: personId }] }
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to update person ${personId}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Delete a person from the tree
	 * 
	 * **Warning:** This is a destructive operation. The person will be marked as deleted.
	 * 
	 * @param personId - ID of the person to delete
	 * @param reason - Optional reason for deletion
	 * @returns Delete confirmation
	 * 
	 * @example
	 * ```typescript
	 * await sdk.deletePerson('KWQS-BBQ', 'Duplicate entry');
	 * ```
	 */
	async deletePerson(
		personId: string,
		reason?: string
	): Promise<DeletePersonResponse | null> {
		try {
			const url = reason
				? `/platform/tree/persons/${personId}?reason=${encodeURIComponent(reason)}`
				: `/platform/tree/persons/${personId}`;

			const response = await this.delete<DeletePersonResponse>(url);
			return {
				statusCode: response.statusCode,
				statusText: response.statusText,
			};
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to delete person ${personId}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Restore a deleted person
	 * 
	 * @param personId - ID of the person to restore
	 * @returns Restored person data
	 * 
	 * @example
	 * ```typescript
	 * const restored = await sdk.restorePerson('KWQS-BBQ');
	 * ```
	 */
	async restorePerson(personId: string): Promise<UpdatePersonResponse | null> {
		try {
			const response = await this.post<UpdatePersonResponse>(
				`/platform/tree/persons/${personId}/restore`,
				{}
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to restore person ${personId}:`,
				error
			);
			throw error;
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
	 * Get discussions for a person
	 * Fetches all discussions attached to a person
	 *
	 * @param personId - FamilySearch person ID
	 * @returns Person discussions response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const discussions = await sdk.getPersonDiscussions('KWQS-BBQ');
	 * if (discussions?.discussions) {
	 *   discussions.discussions.forEach(discussion => {
	 *     console.log('Discussion:', discussion.title);
	 *   });
	 * }
	 * ```
	 */
	async getPersonDiscussions(
		personId: string
	): Promise<PersonDiscussionsResponse | null> {
		try {
			const response = await this.get<PersonDiscussionsResponse>(
				`/platform/tree/persons/${personId}/discussion-references`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get discussions for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Search for persons using external GEDCOM data
	 * Converts person data to search query parameters and searches FamilySearch
	 * Works with both Tree and Records collections
	 *
	 * @param person - Person data to search for (name, dates, places, etc.)
	 * @param options - Search options (collection, pagination)
	 * @returns Search response with matching persons
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
	 * Get portraits (photos) for a person
	 * Fetches all portrait/photo memories attached to a person
	 *
	 * @param personId - FamilySearch person ID
	 * @returns Person portraits response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const portraits = await sdk.getPersonPortraits('KWQS-BBQ');
	 * if (portraits?.sourceDescriptions) {
	 *   portraits.sourceDescriptions.forEach(portrait => {
	 *     console.log('Portrait:', portrait.about);
	 *   });
	 * }
	 * ```
	 */
	async getPersonPortraits(
		personId: string
	): Promise<PersonPortraitsResponse | null> {
		try {
			const response = await this.get<PersonPortraitsResponse>(
				`/platform/tree/persons/${personId}/portraits`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get portraits for ${personId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get change history for a person
	 * Fetches the change log showing all modifications to a person record
	 *
	 * @param personId - FamilySearch person ID
	 * @returns Person change history response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const history = await sdk.getPersonChangeHistory('KWQS-BBQ');
	 * if (history?.entries) {
	 *   history.entries.forEach(entry => {
	 *     console.log('Change:', entry.title, 'at', entry.updated);
	 *   });
	 * }
	 * ```
	 */
	async getPersonChangeHistory(
		personId: string
	): Promise<PersonChangeHistoryResponse | null> {
		try {
			const response = await this.get<PersonChangeHistoryResponse>(
				`/platform/tree/persons/${personId}/changes`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get change history for ${personId}:`,
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
	 * Create a couple relationship between two persons
	 * 
	 * @param relationship - Relationship data
	 * @returns Created relationship data
	 * 
	 * @example
	 * ```typescript
	 * const marriage = await sdk.createCoupleRelationship({
	 *   person1: 'KWQS-BBQ',
	 *   person2: 'KWQS-BBC',
	 *   facts: [{
	 *     type: 'http://gedcomx.org/Marriage',
	 *     date: { original: '1875' },
	 *     place: { original: 'London, England' }
	 *   }]
	 * });
	 * ```
	 */
	async createCoupleRelationship(
		relationship: CreateCoupleRelationshipInput
	): Promise<CreateRelationshipResponse | null> {
		try {
			const body = {
				relationships: [{
					type: "http://gedcomx.org/Couple",
					person1: { resourceId: relationship.person1 },
					person2: { resourceId: relationship.person2 },
					facts: relationship.facts || [],
				}],
			};

			const response = await this.post<CreateRelationshipResponse>(
				"/platform/tree/couple-relationships",
				body
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to create couple relationship:",
				error
			);
			throw error;
		}
	}

	/**
	 * Update a couple relationship
	 * 
	 * @param relationshipId - ID of the relationship to update
	 * @param relationship - Updated relationship data
	 * @returns Updated relationship data
	 * 
	 * @example
	 * ```typescript
	 * const updated = await sdk.updateCoupleRelationship('RRRR-RRR', {
	 *   person1: 'KWQS-BBQ',
	 *   person2: 'KWQS-BBC',
	 *   facts: [{
	 *     type: 'http://gedcomx.org/Divorce',
	 *     date: { original: '1880' }
	 *   }]
	 * });
	 * ```
	 */
	async updateCoupleRelationship(
		relationshipId: string,
		relationship: CreateCoupleRelationshipInput
	): Promise<UpdateRelationshipResponse | null> {
		try {
			const body = {
				relationships: [{
					id: relationshipId,
					type: "http://gedcomx.org/Couple",
					person1: { resourceId: relationship.person1 },
					person2: { resourceId: relationship.person2 },
					facts: relationship.facts || [],
				}],
			};

			const response = await this.post<UpdateRelationshipResponse>(
				`/platform/tree/couple-relationships/${relationshipId}`,
				body
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to update couple relationship ${relationshipId}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Delete a couple relationship
	 * 
	 * @param relationshipId - ID of the relationship to delete
	 * @param reason - Optional reason for deletion
	 * @returns Delete confirmation
	 * 
	 * @example
	 * ```typescript
	 * await sdk.deleteCoupleRelationship('RRRR-RRR', 'Incorrect relationship');
	 * ```
	 */
	async deleteCoupleRelationship(
		relationshipId: string,
		reason?: string
	): Promise<DeletePersonResponse | null> {
		try {
			const url = reason
				? `/platform/tree/couple-relationships/${relationshipId}?reason=${encodeURIComponent(reason)}`
				: `/platform/tree/couple-relationships/${relationshipId}`;

			const response = await this.delete<DeletePersonResponse>(url);
			return {
				statusCode: response.statusCode,
				statusText: response.statusText,
			};
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to delete couple relationship ${relationshipId}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Create a child-and-parents relationship
	 * 
	 * @param relationship - Relationship data
	 * @returns Created relationship data
	 * 
	 * @example
	 * ```typescript
	 * const parentChild = await sdk.createChildAndParentsRelationship({
	 *   child: 'KWQS-BBC',
	 *   father: 'KWQS-BBQ',
	 *   mother: 'KWQS-BBD',
	 *   fatherFacts: [{
	 *     type: 'http://gedcomx.org/BiologicalParent'
	 *   }],
	 *   motherFacts: [{
	 *     type: 'http://gedcomx.org/BiologicalParent'
	 *   }]
	 * });
	 * ```
	 */
	async createChildAndParentsRelationship(
		relationship: CreateChildAndParentsRelationshipInput
	): Promise<CreateRelationshipResponse | null> {
		try {
			const body = {
				childAndParentsRelationships: [{
					type: "http://gedcomx.org/ParentChild",
					child: { resourceId: relationship.child },
					...(relationship.father && {
						parent1: { resourceId: relationship.father },
						parent1Facts: relationship.fatherFacts || [],
					}),
					...(relationship.mother && {
						parent2: { resourceId: relationship.mother },
						parent2Facts: relationship.motherFacts || [],
					}),
				}],
			};

			const response = await this.post<CreateRelationshipResponse>(
				"/platform/tree/child-and-parents-relationships",
				body
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to create child-and-parents relationship:",
				error
			);
			throw error;
		}
	}

	/**
	 * Update a child-and-parents relationship
	 * 
	 * @param relationshipId - ID of the relationship to update
	 * @param relationship - Updated relationship data
	 * @returns Updated relationship data
	 * 
	 * @example
	 * ```typescript
	 * const updated = await sdk.updateChildAndParentsRelationship('RRRR-RRR', {
	 *   child: 'KWQS-BBC',
	 *   father: 'KWQS-BBQ',
	 *   fatherFacts: [{
	 *     type: 'http://gedcomx.org/AdoptiveParent'
	 *   }]
	 * });
	 * ```
	 */
	async updateChildAndParentsRelationship(
		relationshipId: string,
		relationship: CreateChildAndParentsRelationshipInput
	): Promise<UpdateRelationshipResponse | null> {
		try {
			const body = {
				childAndParentsRelationships: [{
					id: relationshipId,
					type: "http://gedcomx.org/ParentChild",
					child: { resourceId: relationship.child },
					...(relationship.father && {
						parent1: { resourceId: relationship.father },
						parent1Facts: relationship.fatherFacts || [],
					}),
					...(relationship.mother && {
						parent2: { resourceId: relationship.mother },
						parent2Facts: relationship.motherFacts || [],
					}),
				}],
			};

			const response = await this.post<UpdateRelationshipResponse>(
				`/platform/tree/child-and-parents-relationships/${relationshipId}`,
				body
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to update child-and-parents relationship ${relationshipId}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Delete a child-and-parents relationship
	 * 
	 * @param relationshipId - ID of the relationship to delete
	 * @param reason - Optional reason for deletion
	 * @returns Delete confirmation
	 * 
	 * @example
	 * ```typescript
	 * await sdk.deleteChildAndParentsRelationship('RRRR-RRR', 'Incorrect parentage');
	 * ```
	 */
	async deleteChildAndParentsRelationship(
		relationshipId: string,
		reason?: string
	): Promise<DeletePersonResponse | null> {
		try {
			const url = reason
				? `/platform/tree/child-and-parents-relationships/${relationshipId}?reason=${encodeURIComponent(reason)}`
				: `/platform/tree/child-and-parents-relationships/${relationshipId}`;

			const response = await this.delete<DeletePersonResponse>(url);
			return {
				statusCode: response.statusCode,
				statusText: response.statusText,
			};
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to delete child-and-parents relationship ${relationshipId}:`,
				error
			);
			throw error;
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
	/**
	 * Search for persons in FamilySearch Tree and Records
	 * Uses query parameters to search for persons by name, dates, places, etc.
	 *
	 * @param query - Query parameters (e.g., q.givenName, q.surname, q.birthLikeDate, q.birthLikePlace)
	 * @param options - Search options (pagination, collection filter)
	 * @returns Search response with matching persons
	 *
	 * @example
	 * ```typescript
	 * const results = await sdk.searchPersons({
	 *   'q.givenName': 'John',
	 *   'q.surname': 'Smith',
	 *   'q.birthLikeDate': '+1850',
	 *   'q.birthLikePlace': 'London, England'
	 * }, { count: 20 });
	 * ```
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
	// Sources API
	// ====================================

	/**
	 * Get source description by ID
	 * Fetches detailed information about a source
	 *
	 * @param sourceId - FamilySearch source description ID
	 * @returns Source description response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const source = await sdk.getSourceDescription('SOURCE-123');
	 * if (source?.sourceDescriptions?.[0]) {
	 *   console.log('Title:', source.sourceDescriptions[0].titles?.[0]?.value);
	 * }
	 * ```
	 */
	async getSourceDescription(
		sourceId: string
	): Promise<SourceDescriptionResponse | null> {
		try {
			const response = await this.get<SourceDescriptionResponse>(
				`/platform/sources/descriptions/${sourceId}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get source description ${sourceId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Search for source descriptions
	 * Searches user-uploaded sources
	 *
	 * @param query - Search query parameters
	 * @param options - Pagination options
	 * @returns Source descriptions response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const sources = await sdk.searchSourceDescriptions(
	 *   { title: 'Census' },
	 *   { count: 20 }
	 * );
	 * ```
	 */
	async searchSourceDescriptions(
		query: Record<string, string>,
		options: { start?: number; count?: number } = {}
	): Promise<SourceDescriptionsResponse | null> {
		try {
			const params = new URLSearchParams({
				...query,
				...(options.start !== undefined && {
					start: options.start.toString(),
				}),
				...(options.count !== undefined && {
					count: options.count.toString(),
				}),
			});

			const response = await this.get<SourceDescriptionsResponse>(
				`/platform/sources/descriptions?${params.toString()}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to search source descriptions:",
				error
			);
			return null;
		}
	}

	// ====================================
	// Memories API
	// ====================================

	/**
	 * Get memory (photo/document/story) by ID
	 * Fetches detailed information about a memory artifact
	 *
	 * @param memoryId - FamilySearch memory artifact ID
	 * @returns Memory with comments response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const memory = await sdk.getMemory('MEM-123');
	 * if (memory?.sourceDescriptions?.[0]) {
	 *   console.log('Title:', memory.sourceDescriptions[0].titles?.[0]?.value);
	 * }
	 * ```
	 */
	async getMemory(
		memoryId: string
	): Promise<MemoryWithCommentsResponse | null> {
		try {
			const response = await this.get<MemoryWithCommentsResponse>(
				`/platform/memories/${memoryId}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get memory ${memoryId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get user's uploaded memories
	 * Fetches all memories uploaded by the current user
	 *
	 * @param options - Pagination options
	 * @returns User memories response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const memories = await sdk.getUserMemories({ count: 50 });
	 * if (memories?.sourceDescriptions) {
	 *   memories.sourceDescriptions.forEach(memory => {
	 *     console.log('Memory:', memory.titles?.[0]?.value);
	 *   });
	 * }
	 * ```
	 */
	async getUserMemories(
		options: { start?: number; count?: number } = {}
	): Promise<UserMemoriesResponse | null> {
		try {
			const params = new URLSearchParams({
				...(options.start !== undefined && {
					start: options.start.toString(),
				}),
				...(options.count !== undefined && {
					count: options.count.toString(),
				}),
			});

			const queryString = params.toString();
			const url = queryString
				? `/platform/memories?${queryString}`
				: "/platform/memories";

			const response = await this.get<UserMemoriesResponse>(url);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to get user memories:",
				error
			);
			return null;
		}
	}

	/**
	 * Get comments for a memory
	 * Fetches all comments on a memory artifact
	 *
	 * @param memoryId - FamilySearch memory artifact ID
	 * @returns Memory with comments response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const comments = await sdk.getMemoryComments('MEM-123');
	 * if (comments?.discussions?.[0]?.comments) {
	 *   comments.discussions[0].comments.forEach(comment => {
	 *     console.log('Comment:', comment.text);
	 *   });
	 * }
	 * ```
	 */
	async getMemoryComments(
		memoryId: string
	): Promise<MemoryWithCommentsResponse | null> {
		try {
			const response = await this.get<MemoryWithCommentsResponse>(
				`/platform/memories/${memoryId}/comments`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get memory comments ${memoryId}:`,
				error
			);
			return null;
		}
	}

	// ====================================
	// Vocabularies API
	// ====================================

	/**
	 * Get list of all controlled vocabularies
	 * Retrieves metadata about available vocabularies (e.g., place types, name types, etc.)
	 *
	 * @returns List of vocabulary metadata, or null if error
	 *
	 * @example
	 * ```typescript
	 * const vocabularies = await sdk.getVocabularies();
	 * if (vocabularies?.vocabularies) {
	 *   vocabularies.vocabularies.forEach(vocab => {
	 *     console.log('Vocabulary:', vocab.id, vocab.name);
	 *   });
	 * }
	 * ```
	 */
	async getVocabularies(): Promise<import("./types").VocabulariesResponse | null> {
		try {
			const response = await this.get<import("./types").VocabulariesResponse>(
				"/platform/vocabularies"
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to get vocabularies:",
				error
			);
			return null;
		}
	}

	/**
	 * Search controlled vocabulary terms
	 * Retrieves terms from a specific vocabulary (e.g., place types, relationship types)
	 *
	 * @param vocabularyId - Vocabulary ID (e.g., 'place-type', 'relationship-type')
	 * @param query - Optional search query
	 * @param options - Pagination options
	 * @returns Vocabulary concepts/terms, or null if error
	 *
	 * @example
	 * ```typescript
	 * const terms = await sdk.getVocabularyTerms('place-type', 'city');
	 * if (terms?.concepts) {
	 *   terms.concepts.forEach(concept => {
	 *     console.log('Term:', concept.label);
	 *   });
	 * }
	 * ```
	 */
	async getVocabularyTerms(
		vocabularyId: string,
		query?: string,
		options: { start?: number; count?: number } = {}
	): Promise<import("./types").VocabularyConceptsResponse | null> {
		try {
			const params = new URLSearchParams({
				...(query && { q: query }),
				...(options.start !== undefined && {
					start: options.start.toString(),
				}),
				...(options.count !== undefined && {
					count: options.count.toString(),
				}),
			});

			const queryString = params.toString();
			const url = queryString
				? `/platform/vocabularies/${vocabularyId}/concepts?${queryString}`
				: `/platform/vocabularies/${vocabularyId}/concepts`;

			const response = await this.get<import("./types").VocabularyConceptsResponse>(url);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get vocabulary terms for ${vocabularyId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get a specific vocabulary concept/term
	 * Retrieves details about a specific term in a vocabulary
	 *
	 * @param vocabularyId - Vocabulary ID
	 * @param conceptId - Concept/term ID
	 * @returns Vocabulary concept details, or null if error
	 *
	 * @example
	 * ```typescript
	 * const concept = await sdk.getVocabularyConcept('place-type', 'City');
	 * if (concept) {
	 *   console.log('Label:', concept.label);
	 *   console.log('Description:', concept.description);
	 * }
	 * ```
	 */
	async getVocabularyConcept(
		vocabularyId: string,
		conceptId: string
	): Promise<import("./types").VocabularyConceptDetail | null> {
		try {
			const response = await this.get<import("./types").VocabularyConceptResponse>(
				`/platform/vocabularies/${vocabularyId}/concepts/${conceptId}`
			);
			return response.data?.concepts?.[0] || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get vocabulary concept ${vocabularyId}/${conceptId}:`,
				error
			);
			return null;
		}
	}

	// ====================================
	// Names API (Standards)
	// ====================================

	/**
	 * Detect name script/writing system
	 * Analyzes a name to determine the writing system (Latin, Cyrillic, Chinese, etc.)
	 *
	 * @param name - Name to analyze
	 * @returns Name with detected script, or null if error
	 *
	 * @example
	 * ```typescript
	 * const result = await sdk.getNameScript('王明');
	 * if (result) {
	 *   console.log('Detected script:', result.script); // e.g., 'Hani' for Chinese
	 * }
	 * ```
	 */
	async getNameScript(
		name: string
	): Promise<import("./types").NameScriptResponse | null> {
		try {
			const params = new URLSearchParams({ name });
			const response = await this.get<import("./types").NameScriptResponse>(
				`/platform/names?${params.toString()}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to get name script:",
				error
			);
			return null;
		}
	}

	/**
	 * Segment/parse a name into parts
	 * Breaks down a full name into given name, surname, prefix, suffix, etc.
	 *
	 * @param name - Full name to parse
	 * @param lang - Language code (e.g., 'en', 'zh', 'ru')
	 * @returns Name segments (parts), or null if error
	 *
	 * @example
	 * ```typescript
	 * const segments = await sdk.segmentName('John William Smith Jr.', 'en');
	 * if (segments?.segments) {
	 *   // segments.segments would contain given name, surname, suffix, etc.
	 *   console.log('Parts:', segments.segments);
	 * }
	 * ```
	 */
	async segmentName(
		name: string,
		lang?: string
	): Promise<import("./types").NameSegmentsResponse | null> {
		try {
			const params = new URLSearchParams({
				name,
				...(lang && { lang }),
			});
			const response = await this.get<import("./types").NameSegmentsResponse>(
				`/platform/names/segments?${params.toString()}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to segment name:",
				error
			);
			return null;
		}
	}

	// ====================================
	// Dates API (Standards)
	// ====================================

	/**
	 * Standardize a date string
	 * Parses and normalizes a date into a standard format
	 *
	 * @param date - Date string to standardize (e.g., "March 15, 1850", "15 Mar 1850")
	 * @returns Standardized date information, or null if error
	 *
	 * @example
	 * ```typescript
	 * const standardized = await sdk.standardizeDate('March 15, 1850');
	 * if (standardized?.dates?.[0]) {
	 *   console.log('Formal date:', standardized.dates[0].formal); // +1850-03-15
	 *   console.log('Original:', standardized.dates[0].original);
	 * }
	 * ```
	 */
	async standardizeDate(
		date: string
	): Promise<import("./types").DateStandardizationResponse | null> {
		try {
			const params = new URLSearchParams({ date });
			const response = await this.get<import("./types").DateStandardizationResponse>(
				`/platform/dates?${params.toString()}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				"[FamilySearch SDK] Failed to standardize date:",
				error
			);
			return null;
		}
	}

	// ====================================
	// Memory Personas API
	// ====================================

	/**
	 * Get memory personas
	 * Retrieves all personas (identified individuals) in a memory
	 *
	 * @param memoryId - Memory artifact ID
	 * @returns Memory personas response, or null if error
	 *
	 * @example
	 * ```typescript
	 * const personas = await sdk.getMemoryPersonas('MEM-123');
	 * if (personas?.persons) {
	 *   personas.persons.forEach(persona => {
	 *     console.log('Person in photo:', persona.display?.name);
	 *   });
	 * }
	 * ```
	 */
	async getMemoryPersonas(
		memoryId: string
	): Promise<import("./types").MemoryPersonasResponse | null> {
		try {
			const response = await this.get<import("./types").MemoryPersonasResponse>(
				`/platform/memories/${memoryId}/personas`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get memory personas for ${memoryId}:`,
				error
			);
			return null;
		}
	}

	/**
	 * Get a specific memory persona
	 * Retrieves details about a specific persona in a memory
	 *
	 * @param memoryId - Memory artifact ID
	 * @param personaId - Persona ID
	 * @returns Memory persona details, or null if error
	 *
	 * @example
	 * ```typescript
	 * const persona = await sdk.getMemoryPersona('MEM-123', 'PERSONA-456');
	 * if (persona?.persons?.[0]) {
	 *   console.log('Person:', persona.persons[0].display?.name);
	 * }
	 * ```
	 */
	async getMemoryPersona(
		memoryId: string,
		personaId: string
	): Promise<import("./types").MemoryPersonaResponse | null> {
		try {
			const response = await this.get<import("./types").MemoryPersonaResponse>(
				`/platform/memories/${memoryId}/personas/${personaId}`
			);
			return response.data || null;
		} catch (error) {
			this.logger.error(
				`[FamilySearch SDK] Failed to get memory persona ${personaId} for ${memoryId}:`,
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
