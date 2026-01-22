/**
 * Standards API Types
 * 
 * Types for date/name normalization and vocabularies
 */

// ====================================
// Names API Types
// ====================================

/**
 * Name script detection response
 */
export interface NameScriptResponse {
	name?: string;
	script?: string; // ISO 15924 script code (e.g., 'Latn', 'Cyrl', 'Hani')
}

/**
 * Name segment (part)
 */
export interface NameSegment {
	type?: string; // 'Given', 'Surname', 'Prefix', 'Suffix', etc.
	value?: string;
}

/**
 * Name segments response
 */
export interface NameSegmentsResponse {
	segments?: NameSegment[];
}

/**
 * Create name segments input
 */
export interface CreateNameSegmentsInput {
	segments?: Array<{
		type?: string; // 'Given', 'Surname', 'Prefix', 'Suffix', etc.
		value?: string;
	}>;
}

/**
 * Create name segments response
 */
export interface CreateNameSegmentsResponse {
	name?: string;
}

// ====================================
// Dates API Types
// ====================================

/**
 * Standardized date information
 */
export interface StandardizedDate {
	original?: string;
	formal?: string; // ISO 8601 format (e.g., '+1850-03-15')
	normalized?: string[];
}

/**
 * Date standardization response
 */
export interface DateStandardizationResponse {
	dates?: StandardizedDate[];
}

// ====================================
// Vocabularies API Types
// ====================================

/**
 * Vocabulary metadata
 */
export interface VocabularyMetadata {
	id?: string;
	name?: string;
	description?: string;
	links?: Record<string, { href?: string }>;
}

/**
 * Vocabularies list response
 */
export interface VocabulariesResponse {
	vocabularies?: VocabularyMetadata[];
}

/**
 * Vocabulary concept/term
 */
export interface VocabularyConceptDetail {
	id?: string;
	label?: string;
	description?: string;
	value?: string;
	links?: Record<string, { href?: string }>;
}

/**
 * Vocabulary concepts list response
 */
export interface VocabularyConceptsResponse {
	concepts?: VocabularyConceptDetail[];
}

/**
 * Vocabulary concept single response
 */
export interface VocabularyConceptResponse {
	concepts?: VocabularyConceptDetail[];
}
