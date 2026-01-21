/**
 * FamilySearch Tree Changes API
 *
 * Handles reading changes to the entire tree.
 *
 * @see https://developers.familysearch.org/main/reference/readtreechanges
 */

import type { FamilySearchSDK } from "../../client";
import type { TreeChangesResponse } from "../../types/tree";

/**
 * Read tree changes
 *
 * Returns recent changes made to the FamilySearch Family Tree.
 * This is useful for monitoring tree activity and recent edits.
 *
 * @param sdk - SDK instance
 * @param options - Optional query parameters
 * @returns Tree changes or null
 *
 * @example
 * ```typescript
 * const changes = await readTreeChanges(sdk, { count: 50 });
 * console.log('Recent changes:', changes?.entries?.length);
 * ```
 */
export async function readTreeChanges(
	sdk: FamilySearchSDK,
	options?: {
		count?: number;
		from?: number;
	}
): Promise<TreeChangesResponse | null> {
	try {
		const params = new URLSearchParams();
		if (options?.count) params.append("count", options.count.toString());
		if (options?.from) params.append("from", options.from.toString());

		const url = `/platform/tree/changes${params.toString() ? `?${params.toString()}` : ""}`;
		const response = await sdk.get<TreeChangesResponse>(url);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get tree changes:`,
			error
		);
		return null;
	}
}
