/**
 * FamilySearch User API
 * 
 * Handles user profile and authentication.
 * 
 * @see https://developers.familysearch.org/main/reference/readcurrentuser
 */

import type { FamilySearchSDK } from "../../client";
import type {
	FamilySearchUser,
	PartnerAccountInput,
	PartnerAccountResponse,
	PartnerEligibilityResponse,
	UserHistoryResponse,
	UserHistoryEntryInput,
	DeleteUserResponse,
} from "../../types";

/**
 * Get current user information
 * 
 * @param sdk - SDK instance
 * @returns Current user data or null
 */
export async function getCurrentUser(
	sdk: FamilySearchSDK
): Promise<FamilySearchUser | null> {
	try {
		const response = await sdk.get<FamilySearchUser>(
			"/platform/users/current"
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to get current user:",
			error
		);
		return null;
	}
}

/**
 * Create partner account
 * 
 * Creates a partner account for a user. Partner accounts have special
 * privileges for FamilySearch partner organizations.
 * 
 * @param sdk - SDK instance
 * @param input - Partner account details
 * @returns Created account response
 * @throws Error if creation fails
 * 
 * @example
 * ```typescript
 * const account = await createPartnerAccount(sdk, {
 *   users: [{
 *     contactName: 'John Doe',
 *     email: 'john@example.com',
 *     givenName: 'John',
 *     familyName: 'Doe'
 *   }]
 * });
 * ```
 */
export async function createPartnerAccount(
	sdk: FamilySearchSDK,
	input: PartnerAccountInput
): Promise<PartnerAccountResponse> {
	try {
		const response = await sdk.post<PartnerAccountResponse>(
			`/platform/users/partner`,
			input
		);
		return response.data || { users: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to create partner account:`,
			error
		);
		throw error;
	}
}

/**
 * Update partner account
 * 
 * Updates an existing partner account's information.
 * 
 * @param sdk - SDK instance
 * @param userId - User ID
 * @param input - Updated account details
 * @returns Updated account response
 * @throws Error if update fails
 * 
 * @example
 * ```typescript
 * await updatePartnerAccount(sdk, 'USER-ID', {
 *   users: [{
 *     contactName: 'John Smith',
 *     email: 'john.smith@example.com'
 *   }]
 * });
 * ```
 */
export async function updatePartnerAccount(
	sdk: FamilySearchSDK,
	userId: string,
	input: PartnerAccountInput
): Promise<PartnerAccountResponse> {
	try {
		const response = await sdk.post<PartnerAccountResponse>(
			`/platform/users/${userId}/partner`,
			input
		);
		return response.data || { users: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update partner account for ${userId}:`,
			error
		);
		throw error;
	}
}

/**
 * Check partner eligibility
 * 
 * Checks if a user is eligible to become a partner account.
 * 
 * @param sdk - SDK instance
 * @param userId - User ID to check
 * @returns Eligibility status or null
 * 
 * @example
 * ```typescript
 * const eligibility = await checkPartnerEligibility(sdk, 'USER-ID');
 * if (eligibility?.eligible) {
 *   console.log('User is eligible for partner account');
 * }
 * ```
 */
export async function checkPartnerEligibility(
	sdk: FamilySearchSDK,
	userId: string
): Promise<PartnerEligibilityResponse | null> {
	try {
		const response = await sdk.get<PartnerEligibilityResponse>(
			`/platform/users/${userId}/partner/eligibility`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to check partner eligibility for ${userId}:`,
			error
		);
		return null;
	}
}

/**
 * Get user history
 * 
 * Returns the user's recently viewed persons and other activity history.
 * 
 * @param sdk - SDK instance
 * @param userId - User ID (or 'current' for current user)
 * @returns User history or null
 * 
 * @example
 * ```typescript
 * const history = await getUserHistory(sdk, 'current');
 * console.log('Recent entries:', history?.entries?.length);
 * ```
 */
export async function getUserHistory(
	sdk: FamilySearchSDK,
	userId: string = 'current'
): Promise<UserHistoryResponse | null> {
	try {
		const response = await sdk.get<UserHistoryResponse>(
			`/platform/users/${userId}/history`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get user history for ${userId}:`,
			error
		);
		return null;
	}
}

/**
 * Update user history
 * 
 * Adds or updates entries in the user's history (e.g., recently viewed persons).
 * 
 * @param sdk - SDK instance
 * @param userId - User ID (or 'current' for current user)
 * @param input - History entries to add/update
 * @returns Updated history response
 * @throws Error if update fails
 * 
 * @example
 * ```typescript
 * await updateUserHistory(sdk, 'current', {
 *   entries: [{
 *     title: 'John Doe',
 *     content: {
 *       gedcomx: {
 *         persons: [{ id: 'PPPP-PPP' }]
 *       }
 *     }
 *   }]
 * });
 * ```
 */
export async function updateUserHistory(
	sdk: FamilySearchSDK,
	userId: string = 'current',
	input: UserHistoryEntryInput
): Promise<UserHistoryResponse> {
	try {
		const response = await sdk.post<UserHistoryResponse>(
			`/platform/users/${userId}/history`,
			input
		);
		return response.data || { entries: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update user history for ${userId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete user account
 * 
 * Permanently deletes a user account. This is a destructive operation
 * and cannot be undone.
 * 
 * @param sdk - SDK instance
 * @param userId - User ID to delete
 * @returns Delete confirmation
 * @throws Error if deletion fails
 * 
 * @example
 * ```typescript
 * await deleteUserAccount(sdk, 'USER-ID');
 * console.log('User account deleted');
 * ```
 */
export async function deleteUserAccount(
	sdk: FamilySearchSDK,
	userId: string
): Promise<DeleteUserResponse> {
	try {
		const response = await sdk.delete<void>(
			`/platform/users/${userId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete user account ${userId}:`,
			error
		);
		throw error;
	}
}
