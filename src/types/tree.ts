/**
 * Tree API Types
 * 
 * Types for person, relationship, and pedigree operations
 */

// ====================================
// Person Types
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
// Relationship Types
// ====================================

/**
 * Person reference in a relationship (can have different structures from API)
 */
export interface PersonReference {
	resourceId?: string;
	resource?: { resourceId?: string };
}

/**
 * Relationship between persons (couple relationships)
 */
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
// Pedigree Types
// ====================================

/**
 * Pedigree data from ancestry API
 */
export interface PedigreeData {
	persons?: PersonData[];
	relationships?: Relationship[];
}

/**
 * Response from ancestry/descendancy queries
 */
export interface PedigreeResponse {
	persons?: PersonData[];
	relationships?: Relationship[]; // Changed from RelationshipDetails[] - API returns full Relationship objects
	childAndParentsRelationships?: RelationshipDetails[];
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
 * Enhanced person with additional details
 */
export interface EnhancedPerson extends PersonData {
	fullDetails?: PersonWithRelationships;
	notes?: PersonNotesResponse;
	sources?: PersonSourcesResponse;
	matches?: TreePersonMatchesResponse;
}

/**
 * Enhanced pedigree with full details
 */
export interface EnhancedPedigreeData {
	persons: EnhancedPerson[];
	relationships: Relationship[];
	environment?: string;
	/**
	 * IDs of persons in the direct ancestry before fullTree expansion.
	 * These are the persons returned by the ancestry API (typically 8-15 persons for 4 generations).
	 * Used to determine which persons are "connectable" to the root person.
	 */
	ancestryPersonIds?: string[];
}

// ====================================
// Notes Types
// ====================================

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
// Source Types
// ====================================

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
// Search & Matches Types
// ====================================

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
// Discussion Input/Response Types
// ====================================

/**
 * Input for creating or updating a discussion
 */
export interface DiscussionInput {
	/** Discussion title */
	title: string;
	/** Discussion details/body */
	details: string;
	/** About (URI reference to person/relationship) */
	about?: string;
}

/**
 * Discussion response from API
 */
export interface DiscussionResponse {
	discussions?: Discussion[];
}

/**
 * Input for creating a discussion comment
 */
export interface DiscussionCommentInput {
	/** Comment text */
	text: string;
}

/**
 * Discussion comment response from API
 */
export interface DiscussionCommentResponse {
	discussions?: Discussion[];
}

/**
 * Generic delete response
 */
export interface DeleteResponse {
	statusCode: number;
	statusText: string;
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

/**
 * Couple relationship change history response
 */
export interface CoupleRelationshipChangeHistoryResponse {
	entries?: ChangeEntry[];
}

/**
 * Child-and-parents relationship change history response
 */
export interface ChildAndParentsRelationshipChangeHistoryResponse {
	entries?: ChangeEntry[];
}

/**
 * Restore change input (for any change type)
 */
export interface RestoreChangeInput {
	changeId: string;
}

/**
 * Restore change response
 */
export interface RestoreChangeResponse {
	entries?: ChangeEntry[];
}

/**
 * Preferred relationship response (for parent or spouse)
 */
export interface PreferredRelationshipResponse {
	/** Child-and-parents relationships (for preferred parent) */
	childAndParentsRelationships?: Array<{
		resourceId?: string;
		resource?: string;
	}>;
	/** Couple relationships (for preferred spouse) */
	relationships?: Array<{
		resourceId?: string;
		resource?: string;
	}>;
}

/**
 * Input for setting preferred relationship
 */
export interface SetPreferredRelationshipInput {
	/** Child-and-parents relationships (for preferred parent) */
	childAndParentsRelationships?: Array<{
		resourceId: string;
		resource: string;
	}>;
	/** Couple relationships (for preferred spouse) */
	relationships?: Array<{
		resourceId: string;
		resource: string;
	}>;
}

/**
 * Input for setting parent order in a child-and-parents relationship
 */
export interface SetParentOrderInput {
	persons: Array<{
		resourceId: string;
		resource: string;
	}>;
}

/**
 * Response for parent order operation
 */
export interface SetParentOrderResponse {
	childAndParentsRelationships?: Array<{
		id?: string;
		parent1?: {
			resourceId?: string;
			resource?: string;
		};
		parent2?: {
			resourceId?: string;
			resource?: string;
		};
	}>;
}

/**
 * Input for setting spouse order in a couple relationship
 */
export interface SetSpouseOrderInput {
	persons: Array<{
		resourceId: string;
		resource: string;
	}>;
}

/**
 * Response for spouse order operation
 */
export interface SetSpouseOrderResponse {
	relationships?: Array<{
		id?: string;
		person1?: {
			resourceId?: string;
			resource?: string;
		};
		person2?: {
			resourceId?: string;
			resource?: string;
		};
	}>;
}

/**
 * Person families response (all relationships person belongs to)
 */
export interface PersonFamiliesResponse {
	persons?: PersonData[];
	childAndParentsRelationships?: RelationshipDetails[];
	relationships?: Relationship[];
}

/**
 * Person parents response (direct parents)
 */
export interface PersonParentsResponse {
	persons?: PersonData[];
	childAndParentsRelationships?: RelationshipDetails[];
}

/**
 * Person spouses response (all spouses)
 */
export interface PersonSpousesResponse {
	persons?: PersonData[];
	relationships?: Relationship[];
}
