/**
 * FamilySearch Memories API
 *
 * Handles memories (photos, documents, stories) and comments.
 *
 * @see https://developers.familysearch.org/main/reference/readmemory
 */

import type { FamilySearchSDK } from "../../client";
import type {
	MemoryWithCommentsResponse,
	UserMemoriesResponse,
	CreateMemoryInput,
	UpdateMemoryInput,
	CreateMemoryResponse,
	UpdateMemoryResponse,
	DeleteMemoryResponse,
	CreateMemoryPersonaInput,
	MemoryPersonaResponse,
	MemoryPersonasResponse,
	CreateMemoryCommentInput,
	CreateMemoryCommentResponse,
	UpdateMemoryArtifactInput,
	UpdateMemoryArtifactResponse,
} from "../../types";

/**
 * Get a memory with its comments
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory artifact reference
 * @returns Memory with comments or null
 */
export async function getMemoryWithComments(
	sdk: FamilySearchSDK,
	memoryId: string
): Promise<MemoryWithCommentsResponse | null> {
	try {
		const response = await sdk.get<MemoryWithCommentsResponse>(
			`/platform/memories/memories/${memoryId}/comments`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get memory ${memoryId} with comments:`,
			error
		);
		return null;
	}
}

/**
 * Get memories for a user
 *
 * @param sdk - SDK instance
 * @param userId - User ID (use 'current' for authenticated user)
 * @returns User memories or null
 */
export async function getUserMemories(
	sdk: FamilySearchSDK,
	userId: string = "current"
): Promise<UserMemoriesResponse | null> {
	try {
		const response = await sdk.get<UserMemoriesResponse>(
			`/platform/users/${userId}/memories`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get memories for user ${userId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a new memory (photo, document, or story)
 *
 * **Note:** File upload requires multipart/form-data. This implementation
 * handles metadata creation. For actual file upload, use the artifact endpoint.
 *
 * @param sdk - SDK instance
 * @param memory - Memory input data
 * @returns Created memory response
 *
 * @example
 * ```typescript
 * const newMemory = await createMemory(sdk, {
 *   title: 'Family Photo 1920',
 *   description: 'Photo of John Smith family',
 *   artifactType: 'photo',
 *   mediaType: 'image/jpeg',
 *   place: 'London, England',
 *   date: '1920'
 * });
 * ```
 */
export async function createMemory(
	sdk: FamilySearchSDK,
	memory: CreateMemoryInput
): Promise<CreateMemoryResponse | null> {
	try {
		const body = {
			sourceDescriptions: [
				{
					resourceType: memory.artifactType
						? `http://gedcomx.org/${memory.artifactType.charAt(0).toUpperCase() + memory.artifactType.slice(1)}`
						: undefined,
					titles: memory.title
						? [{ value: memory.title }]
						: undefined,
					descriptions: memory.description
						? [{ value: memory.description }]
						: undefined,
					mediaType: memory.mediaType,
					about: memory.about,
					coverage: [
						{
							...(memory.place && {
								spatial: { original: memory.place },
							}),
							...(memory.date && {
								temporal: { original: memory.date },
							}),
						},
					].filter((c) => c.spatial || c.temporal),
				},
			],
		};

		const response = await sdk.post<CreateMemoryResponse>(
			"/platform/memories/memories",
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error("[FamilySearch SDK] Failed to create memory:", error);
		throw error;
	}
}

/**
 * Create multiple memories in batch
 *
 * Creates multiple memory resources (photos, stories, documents, audio) in a single request.
 *
 * @param sdk - SDK instance
 * @param memories - Array of memory creation inputs
 * @returns Batch creation response
 *
 * @example
 * ```typescript
 * const result = await createMemories(sdk, [
 *   { title: 'Photo 1', artifactType: 'photo' },
 *   { title: 'Photo 2', artifactType: 'photo' }
 * ]);
 * console.log('Created', result?.sourceDescriptions?.length, 'memories');
 * ```
 */
