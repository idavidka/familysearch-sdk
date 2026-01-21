/**
 * FamilySearch Genealogies API - Trees Module
 *
 * Handles research tree (genealogy) management.
 * Genealogies are separate from the main FamilySearch Family Tree
 * and allow for hypothesis testing and research organization.
 *
 * @see https://developers.familysearch.org/main/reference/readgenealogiestree
 */

import type { FamilySearchSDK } from "../../client";
import type {
	GenealogyTree,
	GenealogyTreeResponse,
	GenealogyTreesResponse,
	CreateGenealogyTreeInput,
	UpdateGenealogyTreeInput,
} from "../../types/genealogies";

/**
 * Read a specific genealogy tree
 *
 * Returns details for a specific research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @returns Tree details or null
 *
 * @example
 * ```typescript
 * const tree = await readGenealogyTree(sdk, 'TREE-123');
 * console.log('Tree name:', tree?.trees?.[0]?.title);
 * ```
 */
export async function readGenealogyTree(
	sdk: FamilySearchSDK,
	treeId: string
): Promise<GenealogyTreeResponse | null> {
	try {
		const response = await sdk.get<GenealogyTreeResponse>(
			`/platform/genealogies/trees/${treeId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Get all genealogy trees for the current user
 *
 * Returns all research trees owned by the authenticated user.
 *
 * @param sdk - SDK instance
 * @returns List of trees or null
 *
 * @example
 * ```typescript
 * const trees = await readGenealogyTrees(sdk);
 * console.log('User has', trees?.trees?.length, 'research trees');
 * ```
 */
export async function readGenealogyTrees(
	sdk: FamilySearchSDK
): Promise<GenealogyTreesResponse | null> {
	try {
		const response = await sdk.get<GenealogyTreesResponse>(
			`/platform/genealogies/trees`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy trees:`,
			error
		);
		return null;
	}
}

/**
 * Create a new genealogy tree
 *
 * Creates a new research tree with the specified details.
 *
 * @param sdk - SDK instance
 * @param input - Tree creation data
 * @returns Created tree or null
 *
 * @example
 * ```typescript
 * const tree = await createGenealogyTree(sdk, {
 *   title: 'Smith Family Research',
 *   description: 'Research hypothesis for Smith lineage'
 * });
 * ```
 */
export async function createGenealogyTree(
	sdk: FamilySearchSDK,
	input: CreateGenealogyTreeInput
): Promise<GenealogyTreeResponse | null> {
	try {
		const response = await sdk.post<GenealogyTreeResponse>(
			`/platform/genealogies/trees`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create genealogy tree:`,
			error
		);
		return null;
	}
}

/**
 * Update an existing genealogy tree
 *
 * Updates details for an existing research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param input - Updated tree data
 * @returns Updated tree or null
 *
 * @example
 * ```typescript
 * const updated = await updateGenealogyTree(sdk, 'TREE-123', {
 *   title: 'Updated Research Title'
 * });
 * ```
 */
export async function updateGenealogyTree(
	sdk: FamilySearchSDK,
	treeId: string,
	input: UpdateGenealogyTreeInput
): Promise<GenealogyTreeResponse | null> {
	try {
		const response = await sdk.post<GenealogyTreeResponse>(
			`/platform/genealogies/trees/${treeId}`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update genealogy tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete a genealogy tree
 *
 * Deletes an existing research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * const success = await deleteGenealogyTree(sdk, 'TREE-123');
 * console.log('Deleted:', success);
 * ```
 */
export async function deleteGenealogyTree(
	sdk: FamilySearchSDK,
	treeId: string
): Promise<boolean> {
	try {
		await sdk.delete(`/platform/genealogies/trees/${treeId}`);
		return true;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete genealogy tree ${treeId}:`,
			error
		);
		return false;
	}
}

/**
 * TreesAPI class provides convenient methods for managing research trees (genealogies).
 */
export class TreesAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readTree(treeId: string) {
		return readGenealogyTree(this.sdk, treeId);
	}

	async readTrees() {
		return readGenealogyTrees(this.sdk);
	}

	async createTree(input: CreateGenealogyTreeInput) {
		return createGenealogyTree(this.sdk, input);
	}

	async updateTree(treeId: string, input: UpdateGenealogyTreeInput) {
		return updateGenealogyTree(this.sdk, treeId, input);
	}

	async deleteTree(treeId: string) {
		return deleteGenealogyTree(this.sdk, treeId);
	}
}
