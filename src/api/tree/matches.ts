/**
 * FamilySearch Matches API
 * 
 * Handles record matches, record hints, and potential duplicates.
 * 
 * @see https://developers.familysearch.org/main/reference/readpersonmatches
 */

import type { FamilySearchSDK } from "../../client";
import type { MatchesResponse } from "../../types";

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
		sdk["logger"].error(
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
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get non-matches for ${personId}:`,
			error
		);
		return null;
	}
}
