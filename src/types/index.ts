/**
 * FamilySearch SDK Types
 *
 * Core type definitions for the FamilySearch API
 */

// ====================================
// Environment Configuration
// ====================================

/**
 * FamilySearch API environment
 */
export type FamilySearchEnvironment = "production" | "beta" | "integration";

/**
 * Environment-specific endpoint configuration
 */
export interface EnvironmentConfig {
	/** Identity server host for OAuth */
	identHost: string;
	/** Platform API host for data operations */
	platformHost: string;
}

// ====================================
// SDK Configuration
// ====================================

/**
 * SDK initialization options
 */
export interface FamilySearchSDKConfig {
	/** API environment (default: "integration") */
	environment?: FamilySearchEnvironment;
	/** OAuth access token */
	accessToken?: string;
	/** Application key for API requests */
	appKey?: string;
	/** Optional logger for debugging */
	logger?: SDKLogger;
}

/**
 * Logger interface for SDK debugging
 */
export interface SDKLogger {
	log: (message: string, ...args: unknown[]) => void;
	warn: (message: string, ...args: unknown[]) => void;
	error: (message: string, ...args: unknown[]) => void;
}

// ====================================
// API Response Types
// ====================================

/**
 * Generic API response wrapper
 */
export interface FamilySearchApiResponse<T> {
	/** Response data */
	data?: T;
	/** HTTP status code */
	statusCode: number;
	/** HTTP status text */
	statusText: string;
	/** Response headers */
	headers: Record<string, string>;
}

/**
 * API error with additional context
 */
export interface FamilySearchApiError extends Error {
	/** HTTP status code if available */
	statusCode?: number;
	/** Full response object */
	response?: FamilySearchApiResponse<unknown>;
}

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

// ====================================
// Person/Tree Types
// ====================================

/**
 * FamilySearch person in the tree
 */
export interface FamilySearchPerson {
	/** Person ID */
	id: string;
	/** Full name */
	name?: string;
	/** Given/first name */
	givenName?: string;
	/** Family/last name */
	familyName?: string;
	/** Gender (Male, Female, Unknown) */
	gender?: string;
	/** Birth date */
	birthDate?: string;
	/** Birth place */
	birthPlace?: string;
	/** Death date */
	deathDate?: string;
	/** Death place */
	deathPlace?: string;
	/** Lifespan string (e.g., "1900-1980") */
	lifespan?: string;
}

/**
 * Display information for a person
 */
export interface PersonDisplay {
	name?: string;
	gender?: string;
	birthDate?: string;
	birthPlace?: string;
	deathDate?: string;
	deathPlace?: string;
}

/**
 * Name form with parts
 */
export interface NameForm {
	fullText?: string;
	parts?: Array<{
		type?: string;
		value?: string;
	}>;
}

/**
 * Fact/event information
 */
export interface PersonFact {
	type?: string;
	date?: {
		formal?: string;
		original?: string;
	};
	place?: {
		original?: string;
	};
	value?: string;
	links?: {
		conclusion?: { href?: string };
		person?: { href?: string };
	};
}

/**
 * Full person data from API
 */
export interface PersonData {
	id: string;
	display?: PersonDisplay;
	names?: Array<{
		nameForms?: NameForm[];
	}>;
	gender?: {
		type?: string;
	};
	facts?: PersonFact[];
	links?: {
		person?: { href?: string };
	};
	identifiers?: Record<string, string[]>;
}

// ====================================
// Relationship Types
// ====================================

/**
 * Relationship between persons (couple relationships)
 */
export interface Relationship {
	id: string;
	type?: string;
	person1?: { resourceId?: string };
	person2?: { resourceId?: string };
	parent1?: { resourceId?: string };
	parent2?: { resourceId?: string };
	child?: { resourceId?: string };
	facts?: PersonFact[];
	details?: RelationshipDetails;
}

/**
 * Child and parents relationship
 */
export interface ChildAndParentsRelationship {
	id: string;
	parent1?: { resourceId?: string };
	parent2?: { resourceId?: string };
	child?: { resourceId?: string };
	parent1Facts?: PersonFact[];
	parent2Facts?: PersonFact[];
	sources?: Array<{ description?: string }>;
	notes?: Array<{ text?: string }>;
}

/**
 * Detailed relationship information
 */
export interface RelationshipDetails {
	facts?: PersonFact[];
	persons?: Array<{
		facts?: PersonFact[];
	}>;
}

// ====================================
// Place Types
// ====================================

/**
 * FamilySearch place
 */
export interface FamilySearchPlace {
	/** Place ID */
	id: string;
	/** Place name */
	name: string;
	/** Fully qualified name */
	fullName?: string;
	/** Place type */
	type?: string;
	/** Latitude coordinate */
	latitude?: number;
	/** Longitude coordinate */
	longitude?: number;
}

/**
 * Place description from API
 */
export interface PlaceDescription {
	id?: string;
	names?: Array<{
		lang?: string;
		value?: string;
	}>;
	type?: string;
	temporalDescription?: {
		original?: string;
		formal?: string;
	};
	latitude?: number;
	longitude?: number;
	place?: {
		original?: string;
		description?: string;
	};
	jurisdiction?: {
		id?: string;
		name?: string;
	};
	spatialDescription?: {
		type?: string;
		geojson?: unknown;
	};
}

/**
 * Place search result
 */
export interface PlaceSearchResult {
	id?: string;
	title?: string;
	fullyQualifiedName?: string;
	names?: Array<{
		lang?: string;
		value?: string;
	}>;
	standardized?: {
		id?: string;
		fullyQualifiedName?: string;
	};
	jurisdiction?: {
		id?: string;
		name?: string;
	};
	temporalDescription?: {
		formal?: string;
		original?: string;
	};
}

/**
 * Place search API response
 */
export interface PlaceSearchResponse {
	entries?: Array<{
		id?: string;
		title?: string;
		content?: {
			gedcomx?: {
				places?: PlaceDescription[];
			};
		};
	}>;
	results?: number;
}

/**
 * Place details API response
 */
export interface PlaceDetailsResponse {
	places?: PlaceDescription[];
}

// ====================================
// Pedigree/Ancestry Types
// ====================================

/**
 * Pedigree data from ancestry API
 */
export interface PedigreeData {
	persons?: PersonData[];
	relationships?: Relationship[];
}

/**
 * Enhanced person with additional details
 */
export interface EnhancedPerson extends PersonData {
	fullDetails?: PersonWithRelationships;
	notes?: unknown;
}

/**
 * Person with relationships response from getPersonWithDetails API
 */
export interface PersonWithRelationships {
	persons?: PersonData[];
	relationships?: Relationship[];
	childAndParentsRelationships?: ChildAndParentsRelationship[];
	sourceDescriptions?: Array<unknown>;
}

/**
 * Enhanced pedigree with full details
 */
export interface EnhancedPedigreeData {
	persons: EnhancedPerson[];
	relationships: Relationship[];
	environment?: FamilySearchEnvironment;
}

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

// ====================================
// Progress Callback Types
// ====================================

/**
 * Progress callback for long operations
 */
export type ProgressCallback = (progress: {
	stage: string;
	current: number;
	total: number;
	percent: number;
}) => void;
