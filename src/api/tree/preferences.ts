/**
 * FamilySearch Preferred Relationships API
 *
 * Handles preferred parent and spouse relationship settings for persons.
 * When a person has multiple parent or spouse relationships, these endpoints
 * allow marking which relationship should be displayed first in family tree views.
 *
 * @see https://developers.familysearch.org/docs/api/tree/Persons_Preferred_Spouse_Relationship_resource
 */

import type { FamilySearchSDK } from "../../client";
import type {
	PreferredRelationshipResponse,
	SetPreferredRelationshipInput,
	DeleteResponse,
} from "../../types";

/**
 * Get preferred parent relationship for a user and person
 *
 * Returns the preferred child-and-parents relationship for display purposes.
 * If no preference is set, returns null.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (e.g., "cis.user.MMMM.MMMM")
 * @param personId - Person ID
 * @returns Preferred parent relationship or null
 *
 * @example
 * ```typescript
 * const preferred = await readPreferredParentRelationship(sdk, "cis.user.MMMM.MMMM", "PPPP-PPP");
 * if (preferred?.childAndParentsRelationships?.[0]) {
 *   console.log("Preferred parents:", preferred.childAndParentsRelationships[0]);
 * }
 * ```
 */
export async function readPreferredParentRelationship(
	sdk: FamilySearchSDK,
	userId: string,
	personId: string
): Promise<PreferredRelationshipResponse | null> {
	try {
		const response = await sdk.get<PreferredRelationshipResponse>(
			`/platform/tree/users/${userId}/preferred-parent-relationships/${personId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get preferred parent relationship for user ${userId}, person ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Set preferred parent relationship for a user and person
 *
 * Marks a specific child-and-parents relationship as preferred for display.
 * This controls which parents are shown first in family tree views when
 * a person has multiple parent relationships.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (e.g., "cis.user.MMMM.MMMM")
 * @param personId - Person ID
 * @param relationshipId - Child-and-parents relationship ID to prefer
 * @returns Updated preferred relationship data
 * @throws Error if update fails
 *
 * @example
 * ```typescript
 * await setPreferredParentRelationship(sdk, "cis.user.MMMM.MMMM", "PPPP-PPP", "RRRR-RRR");
 * console.log("Preferred parent relationship set");
 * ```
 */
export async function setPreferredParentRelationship(
	sdk: FamilySearchSDK,
	userId: string,
	personId: string,
	relationshipId: string
): Promise<PreferredRelationshipResponse> {
	try {
		const input: SetPreferredRelationshipInput = {
			relationships: [
				{
					resourceId: relationshipId,
					resource: `#${relationshipId}`,
				},
			],
		};

		const response = await sdk.put<PreferredRelationshipResponse>(
			`/platform/tree/users/${userId}/preferred-parent-relationships/${personId}`,
			input
		);
		return response.data || { relationships: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to set preferred parent relationship for user ${userId}, person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete preferred parent relationship for a user and person
 *
 * Removes the preferred parent relationship setting, returning to default ordering.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (e.g., "cis.user.MMMM.MMMM")
 * @param personId - Person ID
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * const result = await deletePreferredParentRelationship(sdk, "cis.user.MMMM.MMMM", "PPPP-PPP");
 * console.log("Status:", result.statusCode);
 * ```
 */
export async function deletePreferredParentRelationship(
	sdk: FamilySearchSDK,
	userId: string,
	personId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/users/${userId}/preferred-parent-relationships/${personId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete preferred parent relationship for user ${userId}, person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get preferred spouse relationship for a user and person
 *
 * Returns the preferred couple relationship for display purposes.
 * If no preference is set, returns null.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (e.g., "cis.user.MMMM.MMMM")
 * @param personId - Person ID
 * @returns Preferred spouse relationship or null
 *
 * @example
 * ```typescript
 * const preferred = await readPreferredSpouseRelationship(sdk, "cis.user.MMMM.MMMM", "PPPP-PPP");
 * if (preferred?.relationships?.[0]) {
 *   console.log("Preferred spouse:", preferred.relationships[0]);
 * }
 * ```
 */
export async function readPreferredSpouseRelationship(
	sdk: FamilySearchSDK,
	userId: string,
	personId: string
): Promise<PreferredRelationshipResponse | null> {
	try {
		const response = await sdk.get<PreferredRelationshipResponse>(
			`/platform/tree/users/${userId}/preferred-spouse-relationships/${personId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get preferred spouse relationship for user ${userId}, person ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Set preferred spouse relationship for a user and person
 *
 * Marks a specific couple relationship as preferred for display.
 * This controls which spouse is shown first in family tree views when
 * a person has multiple spouse relationships.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (e.g., "cis.user.MMMM.MMMM")
 * @param personId - Person ID
 * @param relationshipId - Couple relationship ID to prefer
 * @returns Updated preferred relationship data
 * @throws Error if update fails
 *
 * @example
 * ```typescript
 * await setPreferredSpouseRelationship(sdk, "cis.user.MMMM.MMMM", "PPPP-PPP", "RRRR-RRR");
 * console.log("Preferred spouse relationship set");
 * ```
 */
export async function setPreferredSpouseRelationship(
	sdk: FamilySearchSDK,
	userId: string,
	personId: string,
	relationshipId: string
): Promise<PreferredRelationshipResponse> {
	try {
		const input: SetPreferredRelationshipInput = {
			relationships: [
				{
					resourceId: relationshipId,
					resource: `#${relationshipId}`,
				},
			],
		};

		const response = await sdk.put<PreferredRelationshipResponse>(
			`/platform/tree/users/${userId}/preferred-spouse-relationships/${personId}`,
			input
		);
		return response.data || { relationships: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to set preferred spouse relationship for user ${userId}, person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete preferred spouse relationship for a user and person
 *
 * Removes the preferred spouse relationship setting, returning to default ordering.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (e.g., "cis.user.MMMM.MMMM")
 * @param personId - Person ID
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * const result = await deletePreferredSpouseRelationship(sdk, "cis.user.MMMM.MMMM", "PPPP-PPP");
 * console.log("Status:", result.statusCode);
 * ```
 */
export async function deletePreferredSpouseRelationship(
	sdk: FamilySearchSDK,
	userId: string,
	personId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/users/${userId}/preferred-spouse-relationships/${personId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete preferred spouse relationship for user ${userId}, person ${personId}:`,
			error
		);
		throw error;
	}
}
