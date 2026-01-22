/**
 * FamilySearch Vocabularies API
 *
 * Handles controlled vocabularies for fact types, genders, and other standardized values.
 *
 * @see https://developers.familysearch.org/main/reference/readvocabularies
 */

import type { FamilySearchSDK } from "../../client";
import type {
	VocabulariesResponse,
	VocabularyConceptResponse,
	VocabularyConceptsResponse,
} from "../../types";

/**
 * Get all vocabularies
 *
 * @param sdk - SDK instance
 * @returns Vocabularies response or null
 */
export async function readVocabularies(
	sdk: FamilySearchSDK
): Promise<VocabulariesResponse | null> {
	try {
		const response = await sdk.get<VocabulariesResponse>(
			"/platform/vocabularies"
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			"[FamilySearch SDK] Failed to get vocabularies:",
			error
		);
		return null;
	}
}

/**
 * Get concepts for a vocabulary
 *
 * @param sdk - SDK instance
 * @param vocabularyId - Vocabulary ID (e.g., 'gender-types', 'fact-types')
 * @returns Vocabulary concepts or null
 */
export async function readVocabularyConcepts(
	sdk: FamilySearchSDK,
	vocabularyId: string
): Promise<VocabularyConceptsResponse | null> {
	try {
		const response = await sdk.get<VocabularyConceptsResponse>(
			`/platform/vocabularies/${vocabularyId}/concepts`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get concepts for vocabulary ${vocabularyId}:`,
			error
		);
		return null;
	}
}

/**
 * Get a specific vocabulary concept
 *
 * @param sdk - SDK instance
 * @param vocabularyId - Vocabulary ID
 * @param conceptId - Concept ID
 * @returns Vocabulary concept or null
 */
export async function readVocabularyConcept(
	sdk: FamilySearchSDK,
	vocabularyId: string,
	conceptId: string
): Promise<VocabularyConceptResponse | null> {
	try {
		const response = await sdk.get<VocabularyConceptResponse>(
			`/platform/vocabularies/${vocabularyId}/concepts/${conceptId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get concept ${conceptId} from vocabulary ${vocabularyId}:`,
			error
		);
		return null;
	}
}

/**
 * Search Controlled Vocabulary Terms
 *
 * Search for vocabulary concepts matching search criteria.
 * Returns the set of Controlled Vocabulary terms associated with
 * a list of Controlled Vocabulary Concepts that match the search.
 *
 * @param sdk - SDK instance
 * @param query - Search query string (optional)
 * @param vocabularyId - Vocabulary ID to search within (optional)
 * @returns Vocabulary concepts search results or null
 */
export async function readVocabConceptsSearch(
	sdk: FamilySearchSDK,
	query?: string,
	vocabularyId?: string
): Promise<VocabularyConceptsResponse | null> {
	try {
		const params = new URLSearchParams();
		if (query) params.set("q", query);
		if (vocabularyId) params.set("vocabulary", vocabularyId);

		const url = params.toString()
			? `/platform/vocab/concepts/search?${params.toString()}`
			: "/platform/vocab/concepts/search";

		const response = await sdk.get<VocabularyConceptsResponse>(url);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			"[FamilySearch SDK] Failed to search vocabulary concepts:",
			error
		);
		return null;
	}
}

/**
 * Read Vocabulary Concept V2
 *
 * Read a vocabulary concept using the V2 API.
 * Returns the set of Controlled Vocabulary terms associated with
 * a Controlled Vocabulary Concept along with the concept's definition
 * and attributes, specified by a concept id.
 *
 * @param sdk - SDK instance
 * @param cvcid - Controlled Vocabulary Concept ID
 * @returns Vocabulary concept or null
 */
export async function readVocabConceptV2(
	sdk: FamilySearchSDK,
	cvcid: string
): Promise<VocabularyConceptResponse | null> {
	try {
		const response = await sdk.get<VocabularyConceptResponse>(
			`/platform/vocab/concepts/${cvcid}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get vocabulary concept ${cvcid}:`,
			error
		);
		return null;
	}
}

/**
 * VocabulariesAPI class provides convenient methods for working with controlled vocabularies.
 */
export class VocabulariesAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readVocabularies() {
		return readVocabularies(this.sdk);
	}

	async readVocabularyConcepts(vocabularyId: string) {
		return readVocabularyConcepts(this.sdk, vocabularyId);
	}

	async readVocabularyConcept(vocabularyId: string, conceptId: string) {
		return readVocabularyConcept(this.sdk, vocabularyId, conceptId);
	}

	async searchVocabConcepts(query?: string, vocabularyId?: string) {
		return readVocabConceptsSearch(this.sdk, query, vocabularyId);
	}

	async readVocabConceptV2(cvcid: string) {
		return readVocabConceptV2(this.sdk, cvcid);
	}
}
