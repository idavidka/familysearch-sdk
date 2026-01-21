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
} from "../../types";

/**
 * Get record matches for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Matches data or null
 */
export async function getPersonMatches(
	sdk: FamilySearchSDK,
	personId: string
): Promise<MatchesResponse | null> {
	try {
		const response = await sdk.get<MatchesResponse>(
			`/platform/tree/persons/${personId}/matches`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get matches for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get non-matches for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Non-matches data or null
 */
export async function getPersonNonMatches(
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
			`[FamilySearch SDK] Failed to get non-matches for ${personId}:`,
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
 * const notMatches = await getNotAMatchDeclarations(sdk, "PPPP-PPP");
 * if (notMatches?.persons) {
 *   console.log("Not-a-match persons:", notMatches.persons.length);
 * }
 * ```
 */
export async function getNotAMatchDeclarations(
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
 * const matches = await getTreeMatches(sdk, "TREE-ID");
 *
 * // Get matches with filtering
 * const filtered = await getTreeMatches(sdk, "TREE-ID", {
 *   status: "pending",
 *   collection: "census"
 * });
 * ```
 */
export async function getTreeMatches(
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
 * const notMatches = await getPersonNotAMatches(sdk, 'PPPP-PPP');
 * console.log('Not-a-match declarations:', notMatches?.entries?.length);
 * ```
 */
export async function getPersonNotAMatches(
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
		// Build persons array for GedcomX format
		const input = {
			persons: notAMatchIds.map((id) => ({ id })),
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
 * Get Tree Person Matches
 *
 * Retrieves match information for a person from a specified collection.
 * Match results can be filtered by status, collection type, and confidence level.
 *
 * @param sdk - SDK instance
 * @param personId - The ID of the person whose matches are requested
 * @param options - Optional filter and pagination parameters
 * @param options.collection - Collection to search ("tree", "cet", or "records", default "tree")
 * @param options.confidence - Confidence level 1-5 (higher = more confident)
 * @param options.count - Number of results to return, 1-100 (default 5)
 * @param options.status - Match status filter (e.g., "pending", "accepted")
 * @param options.treeId - Tree ID for CET collection matches
 * @returns Match data or null if no matches found
 * @throws Error if request fails
 *
 * @see https://www.familysearch.org/developers/docs/api/tree/Read_Tree_Person_Matches_usecase
 *
 * @example
 * ```typescript
 * // Get default matches from tree collection
 * const matches = await getTreePersonMatches(sdk, "PPPP-PPP");
 *
 * // Get high-confidence matches from records
 * const recordMatches = await getTreePersonMatches(sdk, "PPPP-PPP", {
 *   collection: "records",
 *   confidence: 4,
 *   count: 20
 * });
 *
 * // Get matches from CET with tree ID
 * const cetMatches = await getTreePersonMatches(sdk, "PPPP-PPP", {
 *   collection: "cet",
 *   treeId: "TREE-123"
 * });
 * ```
 */
export async function getTreePersonMatches(
	sdk: FamilySearchSDK,
	personId: string,
	options?: {
		collection?: "tree" | "cet" | "records";
		confidence?: number;
		count?: number;
		status?: string;
		treeId?: string;
	}
): Promise<unknown | null> {
	try {
		const params = new URLSearchParams();

		if (options?.collection) {
			params.append("collection", options.collection);
		}

		if (options?.confidence !== undefined) {
			params.append("confidence", String(options.confidence));
		}

		if (options?.count !== undefined) {
			params.append("count", String(options.count));
		}

		if (options?.status) {
			params.append("status", options.status);
		}

		if (options?.treeId) {
			params.append("treeId", options.treeId);
		}

		const queryString = params.toString();
		const url = `/platform/tree/persons/${personId}/matches${
			queryString ? `?${queryString}` : ""
		}`;

		const response = await sdk.get<unknown>(url);

		// Returns 204 No Content if no matches found
		if (response.statusCode === 204) {
			return null;
		}

		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read tree person matches for ${personId}:`,
			error
		);
		throw error;
	}
}
