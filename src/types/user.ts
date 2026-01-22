/**
 * User API Types
 * 
 * Types for user authentication and profile information
 */

// ====================================
// User Types
// ====================================

/**
 * FamilySearch user information
 */
export interface FamilySearchUser {
	/** User ID */
	id: string;
	/** Contact name */
	contactName?: string;
	/** Display name */
	displayName?: string;
	/** Given/first name */
	givenName?: string;
	/** Family/last name */
	familyName?: string;
	/** Email address */
	email?: string;
	/** Gender */
	gender?: string;
	/** Birth date */
	birthDate?: string;
	/** Person ID in the tree */
	personId?: string;
	/** Tree user ID */
	treeUserId?: string;
}

/**
 * Partner account input
 */
export interface PartnerAccountInput {
	users?: Array<{
		contactName?: string;
		email?: string;
		givenName?: string;
		familyName?: string;
		birthDate?: string;
		gender?: string;
	}>;
}

/**
 * Partner account response
 */
export interface PartnerAccountResponse {
	users?: Array<{
		id?: string;
		contactName?: string;
		email?: string;
		personId?: string;
		treeUserId?: string;
	}>;
}

/**
 * Partner eligibility response
 */
export interface PartnerEligibilityResponse {
	eligible?: boolean;
	reasons?: string[];
}

/**
 * User history response
 */
export interface UserHistoryResponse {
	entries?: Array<{
		id?: string;
		title?: string;
		content?: {
			gedcomx?: {
				agents?: Array<{
					id?: string;
					names?: Array<{
						value?: string;
					}>;
				}>;
				persons?: Array<{
					id?: string;
					names?: Array<{
						nameForms?: Array<{
							fullText?: string;
						}>;
					}>;
				}>;
			};
		};
		updated?: number;
	}>;
}

/**
 * User history entry input
 */
export interface UserHistoryEntryInput {
	entries?: Array<{
		title?: string;
		content?: {
			gedcomx?: {
				persons?: Array<{
					id?: string;
				}>;
			};
		};
	}>;
}

/**
 * Delete user response
 */
export interface DeleteUserResponse {
	statusCode: number;
	statusText: string;
}
