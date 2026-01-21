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
 * Determines the writing system/script used in a name (e.g., Latin, Cyrillic, Han).
 *
 * @param sdk - SDK instance
 * @param text - Name text to analyze
 * @returns Name script response or null
 *
 * @example
 * ```typescript
 * const script = await getNameScript(sdk, 'John Smith');
 * console.log('Script:', script?.script); // "Latn"
 * ```
 */
export async function getNameScript(
	sdk: FamilySearchSDK,
	text: string
): Promise<NameScriptResponse | null> {
	try {
		const params = new URLSearchParams({ text });

		const response = await sdk.get<NameScriptResponse>(
			`/platform/names/script?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get name script for "${text}":`,
			error
		);
		return null;
	}
}

/**
 * Get name segments for a name
 *
 * Segments a full name into its component parts (given names, surname, etc.)
 * based on locale-specific parsing rules.
 *
 * @param sdk - SDK instance
 * @param fullName - Full name to segment
 * @param locale - Optional locale for parsing rules (e.g., 'en-US', 'ja-JP')
 * @param lang - Optional language code for parsing (e.g., 'en', 'ja')
 * @returns Name segments response or null
 *
 * @example
 * ```typescript
 * const segments = await getNameSegments(sdk, 'John Robert Smith', 'en-US');
 * console.log('Given:', segments?.givenName); // "John Robert"
 * console.log('Surname:', segments?.surname); // "Smith"
 * ```
 */
export async function getNameSegments(
	sdk: FamilySearchSDK,
	fullName: string,
	locale?: string,
	lang?: string
): Promise<NameSegmentsResponse | null> {
	try {
		const params = new URLSearchParams({ fullName });
		if (locale) {
			params.append("locale", locale);
		}
		if (lang) {
			params.append("lang", lang);
		}

		const response = await sdk.get<NameSegmentsResponse>(
			`/platform/names/segments?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get name segments for "${fullName}":`,
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
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create name from segments:`,
			error
		);
		return null;
	}
}
