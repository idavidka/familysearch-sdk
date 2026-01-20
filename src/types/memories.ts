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

// ====================================
// Memory Input Types (for creation/update)
// ====================================

/**
 * Input for creating a new memory
 */
export interface CreateMemoryInput {
	/** Memory title */
	title: string;
	/** Memory description */
	description?: string;
	/** Media type (e.g., 'image/jpeg', 'application/pdf', 'text/plain') */
	mediaType?: string;
	/** Artifact type hint */
	artifactType?: 'photo' | 'story' | 'document' | 'audio' | 'video';
	/** File data as base64 string or Buffer */
	file?: string | Buffer;
	/** File URL (if uploading from URL) */
	fileUrl?: string;
	/** About information (what this memory is about) */
	about?: string;
	/** Spatial coverage (place) */
	place?: string;
	/** Temporal coverage (date) */
	date?: string;
}

/**
 * Input for updating a memory
 */
export interface UpdateMemoryInput {
	/** Updated title */
	title?: string;
	/** Updated description */
	description?: string;
	/** Updated about information */
	about?: string;
	/** Updated place */
	place?: string;
	/** Updated date */
	date?: string;
}

/**
 * Response from creating a memory
 */
export interface CreateMemoryResponse {
	/** Created memory source descriptions */
	sourceDescriptions?: MemoryArtifact[];
	/** Links to the created resource */
	links?: Record<string, { href: string }>;
}

/**
 * Response from updating a memory
 */
export interface UpdateMemoryResponse {
	/** Updated memory source descriptions */
	sourceDescriptions?: MemoryArtifact[];
}

/**
 * Response from deleting a memory
 */
export interface DeleteMemoryResponse {
	statusCode: number;
	statusText: string;
}

/**
 * Input for creating a memory persona
 */
export interface CreateMemoryPersonaInput {
	/** Person ID to tag in the memory */
	personId: string;
	/** Memory ID */
	memoryId: string;
}

/**
 * Input for creating a memory comment
 */
export interface CreateMemoryCommentInput {
	/** Comment text */
	text: string;
}

/**
 * Response from creating a memory comment
 */
export interface CreateMemoryCommentResponse {
	discussions?: Array<{
		id?: string;
		comments?: MemoryComment[];
	}>;
}
