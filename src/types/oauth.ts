/**
 * OAuth API Types
 * 
 * Types for OAuth authentication flow
 */

import type { FamilySearchEnvironment } from "./core";

// ====================================
// OAuth Types
// ====================================

/**
 * OAuth token response
 */
export interface OAuthTokenResponse {
	access_token: string;
	token_type: string;
	expires_in?: number;
	refresh_token?: string;
	id_token?: string;
}

/**
 * OAuth endpoints for an environment
 */
export interface OAuthEndpoints {
	authorization: string;
	token: string;
	currentUser: string;
}

/**
 * OAuth configuration
 */
export interface OAuthConfig {
	clientId: string;
	redirectUri: string;
	environment?: FamilySearchEnvironment;
}

/**
 * OAuth state validation result
 */
export interface OAuthStateValidation {
	valid: boolean;
	isLinkMode: boolean;
	lang?: string;
	parentUid?: string;
}
