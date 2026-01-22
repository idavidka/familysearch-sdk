/**
 * FamilySearch Genealogies API Types
 * 
 * Type definitions for research trees (genealogies) - separate from the main FamilySearch Family Tree.
 * Genealogies allow for hypothesis testing and research organization.
 */

// ====================================
// Genealogy Tree Types
// ====================================

/**
 * Genealogy tree entity
 */
export interface GenealogyTree {
	id?: string;
	title?: string;
	description?: string;
	created?: number;
	modified?: number;
	links?: {
		self?: {
			href?: string;
		};
	};
}

/**
 * Single genealogy tree response
 */
export interface GenealogyTreeResponse {
	trees?: GenealogyTree[];
}

/**
 * Multiple genealogy trees response
 */
export interface GenealogyTreesResponse {
	trees?: GenealogyTree[];
}

/**
 * Create genealogy tree input
 */
export interface CreateGenealogyTreeInput {
	title?: string;
	description?: string;
}

/**
 * Update genealogy tree input
 */
export interface UpdateGenealogyTreeInput {
	title?: string;
	description?: string;
}

// ====================================
// Genealogy Person Types
// ====================================

/**
 * Genealogy person entity
 */
export interface GenealogyPerson {
	id?: string;
	living?: boolean;
	display?: {
		name?: string;
		gender?: string;
		lifespan?: string;
		birthDate?: string;
		birthPlace?: string;
		deathDate?: string;
		deathPlace?: string;
	};
	names?: Array<{
		givenName?: string;
		surname?: string;
		preferred?: boolean;
	}>;
	gender?: {
		type?: string;
	};
	facts?: Array<{
		type?: string;
		date?: string;
		place?: string;
		value?: string;
	}>;
	links?: {
		self?: {
			href?: string;
		};
	};
}

/**
 * Single genealogy person response
 */
export interface GenealogyPersonResponse {
	persons?: GenealogyPerson[];
}

/**
 * Multiple genealogy persons response
 */
export interface GenealogyPersonsResponse {
	persons?: GenealogyPerson[];
}

/**
 * Create genealogy person input
 */
export interface CreateGenealogyPersonInput {
	names?: Array<{
		givenName?: string;
		surname?: string;
		preferred?: boolean;
	}>;
	gender?: string;
	facts?: Array<{
		type?: string;
		date?: string;
		place?: string;
		value?: string;
	}>;
}

/**
 * Update genealogy person input
 */
export interface UpdateGenealogyPersonInput {
	names?: Array<{
		givenName?: string;
		surname?: string;
		preferred?: boolean;
	}>;
	gender?: string;
	facts?: Array<{
		type?: string;
		date?: string;
		place?: string;
		value?: string;
	}>;
}

// ====================================
// Genealogy Relationship Types
// ====================================

/**
 * Genealogy relationship entity
 */
export interface GenealogyRelationship {
	id?: string;
	type?: string;
	person1?: {
		resourceId?: string;
	};
	person2?: {
		resourceId?: string;
	};
	facts?: Array<{
		type?: string;
		date?: string;
		place?: string;
	}>;
}

/**
 * Genealogy relationship response
 */
export interface GenealogyRelationshipResponse {
	relationships?: GenealogyRelationship[];
}

/**
 * Update genealogy relationship input
 */
export interface UpdateGenealogyRelationshipInput {
	facts?: Array<{
		type?: string;
		date?: string;
		place?: string;
	}>;
}

// ====================================
// Genealogy Source Description Types
// ====================================

/**
 * Genealogy source description entity
 */
export interface GenealogySourceDescription {
	id?: string;
	titles?: Array<{
		value?: string;
	}>;
	citations?: Array<{
		value?: string;
	}>;
	about?: string;
	resourceType?: string;
}

/**
 * Genealogy source description response
 */
export interface GenealogySourceDescriptionResponse {
	sourceDescriptions?: GenealogySourceDescription[];
}

/**
 * Create genealogy source description input
 */
export interface CreateGenealogySourceDescriptionInput {
	titles?: Array<{
		value?: string;
	}>;
	citations?: Array<{
		value?: string;
	}>;
	about?: string;
}

/**
 * Update genealogy source description input
 */
export interface UpdateGenealogySourceDescriptionInput {
	titles?: Array<{
		value?: string;
	}>;
	citations?: Array<{
		value?: string;
	}>;
}

// ====================================
// Genealogy Other Types (Matches, Notes, Conclusions)
// ====================================

/**
 * Genealogy bulk match response
 */
export interface GenealogyBulkMatchResponse {
	entries?: Array<{
		id?: string;
		title?: string;
		score?: number;
		content?: {
			gedcomx?: {
				persons?: Array<{
					id?: string;
					display?: {
						name?: string;
					};
				}>;
			};
		};
	}>;
}

/**
 * Genealogy person matches response
 */
export interface GenealogyPersonMatchesResponse {
	entries?: Array<{
		id?: string;
		title?: string;
		score?: number;
		content?: {
			gedcomx?: {
				persons?: Array<{
					id?: string;
					display?: {
						name?: string;
					};
				}>;
			};
		};
	}>;
}

/**
 * Genealogy note response
 */
export interface GenealogyNoteResponse {
	notes?: Array<{
		id?: string;
		text?: string;
		subject?: string;
		attribution?: {
			contributor?: {
				resourceId?: string;
			};
			modified?: number;
		};
	}>;
}
