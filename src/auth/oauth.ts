/**
 * FamilySearch OAuth Authentication Module
 *
 * Provides OAuth 2.0 authentication utilities for FamilySearch API v3.
 * This module is designed to be framework-agnostic and can be used
 * in any JavaScript/TypeScript environment.
 */

import type {
	FamilySearchEnvironment,
	OAuthConfig,
	OAuthEndpoints,
	OAuthStateValidation,
	OAuthTokenResponse,
} from "../types";

// OAuth endpoints by environment
const OAUTH_ENDPOINTS: Record<FamilySearchEnvironment, OAuthEndpoints> = {
	production: {
		authorization:
			"https://ident.familysearch.org/cis-web/oauth2/v3/authorization",
		token: "https://ident.familysearch.org/cis-web/oauth2/v3/token",
		currentUser: "https://api.familysearch.org/platform/users/current",
	},
	beta: {
		authorization:
			"https://identbeta.familysearch.org/cis-web/oauth2/v3/authorization",
		token: "https://identbeta.familysearch.org/cis-web/oauth2/v3/token",
		currentUser: "https://apibeta.familysearch.org/platform/users/current",
	},
	integration: {
		authorization:
			"https://identint.familysearch.org/cis-web/oauth2/v3/authorization",
		token: "https://identint.familysearch.org/cis-web/oauth2/v3/token",
		currentUser:
			"https://api-integ.familysearch.org/platform/users/current",
	},
};

/**
 * Get OAuth endpoints for a specific environment
 */
export function getOAuthEndpoints(
	environment: FamilySearchEnvironment = "integration"
): OAuthEndpoints {
	return OAUTH_ENDPOINTS[environment];
}

/**
 * Generate a cryptographically secure random state for CSRF protection
 */
export function generateOAuthState(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		""
	);
}

/**
 * Build the authorization URL for OAuth flow
 */
export function buildAuthorizationUrl(
	config: OAuthConfig,
	state: string,
	options: {
		scopes?: string[];
		prompt?: string;
	} = {}
): string {
	const endpoints = getOAuthEndpoints(config.environment);
	const url = new URL(endpoints.authorization);

	url.searchParams.set("response_type", "code");
	url.searchParams.set("client_id", config.clientId);
	url.searchParams.set("redirect_uri", config.redirectUri);
	url.searchParams.set("state", state);

	if (options.scopes && options.scopes.length > 0) {
		url.searchParams.set("scope", options.scopes.join(" "));
	}

	if (options.prompt) {
		url.searchParams.set("prompt", options.prompt);
	}

	return url.toString();
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
	code: string,
	config: OAuthConfig
): Promise<OAuthTokenResponse> {
	const endpoints = getOAuthEndpoints(config.environment);

	const response = await fetch(endpoints.token, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json",
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code: code,
			client_id: config.clientId,
			redirect_uri: config.redirectUri,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to exchange code for token: ${error}`);
	}

	return response.json();
}

/**
 * Refresh an access token using a refresh token
 */
export async function refreshAccessToken(
	refreshToken: string,
	config: OAuthConfig
): Promise<OAuthTokenResponse> {
	const endpoints = getOAuthEndpoints(config.environment);

	const response = await fetch(endpoints.token, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json",
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: config.clientId,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to refresh token: ${error}`);
	}

	return response.json();
}

/**
 * Validate an access token by making a test API call
 */
export async function validateAccessToken(
	accessToken: string,
	environment: FamilySearchEnvironment = "integration"
): Promise<boolean> {
	const endpoints = getOAuthEndpoints(environment);

	try {
		const response = await fetch(endpoints.currentUser, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
		});

		return response.ok;
	} catch {
		return false;
	}
}

/**
 * Get user info from access token
 */
