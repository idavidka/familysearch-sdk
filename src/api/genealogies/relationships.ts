/**
 * FamilySearch Genealogies API - Relationships Module
 * 
 * Handles relationship management within research trees (genealogies).
 * 
 * @see https://developers.familysearch.org/main/reference/updategenealogiesrelationship
 */

import type { FamilySearchSDK } from "../../client";
import type {
	GenealogyRelationshipResponse,
	UpdateGenealogyRelationshipInput,
} from "../../types/genealogies";

/**
 * Update a relationship in a genealogy tree
 * 
 * Updates details for a relationship within a research tree.
 * 
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param relationshipId - Relationship identifier
 * @param input - Updated relationship data
 * @returns Updated relationship or null
 * 
 * @example
 * ```typescript
 * const updated = await updateGenealogyRelationship(sdk, 'TREE-123', 'REL-456', {
 *   facts: [{ type: 'Marriage', date: '1900' }]
 * });
 * ```
 */
export async function updateGenealogyRelationship(
	sdk: FamilySearchSDK,
	treeId: string,
	relationshipId: string,
	input: UpdateGenealogyRelationshipInput
): Promise<GenealogyRelationshipResponse | null> {
	try {
		const response = await sdk.post<GenealogyRelationshipResponse>(
			`/platform/genealogies/trees/${treeId}/relationships/${relationshipId}`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update genealogy relationship ${relationshipId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete a relationship from a genealogy tree
 * 
 * Removes a relationship from a research tree.
 * 
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param relationshipId - Relationship identifier
 * @returns Success status
 * 
 * @example
 * ```typescript
 * const success = await deleteGenealogyRelationship(sdk, 'TREE-123', 'REL-456');
 * console.log('Deleted:', success);
 * ```
 */
export async function deleteGenealogyRelationship(
	sdk: FamilySearchSDK,
	treeId: string,
	relationshipId: string
): Promise<boolean> {
	try {
		await sdk.delete(
			`/platform/genealogies/trees/${treeId}/relationships/${relationshipId}`
		);
		return true;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete genealogy relationship ${relationshipId} in tree ${treeId}:`,
			error
		);
		return false;
	}
}
