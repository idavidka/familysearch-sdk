/**
 * FamilySearch Vocabulary API
 *
 * Handles vocabulary concepts, terms, translations, and definitions.
 * Used for controlled vocabularies in FamilySearch (e.g., relationship types, fact types).
 *
 * @see https://developers.familysearch.org/main/reference/readvocabconceptssearch
 */

import type { FamilySearchSDK } from "../../client";
import type {
	VocabConceptSearchResponse,
	VocabTermResponse,
	VocabTermTranslationResponse,
	VocabConceptResponse,
	VocabConceptDefinitionResponse,
	VocabListResponse,
} from "../../types/vocab";

/**
 * Search vocabulary concepts
 *
 * Searches for vocabulary concepts by query string.
 *
 * @param sdk - SDK instance
 * @param query - Search query
 * @param options - Optional search parameters
 * @returns Search results or null
 *
 * @example
 * ```typescript
 * const results = await searchVocabConcepts(sdk, 'marriage', { lang: 'en' });
 * console.log('Found', results?.entries?.length, 'concepts');
 * ```
 */
export async function searchVocabConcepts(
	sdk: FamilySearchSDK,
	query: string,
	options?: {
		lang?: string;
		scheme?: string;
	}
): Promise<VocabConceptSearchResponse | null> {
	try {
		const params = new URLSearchParams({ q: query });
		if (options?.lang) params.append("lang", options.lang);
		if (options?.scheme) params.append("scheme", options.scheme);

		const response = await sdk.get<VocabConceptSearchResponse>(
			`/platform/vocab/concepts?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to search vocab concepts:`,
			error
		);
		return null;
	}
}

/**
 * Read a vocabulary term
 *
 * Returns details for a specific vocabulary term.
 *
 * @param sdk - SDK instance
 * @param termId - Term identifier
 * @returns Term details or null
 *
 * @example
 * ```typescript
 * const term = await readVocabTerm(sdk, 'Marriage');
 * console.log('Term label:', term?.labels?.[0]?.value);
 * ```
 */
export async function readVocabTerm(
	sdk: FamilySearchSDK,
	termId: string
): Promise<VocabTermResponse | null> {
	try {
		const response = await sdk.get<VocabTermResponse>(
			`/platform/vocab/terms/${termId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get vocab term ${termId}:`,
			error
		);
		return null;
	}
}

/**
 * Read vocabulary term translation
 *
 * Returns translation for a vocabulary term in a specific language.
 *
 * @param sdk - SDK instance
 * @param termId - Term identifier
 * @param lang - Language code (e.g., 'en', 'es', 'de')
 * @returns Term translation or null
 *
 * @example
 * ```typescript
 * const translation = await readVocabTermTranslation(sdk, 'Marriage', 'es');
 * console.log('Spanish label:', translation?.labels?.[0]?.value);
 * ```
 */
export async function readVocabTermTranslation(
	sdk: FamilySearchSDK,
	termId: string,
	lang: string
): Promise<VocabTermTranslationResponse | null> {
	try {
		const response = await sdk.get<VocabTermTranslationResponse>(
			`/platform/vocab/terms/${termId}/translations/${lang}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get vocab term translation for ${termId} in ${lang}:`,
			error
		);
		return null;
	}
}

/**
 * Read vocabulary concept (v2)
 *
 * Returns details for a specific vocabulary concept (version 2 API).
 *
 * @param sdk - SDK instance
 * @param conceptId - Concept identifier
 * @returns Concept details or null
 *
 * @example
 * ```typescript
 * const concept = await readVocabConcept(sdk, 'http://gedcomx.org/Marriage');
 * console.log('Concept type:', concept?.type);
 * ```
 */
export async function readVocabConcept(
	sdk: FamilySearchSDK,
	conceptId: string
): Promise<VocabConceptResponse | null> {
	try {
		const response = await sdk.get<VocabConceptResponse>(
			`/platform/vocab/concepts/${encodeURIComponent(conceptId)}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get vocab concept ${conceptId}:`,
			error
		);
		return null;
	}
}

/**
 * Read vocabulary concept definition
 *
 * Returns the definition for a vocabulary concept.
 *
 * @param sdk - SDK instance
 * @param conceptId - Concept identifier
 * @param lang - Optional language code
 * @returns Concept definition or null
 *
 * @example
 * ```typescript
 * const definition = await readVocabConceptDefinition(sdk, 'http://gedcomx.org/Marriage', 'en');
 * console.log('Definition:', definition?.description);
 * ```
 */
export async function readVocabConceptDefinition(
	sdk: FamilySearchSDK,
	conceptId: string,
	lang?: string
): Promise<VocabConceptDefinitionResponse | null> {
	try {
		const url = lang
			? `/platform/vocab/concepts/${encodeURIComponent(conceptId)}/definitions/${lang}`
			: `/platform/vocab/concepts/${encodeURIComponent(conceptId)}/definition`;

		const response = await sdk.get<VocabConceptDefinitionResponse>(url);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get vocab concept definition for ${conceptId}:`,
			error
		);
		return null;
	}
}

/**
 * Read vocabulary list
 *
 * Returns a list of vocabulary schemes/lists.
 *
 * @param sdk - SDK instance
 * @returns List of vocabulary schemes or null
 *
 * @example
 * ```typescript
 * const lists = await readVocabList(sdk);
 * console.log('Available vocabularies:', lists?.schemes?.length);
 * ```
 */
export async function readVocabList(
	sdk: FamilySearchSDK
): Promise<VocabListResponse | null> {
	try {
		const response =
			await sdk.get<VocabListResponse>(`/platform/vocab/list`);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(`[FamilySearch SDK] Failed to get vocab list:`, error);
		return null;
	}
}

/**
 * VocabAPI class provides convenient methods for vocabulary concepts, terms, and translations.
 */
export class VocabAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async searchVocabConcepts(
		query: string,
		options?: { lang?: string; scheme?: string }
	) {
		return searchVocabConcepts(this.sdk, query, options);
	}

	async readVocabTerm(termId: string) {
		return readVocabTerm(this.sdk, termId);
	}

	async readVocabTermTranslation(termId: string, lang: string) {
		return readVocabTermTranslation(this.sdk, termId, lang);
	}

	async readVocabConcept(conceptId: string) {
		return readVocabConcept(this.sdk, conceptId);
	}

	async readVocabConceptDefinition(conceptId: string, lang?: string) {
		return readVocabConceptDefinition(this.sdk, conceptId, lang);
	}

	async readVocabList() {
		return readVocabList(this.sdk);
	}
}
