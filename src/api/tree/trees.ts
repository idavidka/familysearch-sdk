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
		const response = await sdk.post<unknown>("/platform/trees", treeData);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(`[FamilySearch SDK] Failed to create tree:`, error);
		throw error;
	}
}

/**
 * Read CET (Collaborative Extracted Tree) Person IDs
 *
 * Retrieves the list of person IDs in a CET. The list is returned as a feed
 * of entry elements where each entry contains a person ID.
 *
 * **Note**: Returns 204 No Content if the tree has no person IDs.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree ID
 * @param options - Optional pagination and view parameters
 * @param options.count - Maximum number of person IDs to return (minimum 100, default 100)
 * @param options.from - Page token for pagination (omit for first page)
 * @param options.view - Type of data to return (default "identifiers")
 * @returns Research tree persons feed or null if tree is empty
 * @throws Error if request fails
 *
 * @example
 * ```typescript
 * // Get first page of person IDs
 * const firstPage = await readResearchTreePersons(sdk, "TREE-123");
 * console.log("Person IDs:", firstPage);
 *
 * // Get specific count
 * const limited = await readResearchTreePersons(sdk, "TREE-123", { count: 200 });
 *
 * // Paginate through results
 * const nextPage = await readResearchTreePersons(sdk, "TREE-123", {
 *   from: "next-page-token"
 * });
 * ```
 */
export async function readResearchTreePersons(
	sdk: FamilySearchSDK,
	treeId: string,
	options?: {
		count?: number;
		from?: string;
		view?: string;
	}
): Promise<unknown | null> {
	try {
		const params = new URLSearchParams();

		if (options?.count !== undefined) {
			params.append("count", String(options.count));
		}

		if (options?.from) {
			params.append("from", options.from);
		}

		if (options?.view) {
			params.append("view", options.view);
		}

		const queryString = params.toString();
		const url = `/platform/trees/${treeId}/persons${
			queryString ? `?${queryString}` : ""
		}`;

		const response = await sdk.get<unknown>(url);

		// Returns 204 No Content if tree has no person IDs
		if (response.statusCode === 204) {
			return null;
		}

		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read research tree persons for tree ${treeId}:`,
			error
		);
		throw error;
	}
}

/**
 * TreesManagementAPI class provides convenient methods for managing CET (Collaborative Event Trees).
 */
export class TreesManagementAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readTree(tid: string) {
		return readTree(this.sdk, tid);
	}

	async deleteTree(tid: string) {
		return deleteTree(this.sdk, tid);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async createTree(treeData: any) {
		return createTree(this.sdk, treeData);
	}

	async readResearchTreePersons(
		treeId: string,
		options?: {
			count?: number;
			from?: string;
			view?: string;
		}
	) {
		return readResearchTreePersons(this.sdk, treeId, options);
	}
}
