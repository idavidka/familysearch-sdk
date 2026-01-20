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
	CreateNameSegmentsInput,
	CreateNameSegmentsResponse,
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

/**
 * Create name from segments
 * 
 * Combines name segments (given name, surname, prefix, suffix) into
 * a properly formatted full name according to cultural conventions.
 * 
 * @param sdk - SDK instance
 * @param segments - Array of name segments with types and values
 * @returns Formatted full name or null
 * @throws Error if creation fails
 * 
 * @example
 * ```typescript
 * const result = await createNameSegments(sdk, {
 *   segments: [
 *     { type: 'Given', value: 'John' },
 *     { type: 'Given', value: 'Michael' },
 *     { type: 'Surname', value: 'Smith' }
 *   ]
 * });
 * console.log('Full name:', result?.name); // "John Michael Smith"
 * ```
 */
export async function createNameSegments(
	sdk: FamilySearchSDK,
	input: CreateNameSegmentsInput
): Promise<CreateNameSegmentsResponse | null> {
	try {
		const response = await sdk.post<CreateNameSegmentsResponse>(
			`/platform/names/segments`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to create name from segments:`,
			error
		);
		return null;
	}
}
