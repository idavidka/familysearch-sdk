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
 * } from 'familysearch-sdk';
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
	RateLimiterConfig,
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
	ChildAndParentsRelationship,
	PersonWithRelationships,
	PersonNotesResponse,
	PersonMemoriesResponse,
	PersonSearchResponse,
	PersonSourcesResponse,
	TreePersonMatchesResponse,
	TreePersonMatchesOptions,
	TreePersonMatchEntry,
	PersonMatchInput,
	PersonMatchOptions,
	SourceDescription,
	SourceReference,
	SourceDescriptionDetail,
	SourceDescriptionResponse,
	SourceDescriptionsResponse,
	// Discussions
	Discussion,
	DiscussionComment,
	PersonDiscussionsResponse,
	// Portraits
	PersonPortrait,
	PersonPortraitsResponse,
	// Change History
	ChangeEntry,
	PersonChangeHistoryResponse,
	// Memories
	MemoryArtifact,
	MemoryComment,
	MemoryWithCommentsResponse,
	UserMemoriesResponse,
	// Memory Personas
	MemoryPersona,
	MemoryPersonasResponse,
	MemoryPersonaResponse,
	// Vocabularies
	VocabularyMetadata,
	VocabulariesResponse,
	VocabularyConceptDetail,
	VocabularyConceptsResponse,
	VocabularyConceptResponse,
	// Names (Standards)
	NameScriptResponse,
	NameSegment,
	NameSegmentsResponse,
	// Dates (Standards)
	StandardizedDate,
	DateStandardizationResponse,
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
	// Person CRUD
	PersonInput,
	CreatePersonResponse,
	UpdatePersonResponse,
	DeletePersonResponse,
	// Relationship CRUD
	CreateCoupleRelationshipInput,
	CreateChildAndParentsRelationshipInput,
	CreateRelationshipResponse,
	UpdateRelationshipResponse,
	// Person Merge
	PersonMergeAnalysis,
	PersonMergeInput,
	PersonMergeResponse,
	// Notes CRUD
	NoteInput,
	Note,
	NoteResponse,
	// Source Attachment
	AttachSourceInput,
	AttachSourceResponse,
	// Pedigrees
	PedigreeResponse,
	// Search Results
	PersonSearchResult,
	// Matches
	MatchesResponse,
} from "./types";

// Errors
export * from "./errors";

// Auth module
export * from "./auth";

// Places module
export * from "./places";

// Tree module
export * from "./tree";

// Utils module
export * from "./utils";

// API modules (modularized endpoints)
export * as TreeAPI from "./api/tree";
export * as MemoriesAPI from "./api/memories";
export * as StandardsAPI from "./api/standards";
export * as UserAPI from "./api/user";
export * as GenealogiesAPI from "./api/genealogies";
