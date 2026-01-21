/**
 * FamilySearch Discussions API
 *
 * Handles discussions and comments on persons and relationships.
 *
 * @see https://developers.familysearch.org/main/reference/creatediscussion
 */

import type { FamilySearchSDK } from "../../client";
import type {
	Discussion,
	DiscussionInput,
	DiscussionResponse,
	DiscussionCommentInput,
	DiscussionCommentResponse,
	DeleteResponse,
} from "../../types";

/**
 * Get a discussion by ID
 *
 * @param sdk - SDK instance
 * @param discussionId - Discussion ID
 * @returns Discussion or null
 */
export async function getDiscussion(
	sdk: FamilySearchSDK,
	discussionId: string
): Promise<Discussion | null> {
	try {
		const response = await sdk.get<DiscussionResponse>(
			`/platform/discussions/${discussionId}`
		);
		return response.data?.discussions?.[0] || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get discussion ${discussionId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a new discussion
 *
 * @param sdk - SDK instance
 * @param discussion - Discussion input data
 * @returns Created discussion response
 *
 * @example
 * ```typescript
 * const discussion = await createDiscussion(sdk, {
 *   title: 'Research Question',
 *   details: 'Does anyone have information about John Smith?'
 * });
 * ```
 */
export async function createDiscussion(
	sdk: FamilySearchSDK,
	discussion: DiscussionInput
): Promise<DiscussionResponse | null> {
	try {
		const body = {
			discussions: [
				{
					title: discussion.title,
					details: discussion.details,
					...(discussion.about && { about: discussion.about }),
				},
			],
		};

		const response = await sdk.post<DiscussionResponse>(
			"/platform/discussions",
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			"[FamilySearch SDK] Failed to create discussion:",
			error
		);
		throw error;
	}
}

/**
 * Update a discussion
 *
 * @param sdk - SDK instance
 * @param discussionId - Discussion ID
 * @param discussion - Updated discussion data
 * @returns Updated discussion response
 */
export async function updateDiscussion(
	sdk: FamilySearchSDK,
	discussionId: string,
	discussion: DiscussionInput
): Promise<DiscussionResponse | null> {
	try {
		const body = {
			discussions: [
				{
					id: discussionId,
					title: discussion.title,
					details: discussion.details,
				},
			],
		};

		const response = await sdk.post<DiscussionResponse>(
			`/platform/discussions/${discussionId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update discussion ${discussionId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get comments for a discussion
 *
 * @param sdk - SDK instance
 * @param discussionId - Discussion ID
 * @returns Discussion with comments or null
 */
export async function getDiscussionComments(
	sdk: FamilySearchSDK,
	discussionId: string
): Promise<DiscussionResponse | null> {
	try {
		const response = await sdk.get<DiscussionResponse>(
			`/platform/discussions/${discussionId}/comments`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get comments for discussion ${discussionId}:`,
			error
		);
		return null;
	}
}

/**
 * Add a comment to a discussion
 *
 * @param sdk - SDK instance
 * @param discussionId - Discussion ID
 * @param comment - Comment input data
 * @returns Discussion with new comment
 *
 * @example
 * ```typescript
 * const updated = await addDiscussionComment(sdk, 'DDDD-DDD', {
 *   text: 'I found some information in the 1920 census.'
 * });
 * ```
 */
export async function addDiscussionComment(
	sdk: FamilySearchSDK,
	discussionId: string,
	comment: DiscussionCommentInput
): Promise<DiscussionCommentResponse | null> {
	try {
		const body = {
			discussions: [
				{
					id: discussionId,
					comments: [
						{
							text: comment.text,
						},
					],
				},
			],
		};

		const response = await sdk.post<DiscussionCommentResponse>(
			`/platform/discussions/${discussionId}/comments`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to add comment to discussion ${discussionId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a comment from a discussion
 *
 * @param sdk - SDK instance
 * @param discussionId - Discussion ID
 * @param commentId - Comment ID
 * @returns Delete confirmation
 */
export async function deleteDiscussionComment(
	sdk: FamilySearchSDK,
	discussionId: string,
	commentId: string
): Promise<DeleteResponse | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/discussions/${discussionId}/comments/${commentId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete comment ${commentId} from discussion ${discussionId}:`,
			error
		);
		throw error;
	}
}
