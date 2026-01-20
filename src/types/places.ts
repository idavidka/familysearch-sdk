/**
 * Places API Types
 * 
 * Types for place search and standardization
 */

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

/**
 * Place children response
 */
export interface PlaceChildrenResponse {
	places?: PlaceDescription[];
}

/**
 * Place descriptions response
 */
export interface PlaceDescriptionsResponse {
	sourceDescriptions?: Array<{
		id?: string;
		resourceType?: string;
		titles?: Array<{
			value?: string;
		}>;
		descriptions?: Array<{
			value?: string;
		}>;
		about?: string;
	}>;
}

/**
 * Single place description response
 */
export interface PlaceDescriptionResponse {
	sourceDescriptions?: Array<{
		id?: string;
		resourceType?: string;
		titles?: Array<{
			value?: string;
		}>;
		descriptions?: Array<{
			value?: string;
		}>;
		about?: string;
		places?: PlaceDescription[];
	}>;
}

/**
 * Place types response (vocabulary)
 */
export interface PlaceTypesResponse {
	elements?: Array<{
		id?: string;
		value?: string;
		title?: string;
		labels?: Array<{
			lang?: string;
			value?: string;
		}>;
	}>;
}

/**
 * Single place type response
 */
export interface PlaceTypeResponse {
	elements?: Array<{
		id?: string;
		value?: string;
		title?: string;
		labels?: Array<{
			lang?: string;
			value?: string;
		}>;
	}>;
}

/**
 * Place type groups response
 */
export interface PlaceTypeGroupsResponse {
	elements?: Array<{
		id?: string;
		value?: string;
		title?: string;
		labels?: Array<{
			lang?: string;
			value?: string;
		}>;
	}>;
}

/**
 * Parent places search response
 */
export interface ParentPlacesResponse {
	places?: PlaceDescription[];
}

/**
 * Check place is child response
 */
export interface CheckPlaceIsChildResponse {
	isChild?: boolean;
}
