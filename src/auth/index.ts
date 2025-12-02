/**
 * FamilySearch Authentication Module
 *
 * Re-exports all authentication utilities
 */

export {
	// OAuth flow functions
	getOAuthEndpoints,
	generateOAuthState,
	buildAuthorizationUrl,
	exchangeCodeForToken,
	refreshAccessToken,
	validateAccessToken,
	getUserInfo,
	// Browser OAuth helpers
	OAUTH_STORAGE_KEYS,
	storeOAuthState,
	validateOAuthState,
	openOAuthPopup,
	parseCallbackParams,
	// Token storage helpers
	getTokenStorageKey,
	storeTokens,
	getStoredAccessToken,
	getStoredRefreshToken,
	clearStoredTokens,
	clearAllTokens,
	// Constants
	OAUTH_ENDPOINTS,
} from "./oauth";
