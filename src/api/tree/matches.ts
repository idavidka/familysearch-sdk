/**
 * FamilySearch Matches API
 *
 * Handles record matches, record hints, and potential duplicates.
 *
 * @see https://developers.familysearch.org/main/reference/readpersonmatches
 */

import type { FamilySearchSDK } from "../../client";
import type {
	MatchesResponse,
	MatchResolutionInput,
	MatchResolutionResponse,
	NotAMatchResponse,
	NotAMatchInput,
	DeleteResponse,
	PersonMatchInput,
	PersonMatchOptions,
	TreePersonMatchesResponse,
} from "../../types";

/**
 * Read record matches for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Matches data or null
 */
/**
 * Read person matches with filtering options
 *
 * Retrieves record hints and possible duplicates for a person.
 * Supports filtering by status, collection, and pagination.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param options - Filter and pagination options
 * @returns Matches response or null
 *
 * @example
 * ```typescript
 * // Get all matches
 * const matches = await readPersonMatches(sdk, "PPPP-PPP");
 *
 * // Get only pending matches from records collection
 * const recordMatches = await readPersonMatches(sdk, "PPPP-PPP", {
 *   status: "pending",
 *   collection: "records",
 *   count: 20
 * });
 * ```
 */
export async function readPersonMatches(
	sdk: FamilySearchSDK,
	personId: string,
	options: {
		status?: string;
		collection?: string;
		count?: number;
		start?: number;
	} = {}
): Promise<MatchesResponse | null> {
	try {
		const params = new URLSearchParams();
		if (options.status) params.append("status", options.status);
		if (options.collection) params.append("collection", options.collection);
		if (options.count !== undefined)
			params.append("count", options.count.toString());
		if (options.start !== undefined)
			params.append("start", options.start.toString());

		const queryString = params.toString();
		const url = `/platform/tree/persons/${personId}/matches${queryString ? `?${queryString}` : ""}`;

		const response = await sdk.get<MatchesResponse>(url);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get person matches for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Read non-matches for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Non-matches data or null
 */
export async function readPersonNonMatches(
	sdk: FamilySearchSDK,
	personId: string
): Promise<MatchesResponse | null> {
	try {
		const response = await sdk.get<MatchesResponse>(
			`/platform/tree/persons/${personId}/non-matches`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read non-matches for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Update match resolution (accept/reject/dismiss)
 *
 * Resolves a record match by accepting, rejecting, or dismissing it.
 * - **accepted**: Match is confirmed, data can be merged
 * - **rejected**: Match is incorrect (not-a-match declaration)
 * - **pending**: Reset to unresolved state
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param matchId - Match ID
 * @param status - Resolution status ("accepted", "rejected", or "pending")
 * @returns Match resolution response
 * @throws Error if resolution fails
 *
 * @example
 * ```typescript
 * // Accept a match
 * await updateMatchResolution(sdk, "PPPP-PPP", "MMMM-MMM", "accepted");
 *
 * // Reject a match (declare not-a-match)
 * await updateMatchResolution(sdk, "PPPP-PPP", "MMMM-MMM", "rejected");
 * ```
 */
export async function updateMatchResolution(
	sdk: FamilySearchSDK,
	personId: string,
	matchId: string,
	status: "accepted" | "rejected" | "pending"
): Promise<MatchResolutionResponse> {
	try {
		const input: MatchResolutionInput = { status };
		const response = await sdk.post<MatchResolutionResponse>(
			`/platform/tree/persons/${personId}/matches/${matchId}`,
			input
		);
		return response.data || { entries: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update match resolution for ${personId}/${matchId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get not-a-match declarations for a person
 *
 * Returns all persons that have been explicitly declared as NOT matching
 * the specified person. This prevents these persons from appearing in
 * match suggestions.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Not-a-match declarations or null
 *
 * @example
 * ```typescript
 * const notMatches = await readNotAMatchDeclarations(sdk, "PPPP-PPP");
 * if (notMatches?.persons) {
 *   console.log("Not-a-match persons:", notMatches.persons.length);
 * }
 * ```
 */
export async function readNotAMatchDeclarations(
	sdk: FamilySearchSDK,
	personId: string
): Promise<NotAMatchResponse | null> {
	try {
		const response = await sdk.get<NotAMatchResponse>(
			`/platform/tree/persons/${personId}/not-a-matches`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get not-a-match declarations for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a not-a-match declaration
 *
 * Declares that two persons are NOT a match, preventing them from appearing
 * in each other's match suggestions. This is useful when the system suggests
 * incorrect matches.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param notMatchPersonId - ID of person to declare as not-a-match
 * @param reason - Optional reason for the declaration
 * @returns Not-a-match response
 * @throws Error if declaration fails
 *
 * @example
 * ```typescript
 * await createNotAMatchDeclaration(
 *   sdk,
 *   "PPPP-PPP",
 *   "QQQQ-QQQ",
 *   "Different person with same name"
 * );
 * ```
 */
export async function createNotAMatchDeclaration(
	sdk: FamilySearchSDK,
	personId: string,
	notMatchPersonId: string,
	reason?: string
): Promise<NotAMatchResponse> {
	try {
		const input: NotAMatchInput = {
			person: notMatchPersonId,
			...(reason && { reason }),
		};
		const response = await sdk.post<NotAMatchResponse>(
			`/platform/tree/persons/${personId}/not-a-matches`,
			input
		);
		return response.data || { persons: [], entries: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create not-a-match declaration for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a specific not-a-match declaration
 *
 * Removes a single not-a-match declaration, allowing the persons to appear
 * in each other's match suggestions again.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param declarationId - Not-a-match declaration ID
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deleteNotAMatchDeclaration(sdk, "PPPP-PPP", "DDDD-DDD");
 * console.log("Not-a-match declaration removed");
 * ```
 */
export async function deleteNotAMatchDeclaration(
	sdk: FamilySearchSDK,
	personId: string,
	declarationId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/not-a-matches/${declarationId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete not-a-match declaration ${declarationId} for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete all not-a-match declarations for a person (bulk delete)
 *
 * Removes ALL not-a-match declarations for a person at once.
 * Use with caution as this cannot be undone.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deleteAllNotAMatchDeclarations(sdk, "PPPP-PPP");
 * console.log("All not-a-match declarations removed");
 * ```
 */
export async function deleteAllNotAMatchDeclarations(
	sdk: FamilySearchSDK,
	personId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/not-a-matches`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete all not-a-match declarations for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Read Tree Matches
 *
 * Returns the matches for a Community Contributed Tree (CET).
 * Allows filtering on the request to focus on the "best" historical
 * record hints, person hints to other CETs or to the Shared Family Tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree ID
 * @param options - Optional query parameters for filtering matches
 * @returns Matches response or null
 *
 * @example
 * ```typescript
 * // Get all matches for a tree
 * const matches = await readTreeMatches(sdk, "TREE-ID");
 *
 * // Get matches with filtering
 * const filtered = await readTreeMatches(sdk, "TREE-ID", {
 *   status: "pending",
 *   collection: "census"
 * });
 * ```
 */
export async function readTreeMatches(
	sdk: FamilySearchSDK,
	treeId: string,
	options?: {
		status?: string;
		collection?: string;
		count?: number;
		start?: number;
	}
): Promise<MatchesResponse | null> {
	try {
		let url = `/platform/trees/${treeId}/matches`;

		if (options) {
			const params = new URLSearchParams();
			if (options.status) params.set("status", options.status);
			if (options.collection)
				params.set("collection", options.collection);
			if (options.count !== undefined)
				params.set("count", options.count.toString());
			if (options.start !== undefined)
				params.set("start", options.start.toString());

			const queryString = params.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		const response = await sdk.get<MatchesResponse>(url);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get tree matches for ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Get not-a-match declarations for a person
 *
 * Returns all "not-a-match" declarations for a specific person.
 * These are declarations that two persons are NOT the same individual.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Not-a-match declarations or null
 *
 * @example
 * ```typescript
 * const notMatches = await readPersonNotAMatches(sdk, 'PPPP-PPP');
 * console.log('Not-a-match declarations:', notMatches?.entries?.length);
 * ```
 */
export async function readPersonNotAMatches(
	sdk: FamilySearchSDK,
	personId: string
): Promise<NotAMatchResponse | null> {
	try {
		const response = await sdk.get<NotAMatchResponse>(
			`/platform/tree/persons/${personId}/not-a-match`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get not-a-match declarations for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Update not-a-match declarations for a person
 *
 * Creates or updates "not-a-match" declarations in batch.
 * This declares that multiple persons are NOT the same individual.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param notAMatchIds - Array of person IDs that are not matches
 * @returns Update response or null
 *
 * @example
 * ```typescript
 * await updatePersonNotAMatches(sdk, 'PPPP-PPP', ['AAAA-AAA', 'BBBB-BBB']);
 * console.log('Not-a-match declarations updated');
 * ```
 */
export async function updatePersonNotAMatches(
	sdk: FamilySearchSDK,
	personId: string,
	notAMatchIds: string[]
): Promise<NotAMatchResponse | null> {
	try {
		const input: NotAMatchInput = {
			entries: notAMatchIds.map((id) => ({
				person: { id },
			})),
		};

		const response = await sdk.post<NotAMatchResponse>(
			`/platform/tree/persons/${personId}/not-a-match`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update not-a-match declarations for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete all not-a-match declarations for a person
 *
 * Removes all "not-a-match" declarations for a specific person in batch.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Delete response
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deletePersonNotAMatches(sdk, 'PPPP-PPP');
 * console.log('All not-a-match declarations removed');
 * ```
 */
export async function deletePersonNotAMatches(
	sdk: FamilySearchSDK,
	personId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/not-a-match`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete all not-a-match declarations for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a specific not-a-match declaration
 *
 * Removes a single "not-a-match" declaration by its ID.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param notAMatchId - Not-a-match declaration ID to remove
 * @returns Delete response
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deletePersonNotAMatch(sdk, 'PPPP-PPP', 'NMID-123');
 * console.log('Not-a-match declaration removed');
 * ```
 */
export async function deletePersonNotAMatch(
	sdk: FamilySearchSDK,
	personId: string,
	notAMatchId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/not-a-match/${notAMatchId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete not-a-match declaration ${notAMatchId} for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Match person using external GEDCOM data
 *
 * Submits person data in GedcomX format to find matching persons in FamilySearch.
 * This is a higher-level convenience function that constructs a proper GedcomX
 * person object from simple input data.
 *
 * @param sdk - SDK instance
 * @param person - Person data with name, gender, birth/death/marriage facts
 * @param options - Match options (collection filter, result count)
 * @returns Tree person matches response with potential matches
 *
 * @example
 * ```typescript
 * const matches = await matchPerson(sdk, {
 *   givenName: 'John',
 *   familyName: 'Smith',
 *   birthDate: '1850',
 *   birthPlace: 'London, England'
 * }, { count: 20 });
 * ```
 */
export async function matchPerson(
	sdk: FamilySearchSDK,
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
				[person.givenName, person.familyName].filter(Boolean).join(" ");

			gedcomxPerson.names = [
				{
					nameForms: [
						{
							fullText,
							parts: nameParts.length > 0 ? nameParts : undefined,
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
				date: person.birthDate ? { original: person.birthDate } : undefined,
				place: person.birthPlace
					? { original: person.birthPlace }
					: undefined,
			});
		}

		if (person.deathDate || person.deathPlace) {
			facts.push({
				type: "http://gedcomx.org/Death",
				date: person.deathDate ? { original: person.deathDate } : undefined,
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

		const response = await sdk.post<TreePersonMatchesResponse>(
			url,
			requestBody
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error("[FamilySearch SDK] Failed to match person:", error);
		return null;
	}
}

/**
 * Find person matches by example (GEDCOM X)
 *
 * Searches for matching persons in the FamilySearch tree using a GEDCOM X document.
 * This is particularly useful for matching a person from an external tree to persons
 * in the FamilySearch tree.
 *
 * The GEDCOM X document must contain:
 * - A primary person with an ID
 * - A main source description pointing to the primary person
 * - Optionally: parents, spouses, children with relationships
 *
 * Each match result includes a confidence score indicating match likelihood.
 *
 * @param sdk - SDK instance
 * @param gedcomxData - GEDCOM X document describing the person to match
 * @returns Match results with confidence scores
 * @throws Error if request fails
 *
 * @example
 * ```typescript
 * const matches = await performPersonMatchesByExample(sdk, {
 *   persons: [{
 *     id: "primaryPerson",
 *     names: [{
 *       nameForms: [{
 *         fullText: "John Smith",
 *         parts: [
 *           { type: "http://gedcomx.org/Given", value: "John" },
 *           { type: "http://gedcomx.org/Surname", value: "Smith" }
 *         ]
 *       }]
 *     }],
 *     gender: { type: "http://gedcomx.org/Male" },
 *     facts: [{
 *       type: "http://gedcomx.org/Birth",
 *       date: { original: "1850" },
 *       place: { original: "London, England" }
 *     }]
 *   }],
 *   sourceDescriptions: [{
 *     about: "#primaryPerson"
 *   }]
 * });
 *
 * matches?.entries?.forEach(entry => {
 *   console.log("Match:", entry.person?.display?.name, "Confidence:", entry.confidence);
 * });
 * ```
 */
export async function performPersonMatchesByExample(
	sdk: FamilySearchSDK,
	gedcomxData: unknown
): Promise<unknown> {
	try {
		const response = await sdk.post<unknown>(
			`/platform/tree/matches`,
			gedcomxData
		);
		return response.data;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to perform person matches by example:`,
			error
		);
		throw error;
	}
}

/**
 * MatchesAPI class provides convenient methods for managing person matches and duplicates.
 */
export class MatchesAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readPersonMatches(
		personId: string,
		options: {
			status?: string;
			collection?: string;
			count?: number;
			start?: number;
		} = {}
	) {
		return readPersonMatches(this.sdk, personId, options);
	}

	async readPersonNonMatches(personId: string) {
		return readPersonNonMatches(this.sdk, personId);
	}

	async updateMatchResolution(
		personId: string,
		matchId: string,
		status: "pending" | "accepted" | "rejected"
	) {
		return updateMatchResolution(this.sdk, personId, matchId, status);
	}

	async readNotAMatchDeclarations(personId: string) {
		return readNotAMatchDeclarations(this.sdk, personId);
	}

	async createNotAMatchDeclaration(
		personId: string,
		notAMatchPersonId: string
	) {
		return createNotAMatchDeclaration(
			this.sdk,
			personId,
			notAMatchPersonId
		);
	}

	async deleteNotAMatchDeclaration(
		personId: string,
		notAMatchPersonId: string
	) {
		return deleteNotAMatchDeclaration(
			this.sdk,
			personId,
			notAMatchPersonId
		);
	}

	async deleteAllNotAMatchDeclarations(personId: string) {
		return deleteAllNotAMatchDeclarations(this.sdk, personId);
	}

	async readTreeMatches(
		treeId: string,
		options?: {
			status?: string;
			collection?: string;
			count?: number;
			start?: number;
		}
	) {
		return readTreeMatches(this.sdk, treeId, options);
	}

	async readPersonNotAMatches(personId: string) {
		return readPersonNotAMatches(this.sdk, personId);
	}

	async updatePersonNotAMatches(
		personId: string,
		notAMatchPersonIds: string[]
	) {
		return updatePersonNotAMatches(this.sdk, personId, notAMatchPersonIds);
	}

	async deletePersonNotAMatches(personId: string) {
		return deletePersonNotAMatches(this.sdk, personId);
	}

	async deletePersonNotAMatch(personId: string, notAMatchPersonId: string) {
		return deletePersonNotAMatch(this.sdk, personId, notAMatchPersonId);
	}

	async matchPerson(
		person: PersonMatchInput,
		options: PersonMatchOptions = {}
	) {
		return matchPerson(this.sdk, person, options);
	}

	async performPersonMatchesByExample(gedcomxData: unknown) {
		return performPersonMatchesByExample(this.sdk, gedcomxData);
	}
}
