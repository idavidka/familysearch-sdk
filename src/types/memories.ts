/**
 * Memories API Types
 * 
 * Types for photos, documents, stories, and memory management
 */

import type { SourceDescription } from "./tree";

// ====================================
// Memory Types
// ====================================

/**
 * Person memories response from FamilySearch API
 */
export interface PersonMemoriesResponse {
	/** Array of source descriptions (memories) */
	sourceDescriptions?: SourceDescription[];
	/** Pagination info */
	links?: Record<string, { href: string }>;
}

/**
 * Memory artifact (photo/document/story)
 */
export interface MemoryArtifact {
	id?: string;
	about?: string;
	mediaType?: string;
	resourceType?: string;
	titles?: Array<{ value?: string }>;
	descriptions?: Array<{ value?: string }>;
	created?: number;
	modified?: number;
	contributors?: Array<{
		resourceId?: string;
		resource?: string;
	}>;
	coverage?: Array<{
		spatial?: {
			original?: string;
		};
		temporal?: {
			original?: string;
		};
	}>;
}

/**
 * Memory comments
 */
export interface MemoryComment {
	id?: string;
	text?: string;
	created?: number;
	contributor?: {
		resourceId?: string;
		resource?: string;
	};
}

/**
 * Memory with comments response
 */
export interface MemoryWithCommentsResponse {
	sourceDescriptions?: MemoryArtifact[];
	discussions?: Array<{
		id?: string;
		comments?: MemoryComment[];
	}>;
}

/**
 * User uploaded memories response
 */
export interface UserMemoriesResponse {
	sourceDescriptions?: MemoryArtifact[];
}

/**
 * Memory persona (person identified in a memory)
 */
export interface MemoryPersona {
	id?: string;
	display?: {
		name?: string;
		gender?: string;
		birthDate?: string;
		deathDate?: string;
		lifespan?: string;
	};
	identifiers?: Record<string, string>;
	links?: Record<string, { href?: string }>;
}

/**
 * Memory personas list response
 */
export interface MemoryPersonasResponse {
	persons?: MemoryPersona[];
}

/**
 * Memory persona single response
 */
export interface MemoryPersonaResponse {
	persons?: MemoryPersona[];
}
