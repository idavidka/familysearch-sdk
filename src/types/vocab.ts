/**
 * FamilySearch Vocabulary API Types
 * 
 * Type definitions for vocabulary concepts, terms, translations, and definitions.
 */

// ====================================
// Vocabulary Concept Types
// ====================================

/**
 * Vocabulary concept search result
 */
export interface VocabConceptSearchResult {
	id?: string;
	type?: string;
	title?: string;
	labels?: Array<{
		lang?: string;
		value?: string;
	}>;
	descriptions?: Array<{
		lang?: string;
		value?: string;
	}>;
}

/**
 * Vocabulary concept search response
 */
export interface VocabConceptSearchResponse {
	entries?: VocabConceptSearchResult[];
	results?: number;
}

/**
 * Vocabulary concept
 */
export interface VocabConcept {
	id?: string;
	type?: string;
	title?: string;
	labels?: Array<{
		lang?: string;
		value?: string;
	}>;
	descriptions?: Array<{
		lang?: string;
		value?: string;
	}>;
	broader?: Array<{
		resource?: string;
	}>;
	narrower?: Array<{
		resource?: string;
	}>;
	related?: Array<{
		resource?: string;
	}>;
}

/**
 * Vocabulary concept response
 */
export interface VocabConceptResponse {
	concepts?: VocabConcept[];
}

/**
 * Vocabulary concept definition
 */
export interface VocabConceptDefinition {
	id?: string;
	lang?: string;
	description?: string;
	examples?: string[];
	usage?: string;
}

/**
 * Vocabulary concept definition response
 */
export interface VocabConceptDefinitionResponse {
	definitions?: VocabConceptDefinition[];
}

// ====================================
// Vocabulary Term Types
// ====================================

/**
 * Vocabulary term
 */
export interface VocabTerm {
	id?: string;
	lang?: string;
	labels?: Array<{
		lang?: string;
		value?: string;
	}>;
	descriptions?: Array<{
		lang?: string;
		value?: string;
	}>;
}

/**
 * Vocabulary term response
 */
export interface VocabTermResponse {
	terms?: VocabTerm[];
}

/**
 * Vocabulary term translation
 */
export interface VocabTermTranslation {
	id?: string;
	lang?: string;
	labels?: Array<{
		value?: string;
	}>;
	descriptions?: Array<{
		value?: string;
	}>;
}

/**
 * Vocabulary term translation response
 */
export interface VocabTermTranslationResponse {
	translations?: VocabTermTranslation[];
}

// ====================================
// Vocabulary List Types
// ====================================

/**
 * Vocabulary scheme
 */
export interface VocabScheme {
	id?: string;
	title?: string;
	description?: string;
	uri?: string;
}

/**
 * Vocabulary list response
 */
export interface VocabListResponse {
	schemes?: VocabScheme[];
}
