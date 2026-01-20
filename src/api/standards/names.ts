/**
 * FamilySearch Names API
 * 
 * Handles name scripts and segmentation.
 * 
 * @see https://developers.familysearch.org/main/reference/readnamescript
 */

import type { FamilySearchSDK } from "../../client";
import type {
	NameScriptResponse,
	NameSegmentsResponse,
} from "../../types";

/**
 * Get name script for a name
 * 
 * @param sdk - SDK instance
 * @param name - Name to analyze
 * @returns Name script response or null
 */
export async function getNameScript(
	sdk: FamilySearchSDK,
	name: string
): Promise<NameScriptResponse | null> {
	try {
		const params = new URLSearchParams({ name });

		const response = await sdk.get<NameScriptResponse>(
			`/platform/names/script?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get name script for "${name}":`,
			error
		);
		return null;
	}
}

/**
 * Get name segments for a name
 * 
 * @param sdk - SDK instance
 * @param name - Name to segment
 * @returns Name segments response or null
 */
export async function getNameSegments(
	sdk: FamilySearchSDK,
	name: string
): Promise<NameSegmentsResponse | null> {
	try {
		const params = new URLSearchParams({ name });

		const response = await sdk.get<NameSegmentsResponse>(
			`/platform/names/segments?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get name segments for "${name}":`,
			error
		);
		return null;
	}
}
