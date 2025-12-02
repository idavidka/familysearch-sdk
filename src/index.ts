/**
 * FamilySearch SDK
 *
 * A modern, TypeScript-first SDK for FamilySearch API v3
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import {
 *   FamilySearchSDK,
 *   createFamilySearchSDK,
 *   fetchPedigree,
 *   convertToGedcom
 * } from '@gedcom-visualiser/familysearch-sdk';
 *
 * // Create SDK instance
 * const sdk = createFamilySearchSDK({
 *   environment: 'production',
 *   accessToken: 'your-oauth-token'
 * });
 *
 * // Fetch pedigree data
 * const pedigree = await fetchPedigree(sdk);
 *
 * // Convert to GEDCOM
 * const gedcom = convertToGedcom(pedigree, { treeName: 'My Tree' });
 * ```
 */

// Core SDK Client
export {
	FamilySearchSDK,
	initFamilySearchSDK,
	getFamilySearchSDK,
	createFamilySearchSDK,
	resetFamilySearchSDK,
	ENVIRONMENT_CONFIGS,
} from "./client";

// Types
export type {
	// Environment
	FamilySearchEnvironment,
	EnvironmentConfig,
	// Configuration
	FamilySearchSDKConfig,
	SDKLogger,
	// API Response
	FamilySearchApiResponse,
	FamilySearchApiError,
	// User
	FamilySearchUser,
	// Person/Tree
	FamilySearchPerson,
	PersonDisplay,
	NameForm,
	PersonFact,
	PersonData,
	Relationship,
	RelationshipDetails,
	// Places
	FamilySearchPlace,
	PlaceDescription,
	PlaceSearchResult,
	PlaceSearchResponse,
	PlaceDetailsResponse,
	// Pedigree
	PedigreeData,
	EnhancedPerson,
	EnhancedPedigreeData,
	// OAuth
	OAuthTokenResponse,
	OAuthEndpoints,
	OAuthConfig,
	OAuthStateValidation,
	// Progress
	ProgressCallback,
} from "./types";

// Auth module
export * from "./auth";

// Places module
export * from "./places";

// Tree module
export * from "./tree";

// Utils module
export * from "./utils";
