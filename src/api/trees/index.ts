/**
 * FamilySearch Trees API
 *
 * Handles tree operations and tree management.
 *
 * @see https://developers.familysearch.org/main/reference/readcurrenttree
 */

import type { FamilySearchSDK } from "../../client";

/**
 * Tree response containing tree information
 */
export interface TreeResponse {
	id?: string;
	title?: string;
	description?: string;
	[key: string]: unknown;
}

/**
 * Get the ID of the current tree
 *
 * Retrieves the identifier of the tree that is currently being accessed
 * by the authenticated user.
 *
 * @param sdk - SDK instance
 * @returns Tree information or null
 *
 * @example
 * ```typescript
 * const currentTree = await readCurrentTree(sdk);
 * console.log('Current tree ID:', currentTree?.id);
 * ```
 */
export async function readCurrentTree(
	sdk: FamilySearchSDK
): Promise<TreeResponse | null> {
	try {
		const response = await sdk.get<TreeResponse>("/platform/trees/current");
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			"[FamilySearch SDK] Failed to get current tree:",
			error
		);
		return null;
	}
}

/**
 * CurrentTreeAPI class provides convenient methods for accessing current tree information.
 */
export class CurrentTreeAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readCurrentTree() {
		return readCurrentTree(this.sdk);
	}
}
