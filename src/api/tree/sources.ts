/**
 * FamilySearch Sources API
 * 
 * Handles source descriptions and source box operations.
 * 
 * @see https://developers.familysearch.org/main/reference/readsourcedescription
 */

import type { FamilySearchSDK } from "../../client";
import type {
	SourceDescriptionResponse,
	SourceDescriptionsResponse,
} from "../../types";

/**
 * Get source descriptions
 * 
 * @param sdk - SDK instance
 * @returns Source descriptions or null
 */
export async function getSourceDescriptions(
	sdk: FamilySearchSDK
): Promise<SourceDescriptionsResponse | null> {
	try {
		const response = await sdk.get<SourceDescriptionsResponse>(
			"/platform/sources"
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to get source descriptions:",
			error
		);
		return null;
	}
}

/**
 * Get a specific source description
 * 
 * @param sdk - SDK instance
 * @param sourceId - Source description ID
 * @returns Source description or null
 */
export async function getSourceDescription(
	sdk: FamilySearchSDK,
	sourceId: string
): Promise<SourceDescriptionResponse | null> {
	try {
		const response = await sdk.get<SourceDescriptionResponse>(
			`/platform/sources/${sourceId}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get source description ${sourceId}:`,
			error
		);
		return null;
	}
}
