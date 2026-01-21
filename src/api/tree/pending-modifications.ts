/**
 * FamilySearch Pending Modifications API
 *
 * Handles pending changes to the tree.
 *
 * @see https://developers.familysearch.org/main/reference/readpendingmodifications
 */

import type { FamilySearchSDK } from "../../client";
import type { PendingModificationsResponse } from "../../types";

/**
 * Read pending modifications
 *
 * Returns pending changes/modifications to the tree that haven't been
 * fully processed or committed yet.
 *
 * @param sdk - SDK instance
 * @returns Pending modifications or null
 *
 * @example
 * ```typescript
 * const pending = await readPendingModifications(sdk);
 * console.log('Pending changes:', pending?.entries?.length);
 * ```
 */
export async function readPendingModifications(
	sdk: FamilySearchSDK
): Promise<PendingModificationsResponse | null> {
	try {
		const response = await sdk.get<PendingModificationsResponse>(
			`/platform/tree/pending-modifications`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get pending modifications:`,
			error
		);
		return null;
	}
}
