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
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
	/** Maximum requests per second (default: 10) */
	requestsPerSecond?: number;
	/** Maximum burst size (default: 20) */
	maxBurst?: number;
	/** Maximum retry attempts for 429 errors (default: 3) */
	maxRetries?: number;
	/** Initial backoff delay in ms (default: 1000) */
	initialBackoffMs?: number;
	/** Maximum backoff delay in ms (default: 30000) */
	maxBackoffMs?: number;
	/** Jitter factor (0-1) to add randomness to backoff delays (default: 0.3 = 30%) */
	jitterFactor?: number;
}

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
	/** Optional rate limiter configuration */
	rateLimiter?: RateLimiterConfig;
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
	lifespan?: string; // Lifespan string (e.g., "1899-1960")
	birthDate?: string;
	birthPlace?: string;
	deathDate?: string;
	deathPlace?: string;
	marriageDate?: string; // Marriage date
	marriagePlace?: string; // Marriage place
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
/**
 * Person reference in a relationship (can have different structures from API)
 */
export interface PersonReference {
	resourceId?: string;
	resource?: { resourceId?: string };
}

export interface Relationship {
	id: string;
	type?: string;
	person1?: PersonReference;
	person2?: PersonReference;
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

/**
 * Person memories response from FamilySearch API
 */
export interface PersonMemoriesResponse {
	/** Array of source descriptions (memories) */
	sourceDescriptions?: SourceDescription[];
	/** Pagination info */
	links?: Record<string, { href: string }>;
}

/**
 * Person search response from FamilySearch API
 * Example: https://api.familysearch.org/platform/tree/search?q.givenName=...
 */
export interface PersonSearchResponse {
	/** Total number of results found (e.g., 45854606) */
	results?: number;
	/** Current page index */
	index?: number;
	/** Array of search result entries (paginated, typically 20 per page) */
	entries?: TreePersonMatchEntry[];
	/** Pagination links */
	links?: Record<string, { href?: string }>;
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
 * Person notes response from API
 */
export interface PersonNotesResponse {
	persons?: Array<{
		notes?: Array<{
			id?: string;
			subject?: string;
			text?: string;
			attribution?: {
				contributor?: { resourceId?: string };
				modified?: string;
			};
		}>;
	}>;
}

/**
 * Enhanced person with additional details
 */
export interface EnhancedPerson extends PersonData {
	fullDetails?: PersonWithRelationships;
	notes?: PersonNotesResponse;
	sources?: PersonSourcesResponse;
	matches?: TreePersonMatchesResponse;
}

/**
 * Person with relationships response from getPersonWithDetails API
 */
export interface PersonWithRelationships {
	persons?: PersonData[];
	relationships?: Relationship[];
	childAndParentsRelationships?: ChildAndParentsRelationship[];
	sourceDescriptions?: SourceDescription[];
	sources?: SourceReference[];
}

/**
 * FamilySearch Source Description
 */
export interface SourceDescription {
	id: string;
	about?: string;
	titles?: Array<{ value: string }>;
	citations?: Array<{ value: string }>;
	resourceType?: string;
}

/**
 * FamilySearch Source Reference
 */
export interface SourceReference {
	description?: string;
	descriptionId?: string;
	qualifiers?: Array<{ name: string; value: string }>;
}

/**
 * Person sources response from FamilySearch API
 * Returned by GET /platform/tree/persons/{personId}/sources
 */
export interface PersonSourcesResponse {
	/** Array of persons with their sources */
	persons?: Array<{
		/** Person ID */
		id?: string;
		/** Source references attached to the person */
		sources?: SourceReference[];
	}>;
	/** Source descriptions providing details about sources */
	sourceDescriptions?: SourceDescription[];
}

/**
 * Tree person match entry
 * Represents a single match entry in the response
 */
export interface TreePersonMatchEntry {
	/** Entry ID */
	id?: string;
	/** Entry title */
	title?: string;
	/** Match score (can be at top level in search results) */
	score?: number;
	/** Match confidence level (can be at top level in search results) */
	confidence?: number;
	/** Links associated with the match entry */
	links?: {
		/** Link to the matched person */
		person?: {
			href?: string;
		};
		[key: string]: unknown;
	};
	/** Content information */
	content?: {
		/** Source description */
		sourceDescription?: SourceDescription;
		/** Match score */
		score?: number;
		/** Confidence level (e.g., 4 = high confidence) */
		confidence?: number;
		/** GedcomX data containing persons, relationships, places */
		gedcomx?: {
			/** Array of persons in the match */
			persons?: Array<{
				id?: string;
				names?: Array<{
					nameForms?: Array<{
						fullText?: string;
						parts?: Array<{
							type?: string;
							value?: string;
						}>;
					}>;
				}>;
				gender?: {
					type?: string;
				};
				facts?: Array<{
					type?: string;
					date?: {
						original?: string;
						formal?: string;
					};
					place?: {
						original?: string;
					};
				}>;
				display?: {
					name?: string;
					gender?: string;
					lifespan?: string;
					birthDate?: string;
					birthPlace?: string;
					deathDate?: string;
					deathPlace?: string;
					marriageDate?: string;
					marriagePlace?: string;
				};
			}>;
			/** Array of relationships in the match */
			relationships?: Array<{
				type?: string;
				person1?: { resourceId?: string };
				person2?: { resourceId?: string };
			}>;
			/** Array of places referenced */
			places?: Array<{
				id?: string;
				names?: Array<{
					value?: string;
				}>;
			}>;
		};
	};
	/** Match information including collection and status */
	matchInfo?: Array<{
		/** Collection URL (e.g., tree://MEMORIES, records://...) */
		collection?: string;
		/** Match status (e.g., pending, accepted) */
		status?: string;
	}>;
}

/**
 * Options for querying tree person matches
 */
export interface TreePersonMatchesOptions {
	/** Filter by match status */
	status?: string;
	/** Filter by collection ID */
	collection?: string;
	/** Number of results to return */
	count?: number;
	/** Pagination start index */
	start?: number;
}

/**
 * Tree person matches response from FamilySearch API
 * Returned by GET /platform/tree/persons/{personId}/matches
 */
export interface TreePersonMatchesResponse {
	/** Array of source descriptions (match records) */
	sourceDescriptions?: SourceDescription[];
	/** Array of persons */
	persons?: PersonData[];
	/** Entries with match information */
	entries?: TreePersonMatchEntry[];
}

/**
 * Person match input for external GEDCOM data
 * Used to search for matching persons in the FamilySearch Tree
 * based on a virtual person profile without an existing person ID
 *
 * NOTE: FamilySearch Search API supports only ONE value for each relationship field.
 * If a person has multiple spouses or parents, only the first/primary one should be provided.
 */
export interface PersonMatchInput {
	/** Person's given/first name(s) */
	givenName?: string;
	/** Person's family/last name(s) */
	familyName?: string;
	/** Person's full name (alternative to givenName + familyName) */
	fullName?: string;
	/** Person's gender (e.g., "Male", "Female") */
	gender?: string;
	/** Birth date in various formats (e.g., "1850", "15 March 1850") */
	birthDate?: string;
	/** Birth place name */
	birthPlace?: string;
	/** Death date in various formats */
	deathDate?: string;
	/** Death place name */
	deathPlace?: string;
	/** Marriage date (if searching with spouse context) - only ONE marriage supported */
	marriageDate?: string;
	/** Marriage place (if searching with spouse context) - only ONE marriage supported */
	marriagePlace?: string;
	/** Father's given name - only ONE father supported */
	fatherGivenName?: string;
	/** Father's family name - only ONE father supported */
	fatherFamilyName?: string;
	/** Mother's given name - only ONE mother supported */
	motherGivenName?: string;
	/** Mother's family name - only ONE mother supported */
	motherFamilyName?: string;
	/** Spouse's given name - only ONE spouse supported */
	spouseGivenName?: string;
	/** Spouse's family name - only ONE spouse supported */
	spouseFamilyName?: string;
}

/**
 * Options for person match queries
 */
export interface PersonMatchOptions {
	/** Number of results to return (default: 20) */
	count?: number;
	/** Filter by collection ID */
	collection?: string;
}

/**
 * Enhanced pedigree with full details
 */
export interface EnhancedPedigreeData {
	persons: EnhancedPerson[];
	relationships: Relationship[];
	environment?: FamilySearchEnvironment;
	/**
	 * IDs of persons in the direct ancestry before fullTree expansion.
	 * These are the persons returned by the ancestry API (typically 8-15 persons for 4 generations).
	 * Used to determine which persons are "connectable" to the root person.
	 */
	ancestryPersonIds?: string[];
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

// ====================================
// Discussion Types
// ====================================

/**
 * Discussion comment
 */
export interface DiscussionComment {
	id?: string;
	text?: string;
	contributor?: {
		resourceId?: string;
		resource?: string;
	};
	created?: number;
	modified?: number;
}

/**
 * Discussion reference
 */
export interface Discussion {
	id?: string;
	title?: string;
	details?: string;
	created?: number;
	modified?: number;
	numberOfComments?: number;
	contributor?: {
		resourceId?: string;
		resource?: string;
	};
	comments?: DiscussionComment[];
}

/**
 * Person discussions response
 */
export interface PersonDiscussionsResponse {
	discussions?: Discussion[];
	persons?: Array<{
		id?: string;
		"discussion-references"?: Array<{
			resource?: string;
			resourceId?: string;
		}>;
	}>;
}

// ====================================
// Portrait/Photo Types
// ====================================

/**
 * Person portrait/photo
 */
export interface PersonPortrait {
	id?: string;
	url?: string;
	thumbUrl?: string;
	iconUrl?: string;
	width?: number;
	height?: number;
	mediaType?: string;
}

/**
 * Person portraits response
 */
export interface PersonPortraitsResponse {
	sourceDescriptions?: Array<{
		id?: string;
		about?: string;
		mediaType?: string;
		resourceType?: string;
		titles?: Array<{ value?: string }>;
		descriptions?: Array<{ value?: string }>;
	}>;
}

// ====================================
// Change History Types
// ====================================

/**
 * Change entry for a person
 */
export interface ChangeEntry {
	id?: string;
	title?: string;
	updated?: number;
	changeInfo?: Array<{
		operation?: string;
		objectType?: string;
		objectModifier?: string;
		reason?: string;
	}>;
	contributors?: Array<{
		resourceId?: string;
		resource?: string;
		name?: string;
	}>;
}

/**
 * Person change history response
 */
export interface PersonChangeHistoryResponse {
	entries?: ChangeEntry[];
}

// ====================================
// Source Detail Types
// ====================================

/**
 * Enhanced source description with full details
 */
export interface SourceDescriptionDetail extends SourceDescription {
	mediaType?: string;
	repository?: {
		resource?: string;
		resourceId?: string;
	};
	created?: number;
	modified?: number;
	coverage?: Array<{
		spatial?: {
			original?: string;
		};
		temporal?: {
			original?: string;
			formal?: string;
		};
	}>;
	identifiers?: Record<string, string[]>;
}

/**
 * Source descriptions list response
 */
export interface SourceDescriptionsResponse {
	sourceDescriptions?: SourceDescriptionDetail[];
}

/**
 * Single source description response
 */
export interface SourceDescriptionResponse {
	sourceDescriptions?: SourceDescriptionDetail[];
}

// ====================================
// Memory Detail Types
// ====================================

/**
 * Memory artifact (photo/document/story)
 */
export interface MemoryArtifact {
	id?: string;
	about?: string;
	mediaType?: string;
	resourceType?: string;
	titles?: Array<{ value?: string }>;
	descriptions?: Array<{ value?: string }>;
	created?: number;
	modified?: number;
	contributors?: Array<{
		resourceId?: string;
		resource?: string;
	}>;
	coverage?: Array<{
		spatial?: {
			original?: string;
		};
		temporal?: {
			original?: string;
		};
	}>;
}

/**
 * Memory comments
 */
export interface MemoryComment {
	id?: string;
	text?: string;
	created?: number;
	contributor?: {
		resourceId?: string;
		resource?: string;
	};
}

/**
 * Memory with comments response
 */
export interface MemoryWithCommentsResponse {
	sourceDescriptions?: MemoryArtifact[];
	discussions?: Array<{
		id?: string;
		comments?: MemoryComment[];
	}>;
}

/**
 * User uploaded memories response
 */
export interface UserMemoriesResponse {
	sourceDescriptions?: MemoryArtifact[];
}

// ====================================
// Vocabularies API Types
// ====================================

/**
 * Vocabulary metadata
 */
export interface VocabularyMetadata {
	id?: string;
	name?: string;
	description?: string;
	links?: Record<string, { href?: string }>;
}

/**
 * Vocabularies list response
 */
export interface VocabulariesResponse {
	vocabularies?: VocabularyMetadata[];
}

/**
 * Vocabulary concept/term
 */
export interface VocabularyConceptDetail {
	id?: string;
	label?: string;
	description?: string;
	value?: string;
	links?: Record<string, { href?: string }>;
}

/**
 * Vocabulary concepts list response
 */
export interface VocabularyConceptsResponse {
	concepts?: VocabularyConceptDetail[];
}

/**
 * Vocabulary concept single response
 */
export interface VocabularyConceptResponse {
	concepts?: VocabularyConceptDetail[];
}

// ====================================
// Names API Types (Standards)
// ====================================

/**
 * Name script detection response
 */
export interface NameScriptResponse {
	name?: string;
	script?: string; // ISO 15924 script code (e.g., 'Latn', 'Cyrl', 'Hani')
}

/**
 * Name segment (part)
 */
export interface NameSegment {
	type?: string; // 'Given', 'Surname', 'Prefix', 'Suffix', etc.
	value?: string;
}

/**
 * Name segments response
 */
export interface NameSegmentsResponse {
	segments?: NameSegment[];
}

// ====================================
// Dates API Types (Standards)
// ====================================

/**
 * Standardized date information
 */
export interface StandardizedDate {
	original?: string;
	formal?: string; // ISO 8601 format (e.g., '+1850-03-15')
	normalized?: string[];
}

/**
 * Date standardization response
 */
export interface DateStandardizationResponse {
	dates?: StandardizedDate[];
}

// ====================================
// Memory Personas API Types
// ====================================

/**
 * Memory persona (person identified in a memory)
 */
export interface MemoryPersona {
	id?: string;
	display?: {
		name?: string;
		gender?: string;
		birthDate?: string;
		deathDate?: string;
		lifespan?: string;
	};
	identifiers?: Record<string, string>;
	links?: Record<string, { href?: string }>;
}

/**
 * Memory personas list response
 */
export interface MemoryPersonasResponse {
	persons?: MemoryPersona[];
}

/**
 * Memory persona single response
 */
export interface MemoryPersonaResponse {
	persons?: MemoryPersona[];
}

// ====================================
// Person CRUD Types (Write Operations)
// ====================================

/**
 * Input for creating or updating a person
 */
export interface PersonInput {
	/** Person names */
	names?: Array<{
		type?: string;
		preferred?: boolean;
		nameForms?: Array<{
			lang?: string;
			fullText?: string;
			parts?: Array<{
				type?: string; // 'http://gedcomx.org/Given', 'http://gedcomx.org/Surname'
				value?: string;
			}>;
		}>;
	}>;
	/** Gender */
	gender?: {
		type?: string; // 'http://gedcomx.org/Male', 'http://gedcomx.org/Female', 'http://gedcomx.org/Unknown'
	};
	/** Facts (birth, death, etc.) */
	facts?: Array<{
		type?: string; // 'http://gedcomx.org/Birth', 'http://gedcomx.org/Death', etc.
		date?: {
			original?: string;
			formal?: string;
		};
		place?: {
			original?: string;
		};
		value?: string;
	}>;
}

/**
 * Response from creating a person
 */
export interface CreatePersonResponse {
	persons?: FamilySearchPerson[];
	links?: {
		person?: { href?: string };
	};
}

/**
 * Response from updating a person
 */
export interface UpdatePersonResponse {
	persons?: FamilySearchPerson[];
}

/**
 * Response from deleting a person
 */
export interface DeletePersonResponse {
	statusCode: number;
	statusText: string;
}

// ====================================
// Relationship CRUD Types (Write Operations)
// ====================================

/**
 * Input for creating a couple relationship
 */
export interface CreateCoupleRelationshipInput {
	/** Person 1 ID */
	person1: string;
	/** Person 2 ID */
	person2: string;
	/** Facts (marriage, divorce, etc.) */
	facts?: Array<{
		type?: string; // 'http://gedcomx.org/Marriage', 'http://gedcomx.org/Divorce', etc.
		date?: {
			original?: string;
			formal?: string;
		};
		place?: {
			original?: string;
		};
	}>;
}

/**
 * Input for creating a child-and-parents relationship
 */
export interface CreateChildAndParentsRelationshipInput {
	/** Child person ID */
	child: string;
	/** Father person ID (optional) */
	father?: string;
	/** Mother person ID (optional) */
	mother?: string;
	/** Father facts (optional) */
	fatherFacts?: Array<{
		type?: string; // 'http://gedcomx.org/AdoptiveParent', 'http://gedcomx.org/BiologicalParent', etc.
	}>;
	/** Mother facts (optional) */
	motherFacts?: Array<{
		type?: string;
	}>;
}

/**
 * Response from creating a relationship
 */
export interface CreateRelationshipResponse {
	relationships?: Relationship[];
	childAndParentsRelationships?: ChildAndParentsRelationship[];
	links?: {
		relationship?: { href?: string };
	};
}

/**
 * Response from updating a relationship
 */
export interface UpdateRelationshipResponse {
	relationships?: Relationship[];
	childAndParentsRelationships?: ChildAndParentsRelationship[];
}

// ====================================
// Person Merge Types
// ====================================

/**
 * Person merge analysis result
 */
export interface PersonMergeAnalysis {
	/** Survivor person (person to keep) */
	survivor?: {
		id?: string;
		resource?: string;
	};
	/** Duplicate person (person to merge into survivor) */
	duplicate?: {
		id?: string;
		resource?: string;
	};
	/** Conflicts between the two persons */
	conflicts?: Array<{
		type?: string;
		survivorValue?: unknown;
		duplicateValue?: unknown;
	}>;
	/** Can merge? */
	canMerge?: boolean;
	/** Warnings */
	warnings?: string[];
}

/**
 * Input for person merge operation
 */
export interface PersonMergeInput {
	/** Person to keep (survivor) */
	survivorId: string;
	/** Person to merge (will be deleted) */
	duplicateId: string;
	/** Optional: Specific resolution for conflicts */
	resolutions?: Array<{
		type?: string;
		useValue?: "survivor" | "duplicate";
	}>;
}

/**
 * Response from person merge
 */
export interface PersonMergeResponse {
	persons?: FamilySearchPerson[];
	links?: {
		person?: { href?: string };
	};
}

// ====================================
// Notes CRUD Types
// ====================================

/**
 * Input for creating or updating a note
 */
export interface NoteInput {
	/** Subject/title of the note */
	subject?: string;
	/** Note text */
	text: string;
	/** Attribution (optional) */
	attribution?: {
		contributor?: {
			resourceId?: string;
		};
		modified?: number; // timestamp
	};
}

/**
 * Note object
 */
export interface Note {
	id?: string;
	subject?: string;
	text?: string;
	attribution?: {
		contributor?: {
			resourceId?: string;
			resource?: string;
		};
		modified?: number;
	};
	links?: {
		note?: { href?: string };
	};
}

/**
 * Response from creating/updating a note
 */
export interface NoteResponse {
	notes?: Note[];
	links?: {
		note?: { href?: string };
	};
}

// ====================================
// Source Attachment Types
// ====================================

/**
 * Input for attaching a source to a person/relationship
 */
export interface AttachSourceInput {
	/** Source description ID */
	descriptionId: string;
	/** Tags (optional) */
	tags?: Array<{
		resource?: string; // Tag URI like 'http://gedcomx.org/Name', 'http://gedcomx.org/Birth'
	}>;
}

/**
 * Response from attaching a source
 */
export interface AttachSourceResponse {
	sourceDescriptions?: SourceDescription[];
	links?: {
		sourceReference?: { href?: string };
	};
}

// ====================================
// Pedigree Types
// ====================================

/**
 * Response from ancestry/descendancy queries
 */
export interface PedigreeResponse {
	persons?: PersonData[];
	relationships?: RelationshipDetails[];
	childAndParentsRelationships?: RelationshipDetails[];
}

// ====================================
// Search Result Types
// ====================================

/**
 * Person search result from search queries
 */
export interface PersonSearchResult {
	entries?: Array<{
		id?: string;
		score?: number;
		content?: {
			gedcomx?: {
				persons?: PersonData[];
			};
		};
	}>;
	results?: number;
}

// ====================================
// Matches Response Types
// ====================================

/**
 * Response from matches/non-matches queries
 */
export interface MatchesResponse {
	persons?: PersonData[];
	sourceDescriptions?: SourceDescription[];
	entries?: Array<{
		id?: string;
		content?: {
			gedcomx?: {
				persons?: PersonData[];
				sourceDescriptions?: SourceDescription[];
			};
		};
	}>;
}
