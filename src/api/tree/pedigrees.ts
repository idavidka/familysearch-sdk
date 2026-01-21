/**
 * FamilySearch Pedigrees API
 *
 * Handles pedigree (ancestry/descendancy) queries in the FamilySearch Family Tree.
 *
 * @see https://developers.familysearch.org/main/reference/readancestry
 */

import type { FamilySearchSDK } from "../../client";
import type { PedigreeResponse } from "../../types";

/**
 * Get ancestry pedigree for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param generations - Number of generations (default: 4, max: 8)
 * @returns Ancestry pedigree data or null
 *
 * @example
 * ```typescript
 * const ancestry = await readAncestry(sdk, 'KWQS-BBQ', 5);
 * ```
 */
export async function readAncestry(
	sdk: FamilySearchSDK,
	personId: string,
	generations: number = 4
): Promise<PedigreeResponse | null> {
	try {
		const response = await sdk.get<PedigreeResponse>(
			`/platform/tree/ancestry?person=${personId}&generations=${generations}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get ancestry for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get descendancy pedigree for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param generations - Number of generations (default: 2, max: 8)
 * @returns Descendancy pedigree data or null
 *
 * @example
 * ```typescript
 * const descendants = await readDescendancy(sdk, 'KWQS-BBQ', 3);
 * ```
 */
export async function readDescendancy(
	sdk: FamilySearchSDK,
	personId: string,
	generations: number = 2
): Promise<PedigreeResponse | null> {
	try {
		const response = await sdk.get<PedigreeResponse>(
			`/platform/tree/descendancy?person=${personId}&generations=${generations}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get descendancy for ${personId}:`,
			error
		);
		return null;
	}
}
