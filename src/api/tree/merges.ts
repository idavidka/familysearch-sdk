/**
 * FamilySearch Person Merge API
 *
 * Handles person merge analysis and execution.
 *
 * @see https://developers.familysearch.org/main/reference/readpersonmerge
 */

import type { FamilySearchSDK } from "../../client";
import type {
	PersonMergeAnalysis,
	PersonMergeInput,
	PersonMergeResponse,
} from "../../types";

/**
 * Get merge analysis for two persons
 *
 * Analyzes potential conflicts and provides merge options.
 *
 * @param sdk - SDK instance
 * @param survivorId - ID of the person to keep (survivor)
 * @param duplicateId - ID of the person to merge away (duplicate)
 * @returns Merge analysis or null
 *
 * @example
 * ```typescript
 * const analysis = await getPersonMergeAnalysis(sdk, 'KWQS-BBQ', 'KWQS-BBC');
 * console.log('Conflicts:', analysis.conflicts);
 * ```
 */
export async function getPersonMergeAnalysis(
	sdk: FamilySearchSDK,
	survivorId: string,
	duplicateId: string
): Promise<PersonMergeAnalysis | null> {
	try {
		const response = await sdk.get<PersonMergeAnalysis>(
			`/platform/tree/persons/${survivorId}/merge?duplicate=${duplicateId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get merge analysis for ${survivorId} and ${duplicateId}:`,
			error
		);
		return null;
	}
}

/**
 * Check if person merge is allowed
 *
 * @param sdk - SDK instance
 * @param survivorId - ID of the person to keep
 * @param duplicateId - ID of the person to merge away
 * @returns True if merge is allowed
 */
export async function canMergePersons(
	sdk: FamilySearchSDK,
	survivorId: string,
	duplicateId: string
): Promise<boolean> {
	try {
		// Use HEAD request to check if merge is possible
		const response = await sdk.get<void>(
			`/platform/tree/persons/${survivorId}/merge?duplicate=${duplicateId}`
		);
		return response.statusCode === 200;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to check if merge is allowed for ${survivorId} and ${duplicateId}:`,
			error
		);
		return false;
	}
}

/**
 * Merge two persons
 *
 * Merges the duplicate person into the survivor person.
 * This is a destructive operation - the duplicate person will be deleted.
 *
 * @param sdk - SDK instance
 * @param survivorId - ID of the person to keep (survivor)
 * @param duplicateId - ID of the person to merge away (duplicate)
 * @param mergeOptions - Optional merge configuration
 * @returns Merge response
 *
 * @example
 * ```typescript
 * const result = await mergePerson(sdk, 'KWQS-BBQ', 'KWQS-BBC', {
 *   survivorId: 'KWQS-BBQ',
 *   duplicateId: 'KWQS-BBC',
 *   resolutions: [{
 *     type: 'Name',
 *     useValue: 'duplicate'
 *   }]
 * });
 * ```
 */
export async function mergePerson(
	sdk: FamilySearchSDK,
	survivorId: string,
	duplicateId: string,
	mergeOptions?: PersonMergeInput
): Promise<PersonMergeResponse | null> {
	try {
		const body = {
			persons: [
				{
					id: survivorId,
				},
			],
			...(mergeOptions?.resolutions && {
				resolutions: mergeOptions.resolutions,
			}),
		};

		const response = await sdk.post<PersonMergeResponse>(
			`/platform/tree/persons/${survivorId}/merge?duplicate=${duplicateId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to merge person ${duplicateId} into ${survivorId}:`,
			error
		);
		throw error;
	}
}
