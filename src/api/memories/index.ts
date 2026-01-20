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
		sdk["logger"].error(
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
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get memories for user ${userId}:`,
			error
		);
		return null;
	}
}
