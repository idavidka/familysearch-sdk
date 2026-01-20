/**
 * FamilySearch User API
 * 
 * Handles user profile and authentication.
 * 
 * @see https://developers.familysearch.org/main/reference/readcurrentuser
 */

import type { FamilySearchSDK } from "../../client";
import type { FamilySearchUser } from "../../types";

/**
 * Get current user information
 * 
 * @param sdk - SDK instance
 * @returns Current user data or null
 */
export async function getCurrentUser(
	sdk: FamilySearchSDK
): Promise<FamilySearchUser | null> {
	try {
		const response = await sdk.get<FamilySearchUser>(
			"/platform/users/current"
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to get current user:",
			error
		);
		return null;
	}
}
