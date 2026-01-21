import type { FamilySearchSDK } from "../../client";
import type {
	GroupResponse,
	GroupsResponse,
	CreateGroupInput,
} from "../../types/tree";

/**
 * Read a specific group (community tree)
 *
 * Returns details for a specific community tree group.
 *
 * @param sdk - SDK instance
 * @param groupId - Group identifier
 * @returns Group details or null
 *
 * @example
 * ```typescript
 * const group = await getGroup(sdk, 'GROUP-123');
 * console.log('Group name:', group?.groups?.[0]?.names?.[0]?.value);
 * ```
 */
export async function getGroup(
	sdk: FamilySearchSDK,
	groupId: string
): Promise<GroupResponse | null> {
	try {
		const response = await sdk.get<GroupResponse>(
			`/platform/tree/groups/${groupId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get group ${groupId}:`,
			error
		);
		return null;
	}
}

/**
 * Get all groups (community trees) for the current user
 *
 * Returns all community tree groups the authenticated user has access to.
 *
 * @param sdk - SDK instance
 * @returns List of groups or null
 *
 * @example
 * ```typescript
 * const groups = await getGroups(sdk);
 * console.log('User has access to', groups?.groups?.length, 'groups');
 * ```
 */
export async function getGroups(
	sdk: FamilySearchSDK
): Promise<GroupsResponse | null> {
	try {
		const response = await sdk.get<GroupsResponse>(`/platform/tree/groups`);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(`[FamilySearch SDK] Failed to get groups:`, error);
		return null;
	}
}

/**
 * Create a new group (community tree)
 *
 * Creates a new community tree group with the specified details.
 *
 * @param sdk - SDK instance
 * @param input - Group creation data
 * @returns Created group or null
 *
 * @example
 * ```typescript
 * const group = await createGroup(sdk, {
 *   names: [{ value: 'Smith Family Tree' }],
 *   description: 'Our family history research'
 * });
 * ```
 */
export async function createGroup(
	sdk: FamilySearchSDK,
	input: CreateGroupInput
): Promise<GroupResponse | null> {
	try {
		const response = await sdk.post<GroupResponse>(
			`/platform/tree/groups`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(`[FamilySearch SDK] Failed to create group:`, error);
		return null;
	}
}

/**
 * Update an existing group (community tree)
 *
 * Updates details for an existing community tree group.
 *
 * @param sdk - SDK instance
 * @param groupId - Group identifier
 * @param input - Updated group data
 * @returns Updated group or null
 *
 * @example
 * ```typescript
 * const updated = await updateGroup(sdk, 'GROUP-123', {
 *   names: [{ value: 'Updated Family Tree Name' }]
 * });
 * ```
 */
export async function updateGroup(
	sdk: FamilySearchSDK,
	groupId: string,
	input: CreateGroupInput
): Promise<GroupResponse | null> {
	try {
		const response = await sdk.post<GroupResponse>(
			`/platform/tree/groups/${groupId}`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update group ${groupId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete a group (community tree)
 *
 * Deletes an existing community tree group.
 *
 * @param sdk - SDK instance
 * @param groupId - Group identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * const success = await deleteGroup(sdk, 'GROUP-123');
 * console.log('Deleted:', success);
 * ```
 */
export async function deleteGroup(
	sdk: FamilySearchSDK,
	groupId: string
): Promise<boolean> {
	try {
		await sdk.delete(`/platform/tree/groups/${groupId}`);
		return true;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete group ${groupId}:`,
			error
		);
		return false;
	}
}
