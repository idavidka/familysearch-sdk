/**
 * FamilySearch Dates API
 *
 * Handles date standardization and normalization.
 *
 * @see https://developers.familysearch.org/main/reference/normalizedate
 */

import type { FamilySearchSDK } from "../../client";
import type { DateStandardizationResponse } from "../../types";

/**
 * Normalize a date string
 *
 * @param sdk - SDK instance
 * @param dateString - Date string to normalize (e.g., "1850", "January 1850")
 * @returns Normalized date info or null
 *
 * @example
 * ```typescript
 * const normalized = await normalizeDate(sdk, 'January 1850');
 * // Returns: { normalized: ['+1850-01'], ... }
 * ```
 */
export async function normalizeDate(
	sdk: FamilySearchSDK,
	dateString: string
): Promise<DateStandardizationResponse | null> {
	try {
		const params = new URLSearchParams({ date: dateString });

		const response = await sdk.get<DateStandardizationResponse>(
			`/platform/dates?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to normalize date "${dateString}":`,
			error
		);
		return null;
	}
}

/**
 * DatesAPI class provides convenient methods for date standardization and normalization.
 */
export class DatesAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async normalizeDate(dateString: string) {
		return normalizeDate(this.sdk, dateString);
	}
}
