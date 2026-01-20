/**
 * FamilySearch Genealogies API - Sources Module
 * 
 * Handles source description management within research trees (genealogies).
 * 
 * @see https://developers.familysearch.org/main/reference/readgenealogiessourcedescription
 */

import type { FamilySearchSDK } from "../../client";
import type {
	GenealogySourceDescriptionResponse,
	CreateGenealogySourceDescriptionInput,
	UpdateGenealogySourceDescriptionInput,
} from "../../types/genealogies";

/**
 * Read a source description in a genealogy tree
 * 
 * Returns details for a source description within a research tree.
 * 
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param sourceId - Source description identifier
 * @returns Source description or null
 * 
 * @example
 * ```typescript
 * const source = await getGenealogySourceDescription(sdk, 'TREE-123', 'SRC-456');
 * console.log('Source title:', source?.sourceDescriptions?.[0]?.titles?.[0]?.value);
 * ```
 */
export async function getGenealogySourceDescription(
	sdk: FamilySearchSDK,
	treeId: string,
	sourceId: string
): Promise<GenealogySourceDescriptionResponse | null> {
	try {
		const response = await sdk.get<GenealogySourceDescriptionResponse>(
			`/platform/genealogies/trees/${treeId}/sources/${sourceId}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get genealogy source ${sourceId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a new source description in a genealogy tree
 * 
 * Adds a new source description to a research tree.
 * 
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param input - Source description creation data
 * @returns Created source description or null
 * 
 * @example
 * ```typescript
 * const source = await createGenealogySourceDescription(sdk, 'TREE-123', {
 *   titles: [{ value: '1900 Census' }],
 *   citations: [{ value: 'Page 123, Line 45' }]
 * });
 * ```
 */
export async function createGenealogySourceDescription(
	sdk: FamilySearchSDK,
	treeId: string,
	input: CreateGenealogySourceDescriptionInput
): Promise<GenealogySourceDescriptionResponse | null> {
	try {
		const response = await sdk.post<GenealogySourceDescriptionResponse>(
			`/platform/genealogies/trees/${treeId}/sources`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to create genealogy source in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Update an existing source description in a genealogy tree
 * 
 * Updates details for a source description within a research tree.
 * 
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param sourceId - Source description identifier
 * @param input - Updated source description data
 * @returns Updated source description or null
 * 
 * @example
 * ```typescript
 * const updated = await updateGenealogySourceDescription(sdk, 'TREE-123', 'SRC-456', {
 *   titles: [{ value: 'Updated Census Record' }]
 * });
 * ```
 */
export async function updateGenealogySourceDescription(
	sdk: FamilySearchSDK,
	treeId: string,
	sourceId: string,
	input: UpdateGenealogySourceDescriptionInput
): Promise<GenealogySourceDescriptionResponse | null> {
	try {
		const response = await sdk.post<GenealogySourceDescriptionResponse>(
			`/platform/genealogies/trees/${treeId}/sources/${sourceId}`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update genealogy source ${sourceId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete a source description from a genealogy tree
 * 
 * Removes a source description from a research tree.
 * 
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param sourceId - Source description identifier
 * @returns Success status
 * 
 * @example
 * ```typescript
 * const success = await deleteGenealogySourceDescription(sdk, 'TREE-123', 'SRC-456');
 * console.log('Deleted:', success);
 * ```
 */
export async function deleteGenealogySourceDescription(
	sdk: FamilySearchSDK,
	treeId: string,
	sourceId: string
): Promise<boolean> {
	try {
		await sdk.delete(
			`/platform/genealogies/trees/${treeId}/sources/${sourceId}`
		);
		return true;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete genealogy source ${sourceId} in tree ${treeId}:`,
			error
		);
		return false;
	}
}
