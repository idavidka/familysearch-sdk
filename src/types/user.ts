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