export async function createMemories(
	sdk: FamilySearchSDK,
	memories: CreateMemoryInput[]
): Promise<CreateMemoryResponse | null> {
	try {
		const response = await sdk.post<CreateMemoryResponse>(
			`/platform/memories`,
			{
				sourceDescriptions: memories.map((memory) => ({
					titles: memory.title
						? [{ value: memory.title }]
						: undefined,
					descriptions: memory.description
						? [{ value: memory.description }]
						: undefined,
					about: memory.about,
					...memory,
				})),
			}
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create memories in batch:`,
			error
		);
		return null;
	}
}

/**
 * Get multiple memories by IDs
 *
 * Retrieves multiple memory resources in a single request.
 *
 * @param sdk - SDK instance
 * @param memoryIds - Array of memory IDs
 * @returns Batch memory response
 *
 * @example
 * ```typescript
 * const memories = await getMemories(sdk, ['MEM-1', 'MEM-2', 'MEM-3']);
 * console.log('Retrieved', memories?.sourceDescriptions?.length, 'memories');
 * ```
 */
export async function getMemories(
	sdk: FamilySearchSDK,
	memoryIds: string[]
): Promise<UserMemoriesResponse | null> {
	try {
		const ids = memoryIds.join(",");
		const response = await sdk.get<UserMemoriesResponse>(
			`/platform/memories?memories=${ids}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(`[FamilySearch SDK] Failed to get memories:`, error);
		return null;
	}
}

/**
 * Update an existing memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param memory - Updated memory data
 * @returns Updated memory response
 *
 * @example
 * ```typescript
 * const updated = await updateMemory(sdk, 'MMMM-MMM', {
 *   title: 'Updated Family Photo 1920',
 *   description: 'Updated description'
 * });
 * ```
 */
export async function updateMemory(
	sdk: FamilySearchSDK,
	memoryId: string,
	memory: UpdateMemoryInput
): Promise<UpdateMemoryResponse | null> {
	try {
		const body = {
			sourceDescriptions: [
				{
					id: memoryId,
					...(memory.title && {
						titles: [{ value: memory.title }],
					}),
					...(memory.description && {
						descriptions: [{ value: memory.description }],
					}),
					...(memory.about && { about: memory.about }),
					...((memory.place || memory.date) && {
						coverage: [
							{
								...(memory.place && {
									spatial: { original: memory.place },
								}),
								...(memory.date && {
									temporal: { original: memory.date },
								}),
							},
						],
					}),
				},
			],
		};

		const response = await sdk.post<UpdateMemoryResponse>(
			`/platform/memories/memories/${memoryId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a memory
 *
 * **Warning:** This is a destructive operation.
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @returns Delete confirmation
 *
 * @example
 * ```typescript
 * await deleteMemory(sdk, 'MMMM-MMM');
 * ```
 */
export async function deleteMemory(
	sdk: FamilySearchSDK,
	memoryId: string
): Promise<DeleteMemoryResponse | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/memories/memories/${memoryId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get all personas for a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @returns Memory personas or null
 */
export async function getMemoryPersonas(
	sdk: FamilySearchSDK,
	memoryId: string
): Promise<MemoryPersonasResponse | null> {
	try {
		const response = await sdk.get<MemoryPersonasResponse>(
			`/platform/memories/memories/${memoryId}/personas`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get personas for memory ${memoryId}:`,
			error
		);
		return null;
	}
}

/**
 * Get a specific persona for a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param personaId - Persona ID
 * @returns Memory persona or null
 */
export async function getMemoryPersona(
	sdk: FamilySearchSDK,
	memoryId: string,
	personaId: string
): Promise<MemoryPersonaResponse | null> {
	try {
		const response = await sdk.get<MemoryPersonaResponse>(
			`/platform/memories/memories/${memoryId}/personas/${personaId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get persona ${personaId} for memory ${memoryId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a persona (tag a person) in a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param persona - Persona input data
 * @returns Created persona response
 *
 * @example
 * ```typescript
 * const persona = await createMemoryPersona(sdk, 'MMMM-MMM', {
 *   personId: 'KWQS-BBQ',
 *   memoryId: 'MMMM-MMM'
 * });
 * ```
 */
export async function createMemoryPersona(
	sdk: FamilySearchSDK,
	memoryId: string,
	persona: CreateMemoryPersonaInput
): Promise<MemoryPersonaResponse | null> {
	try {
		const body = {
			persons: [
				{
					id: persona.personId,
				},
			],
		};

		const response = await sdk.post<MemoryPersonaResponse>(
			`/platform/memories/memories/${memoryId}/personas`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create persona for memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Update a persona in a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param personaId - Persona ID
 * @param persona - Updated persona data
 * @returns Updated persona response
 */
export async function updateMemoryPersona(
	sdk: FamilySearchSDK,
	memoryId: string,
	personaId: string,
	persona: CreateMemoryPersonaInput
): Promise<MemoryPersonaResponse | null> {
	try {
		const body = {
			persons: [
				{
					id: personaId,
					identifiers: {
						"http://gedcomx.org/Persistent": [persona.personId],
					},
				},
			],
		};

		const response = await sdk.post<MemoryPersonaResponse>(
			`/platform/memories/memories/${memoryId}/personas/${personaId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update persona ${personaId} for memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a persona from a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param personaId - Persona ID
 * @returns Delete confirmation
 */
export async function deleteMemoryPersona(
	sdk: FamilySearchSDK,
	memoryId: string,
	personaId: string
): Promise<DeleteMemoryResponse | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/memories/memories/${memoryId}/personas/${personaId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete persona ${personaId} from memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get comments for a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @returns Memory comments or null
 */
export async function getMemoryComments(
	sdk: FamilySearchSDK,
	memoryId: string
): Promise<MemoryWithCommentsResponse | null> {
	try {
		const response = await sdk.get<MemoryWithCommentsResponse>(
			`/platform/memories/memories/${memoryId}/comments`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get comments for memory ${memoryId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a comment on a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param comment - Comment input data
 * @returns Created comment response
 *
 * @example
 * ```typescript
 * const comment = await createMemoryComment(sdk, 'MMMM-MMM', {
 *   text: 'Great photo of the family!'
 * });
 * ```
 */
export async function createMemoryComment(
	sdk: FamilySearchSDK,
	memoryId: string,
	comment: CreateMemoryCommentInput
): Promise<CreateMemoryCommentResponse | null> {
	try {
		const body = {
			discussions: [
				{
					comments: [
						{
							text: comment.text,
						},
					],
				},
			],
		};

		const response = await sdk.post<CreateMemoryCommentResponse>(
			`/platform/memories/memories/${memoryId}/comments`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create comment for memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a comment from a memory
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory ID
 * @param commentId - Comment ID
 * @returns Delete confirmation
 */
export async function deleteMemoryComment(
	sdk: FamilySearchSDK,
	memoryId: string,
	commentId: string
): Promise<DeleteMemoryResponse | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/memories/memories/${memoryId}/comments/${commentId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete comment ${commentId} from memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Update memory artifact metadata
 *
 * Updates the metadata associated with a memory artifact, such as title,
 * description, coverage (location/time), and other descriptive information.
 * This modifies the source description for the memory.
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory artifact ID
 * @param input - Artifact metadata to update
 * @returns Updated artifact response
 * @throws Error if update fails
 *
 * @example
 * ```typescript
 * const updated = await updateMemoryArtifact(sdk, "MMMM-MMM", {
 *   sourceDescriptions: [{
 *     id: "MMMM-MMM",
 *     titles: [{ value: "Updated Title" }],
 *     descriptions: [{ value: "New description" }],
 *     coverage: [{
 *       spatial: { original: "London, England" },
 *       temporal: { original: "1920" }
 *     }]
 *   }]
 * });
 * ```
 */
export async function updateMemoryArtifact(
	sdk: FamilySearchSDK,
	memoryId: string,
	input: UpdateMemoryArtifactInput
): Promise<UpdateMemoryArtifactResponse> {
	try {
		const response = await sdk.post<UpdateMemoryArtifactResponse>(
			`/platform/memories/memories/${memoryId}/artifact`,
			input
		);
		return response.data || { sourceDescriptions: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update artifact for memory ${memoryId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete memory artifact coverage
 *
 * Removes a coverage region (spatial/temporal) from a memory artifact.
 * Coverage regions can be used to tag specific areas of a photo or
 * time periods associated with a memory.
 *
 * @param sdk - SDK instance
 * @param memoryId - Memory artifact ID
 * @param coverageId - Coverage ID to delete
 * @returns Delete confirmation
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deleteMemoryArtifactCoverage(sdk, "MMMM-MMM", "CCCC-CCC");
 * console.log("Coverage region removed");
 * ```
 */
export async function deleteMemoryArtifactCoverage(
	sdk: FamilySearchSDK,
	memoryId: string,
	coverageId: string
): Promise<DeleteMemoryResponse> {
	try {
		const response = await sdk.delete<void>(
			`/platform/memories/memories/${memoryId}/artifact/coverage/${coverageId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete coverage ${coverageId} from memory ${memoryId}:`,
			error
		);
		throw error;
	}
}