export async function getUserInfo(
	accessToken: string,
	environment: FamilySearchEnvironment = "integration"
): Promise<{
	sub: string;
	name?: string;
	given_name?: string;
	family_name?: string;
	email?: string;
	email_verified?: boolean;
} | null> {
	const endpoints = getOAuthEndpoints(environment);

	try {
		const response = await fetch(endpoints.currentUser, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		const fsUser = data.users?.[0];

		if (!fsUser || !fsUser.id) {
			return null;
		}

		return {
			sub: fsUser.id,
			name: fsUser.contactName || fsUser.displayName,
			given_name: fsUser.givenName,
			family_name: fsUser.familyName,
			email: fsUser.email,
			email_verified: fsUser.email ? true : false,
		};
	} catch {
		return null;
	}
}

// ====================================
// Browser-specific OAuth Helpers
// ====================================

/**
 * Storage keys for OAuth state management
 */
export const OAUTH_STORAGE_KEYS = {
	state: "fs_oauth_state",
	linkMode: "fs_oauth_link_mode",
	lang: "fs_oauth_lang",
	parentUid: "fs_oauth_parent_uid",
} as const;

/**
 * Store OAuth state in localStorage for popup flow
 * Uses localStorage instead of sessionStorage because popup windows
 * don't share sessionStorage with the parent window
 */
export function storeOAuthState(
	state: string,
	options: {
		isLinkMode?: boolean;
		lang?: string;
		parentUid?: string;
	} = {}
): void {
	if (typeof localStorage === "undefined") {
		// In server-side or non-browser environments, state storage is not available
		// Callers should handle this by implementing their own state storage mechanism
		throw new Error(
			"localStorage is not available. For server-side usage, implement custom state storage."
		);
	}

	localStorage.setItem(OAUTH_STORAGE_KEYS.state, state);

	if (options.isLinkMode) {
		localStorage.setItem(OAUTH_STORAGE_KEYS.linkMode, "true");
	} else {
		localStorage.removeItem(OAUTH_STORAGE_KEYS.linkMode);
	}

	if (options.lang) {
		localStorage.setItem(OAUTH_STORAGE_KEYS.lang, options.lang);
	} else {
		localStorage.removeItem(OAUTH_STORAGE_KEYS.lang);
	}

	if (options.parentUid) {
		localStorage.setItem(OAUTH_STORAGE_KEYS.parentUid, options.parentUid);
	} else {
		localStorage.removeItem(OAUTH_STORAGE_KEYS.parentUid);
	}
}

/**
 * Validate OAuth state from callback and extract metadata
 * Returns invalid state if localStorage is not available (SSR/Node.js environments)
 */
export function validateOAuthState(state: string): OAuthStateValidation {
	if (typeof localStorage === "undefined") {
		// In server-side environments, return invalid state
		// Callers should implement their own state validation for SSR
		return { valid: false, isLinkMode: false };
	}

	const storedState = localStorage.getItem(OAUTH_STORAGE_KEYS.state);
	const isLinkMode =
		localStorage.getItem(OAUTH_STORAGE_KEYS.linkMode) === "true";
	const lang = localStorage.getItem(OAUTH_STORAGE_KEYS.lang) || undefined;
	const parentUid =
		localStorage.getItem(OAUTH_STORAGE_KEYS.parentUid) || undefined;

	// Clean up stored values
	localStorage.removeItem(OAUTH_STORAGE_KEYS.state);
	localStorage.removeItem(OAUTH_STORAGE_KEYS.linkMode);
	localStorage.removeItem(OAUTH_STORAGE_KEYS.lang);
	localStorage.removeItem(OAUTH_STORAGE_KEYS.parentUid);

	return {
		valid: storedState === state,
		isLinkMode,
		lang,
		parentUid,
	};
}

/**
 * Open OAuth authorization in a popup window
 */
export function openOAuthPopup(
	authUrl: string,
	options: {
		width?: number;
		height?: number;
		windowName?: string;
	} = {}
): Window | null {
	if (typeof window === "undefined") {
		throw new Error("window is not available");
	}

	const width = options.width || 500;
	const height = options.height || 600;
	const windowName = options.windowName || "FamilySearch Login";

	const left = window.screenX + (window.outerWidth - width) / 2;
	const top = window.screenY + (window.outerHeight - height) / 2;

	const popup = window.open(
		authUrl,
		windowName,
		`width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
	);

	if (popup) {
		popup.focus();
	}

	return popup;
}

/**
 * Parse OAuth callback parameters from URL
 */
export function parseCallbackParams(
	url: string = typeof window !== "undefined" ? window.location.href : ""
): {
	code?: string;
	state?: string;
	error?: string;
	error_description?: string;
} {
	const urlObj = new URL(url);
	const params = urlObj.searchParams;

	return {
		code: params.get("code") || undefined,
		state: params.get("state") || undefined,
		error: params.get("error") || undefined,
		error_description: params.get("error_description") || undefined,
	};
}

// ====================================
// Token Storage Helpers
// ====================================

/**
 * Generate a storage key scoped to a user ID
 */
export function getTokenStorageKey(
	userId: string,
	type: "access" | "expires" | "refresh" | "environment"
): string {
	return `fs_token_${userId}_${type}`;
}

/**
 * Store access token with expiration
 * Per FamilySearch compatibility requirements:
 * - Access tokens stored in sessionStorage (cleared on browser close)
 * - Refresh tokens stored in localStorage (for re-authentication)
 */
export function storeTokens(
	userId: string,
	tokens: {
		accessToken: string;
		expiresAt?: number;
		refreshToken?: string;
		environment?: string;
	}
): void {
	if (typeof sessionStorage === "undefined" || typeof localStorage === "undefined") {
		throw new Error("Storage APIs are not available");
	}

	// Access tokens in sessionStorage (temporary)
	sessionStorage.setItem(
		getTokenStorageKey(userId, "access"),
		tokens.accessToken
	);

	if (tokens.expiresAt) {
		sessionStorage.setItem(
			getTokenStorageKey(userId, "expires"),
			tokens.expiresAt.toString()
		);
	}

	// Refresh tokens in localStorage (persistent)
	if (tokens.refreshToken) {
		localStorage.setItem(
			getTokenStorageKey(userId, "refresh"),
			tokens.refreshToken
		);
	}

	if (tokens.environment) {
		localStorage.setItem(
			getTokenStorageKey(userId, "environment"),
			tokens.environment
		);
	}
}

/**
 * Get stored access token
 */
export function getStoredAccessToken(userId: string): string | null {
	if (typeof sessionStorage === "undefined") {
		return null;
	}

	const token = sessionStorage.getItem(getTokenStorageKey(userId, "access"));
	const expiresAt = sessionStorage.getItem(
		getTokenStorageKey(userId, "expires")
	);

	if (!token) {
		return null;
	}

	// Check expiration with 5-minute buffer
	const EXPIRATION_BUFFER = 5 * 60 * 1000;
	if (expiresAt && Date.now() > parseInt(expiresAt) - EXPIRATION_BUFFER) {
		return null;
	}

	return token;
}

/**
 * Get stored refresh token
 */
export function getStoredRefreshToken(userId: string): string | null {
	if (typeof localStorage === "undefined") {
		return null;
	}

	return localStorage.getItem(getTokenStorageKey(userId, "refresh"));
}

/**
 * Clear all stored tokens for a user
 */
export function clearStoredTokens(userId: string): void {
	if (typeof sessionStorage !== "undefined") {
		sessionStorage.removeItem(getTokenStorageKey(userId, "access"));
		sessionStorage.removeItem(getTokenStorageKey(userId, "expires"));
	}

	if (typeof localStorage !== "undefined") {
		localStorage.removeItem(getTokenStorageKey(userId, "refresh"));
		localStorage.removeItem(getTokenStorageKey(userId, "environment"));
	}
}

/**
 * Clear all FamilySearch tokens from storage
 */
export function clearAllTokens(): void {
	if (typeof sessionStorage === "undefined" || typeof localStorage === "undefined") {
		return;
	}

	const keysToRemove: string[] = [];

	// Find all fs_token_* keys in sessionStorage
	for (let i = 0; i < sessionStorage.length; i++) {
		const key = sessionStorage.key(i);
		if (key && key.startsWith("fs_token_")) {
			keysToRemove.push(key);
		}
	}

	// Find all fs_token_* keys in localStorage
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith("fs_token_")) {
			keysToRemove.push(key);
		}
	}

	// Remove from both storages
	keysToRemove.forEach((key) => {
		sessionStorage.removeItem(key);
		localStorage.removeItem(key);
	});
}

export { OAUTH_ENDPOINTS };
