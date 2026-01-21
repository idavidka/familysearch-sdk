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
export async function getVocabularies(
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
export async function getVocabularyConcepts(
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
export async function getVocabularyConcept(
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
