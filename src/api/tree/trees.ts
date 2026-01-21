/**
 * FamilySearch Trees API
 *
 * Handles CRUD operations for trees (CET - Collaborative Event Trees).
 *
 * @see https://developers.familysearch.org/main/reference/trees
 */

import type { FamilySearchSDK } from "../../client";

/**
 * Get Tree
 *
 * Read a CET (Collaborative Event Tree) specified by the tree ID.
 *
 * @param sdk - SDK instance
 * @param tid - Tree ID
 * @returns Tree data or null
 *
 * @example
 * ```typescript
 * const tree = await readTree(sdk, 'TREE-123');
 * console.log('Tree name:', tree?.name);
 * ```
 */
export async function readTree(
	sdk: FamilySearchSDK,
	tid: string
): Promise<unknown> {
	try {
		const response = await sdk.get<unknown>(`/platform/trees/${tid}`);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get tree ${tid}:`,
			error
		);
		return null;
	}
}

/**
 * Delete Tree
 *
 * Delete a CET (Collaborative Event Tree).
 *
 * @param sdk - SDK instance
 * @param tid - Tree ID
 * @returns Promise that resolves when tree is deleted
 *
 * @example
 * ```typescript
 * await deleteTree(sdk, 'TREE-123');
 * console.log('Tree deleted successfully');
 * ```
 */
export async function deleteTree(
	sdk: FamilySearchSDK,
	tid: string
): Promise<void> {
	try {
		await sdk.delete(`/platform/trees/${tid}`);
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete tree ${tid}:`,
			error
		);
		throw error;
	}
}

/**
 * Create Tree
 *
 * Create a CET (Collaborative Event Tree). A CET is represented as a
 * GedcomX FamilySearch extension Tree.
 *
 * @param sdk - SDK instance
 * @param treeData - Tree data to create
 * @returns Created tree response
 *
 * @example
 * ```typescript
 * const newTree = await createTree(sdk, {
 *   name: 'My Family Tree',
 *   description: 'Research project for Smith family'
 * });
 * console.log('Tree created:', newTree);
 * ```
 */
export async function createTree(
	sdk: FamilySearchSDK,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	treeData: any
): Promise<unknown> {
	try {
		const response = await sdk.post<unknown>(
			"/platform/trees",
			treeData
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(`[FamilySearch SDK] Failed to create tree:`, error);
		throw error;
	}
}
