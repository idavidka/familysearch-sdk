/**
 * FamilySearch Places API
 *
 * Handles place search and standardization.
 *
 * @see https://developers.familysearch.org/main/reference/searchplaces
 */

import type { FamilySearchSDK } from "../../client";
import type {
	PlaceDetailsResponse,
	PlaceSearchResponse,
	PlaceChildrenResponse,
	PlaceDescriptionsResponse,
	PlaceDescriptionResponse,
	PlaceTypesResponse,
	PlaceTypeResponse,
	PlaceTypeGroupsResponse,
	ParentPlacesResponse,
	CheckPlaceIsChildResponse,
} from "../../types";

/**
 * Place search query parameters
 *
 * Structured parameters for building FamilySearch Places API queries.
 * All name-value pairs support '+' operator to require, '-' to exclude.
 *
 * @see https://developers.familysearch.org/main/reference/readplaces
 */
export interface PlaceSearchQuery {
	/** The name of the place. Supports '?' and '*' wildcards (not at beginning). 
	 * Supports '~' suffix for fuzzy search. Example: 'New York, New York' */
	name?: string;
	/** Partial name for type-ahead use cases. If used, 'name' parameter is ignored. */
	partialName?: string;
	/** Date or date range. Use '+' prefix to require. Format: YYYY or YYYY/YYYY. 
	 * Example: '+date:1800/1900' or 'date:1823' */
	date?: string;
	/** Place type ID. Use '+' to require, '-' to exclude. Example: '+typeId:186' for cities */
	typeId?: string | string[];
	/** Place type group ID. Use '+' to require, '-' to exclude. Supports multiple. */
	typeGroupId?: string | string[];
	/** Parent jurisdiction ID. Use '+' to require, '-' to exclude. 
	 * Use '*' suffix for "any child". Example: '+parentId:1*' for all US places */
	parentId?: string | string[];
	/** Latitude of centroid to search near */
	latitude?: number;
	/** Longitude of centroid to search near */
	longitude?: number;
	/** Distance from centroid. Units: 'K' for kilometers, 'M' for miles. 
	 * Example: '45K' or '30M'. Default: miles */
	distance?: string;
	/** Place hint - comma-delimited Place Rep IDs or semi-colon-delimited names */
	placeHint?: string;
}

/**
 * Search for places
 *
 * Searches for places using structured query parameters.
 * Supports name search, date filtering, type filtering, parent jurisdiction, and more.
 *
 * @param sdk - SDK instance
 * @param query - Structured search query or simple string (interpreted as name)
 * @param options - Optional parameters
 * @param options.count - Number of results (default: 20)
 * @param options.start - Starting index for pagination (default: 0)
 * @returns Place search results or null
 *
 * @example
 * ```typescript
 * // Simple name search
 * const places = await searchPlaces(sdk, { name: 'London, England' });
 *
 * // Search with date filter
 * const places = await searchPlaces(sdk, { 
 *   name: 'New York', 
 *   date: '+date:1800/1900' 
 * });
 *
 * // Legacy string query (backward compatible)
 * const places = await searchPlaces(sdk, 'London, England', { count: 10 });
 * ```
 */
export async function searchPlaces(
	sdk: FamilySearchSDK,
	query: string | PlaceSearchQuery,
	options?: {
		count?: number;
		start?: number;
	}
): Promise<PlaceSearchResponse | null> {
	try {
		const count = options?.count || 20;
		const start = options?.start || 0;

		let queryString: string;

		// Build query string from structured query or use raw string
		if (typeof query === 'string') {
			// Backward compatibility: treat string as raw query
			queryString = query;
		} else {
			// Build structured query
			const queryParts: string[] = [];

			if (query.name) {
				queryParts.push(`name:"${query.name}"`);
			}
			if (query.partialName) {
				queryParts.push(`partialName:"${query.partialName}"`);
			}
			if (query.date) {
				queryParts.push(query.date);
			}
			if (query.typeId) {
				const typeIds = Array.isArray(query.typeId) ? query.typeId : [query.typeId];
				typeIds.forEach(id => queryParts.push(id));
			}
			if (query.typeGroupId) {
				const groupIds = Array.isArray(query.typeGroupId) ? query.typeGroupId : [query.typeGroupId];
				groupIds.forEach(id => queryParts.push(id));
			}
			if (query.parentId) {
				const parentIds = Array.isArray(query.parentId) ? query.parentId : [query.parentId];
				parentIds.forEach(id => queryParts.push(id));
			}
			if (query.latitude !== undefined) {
				queryParts.push(`latitude:${query.latitude}`);
			}
			if (query.longitude !== undefined) {
				queryParts.push(`longitude:${query.longitude}`);
			}
			if (query.distance) {
				queryParts.push(`distance:${query.distance}`);
			}
			if (query.placeHint) {
				queryParts.push(`placeHint:${query.placeHint}`);
			}

			queryString = queryParts.join(' ');
		}

		const params = new URLSearchParams({
			q: queryString,
			count: count.toString(),
			start: start.toString(),
		});

		const response = await sdk.get<PlaceSearchResponse>(
			`/platform/places/search?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to search places:`,
			error
		);
		return null;
	}
}

/**
 * Get place details by ID
 *
 * @param sdk - SDK instance
 * @param placeId - Place ID
 * @returns Place details or null
 */
export async function readPlaceDetails(
	sdk: FamilySearchSDK,
	placeId: string
): Promise<PlaceDetailsResponse | null> {
	try {
		const response = await sdk.get<PlaceDetailsResponse>(
			`/platform/places/${placeId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place details for ${placeId}:`,
			error
		);
		return null;
	}
}

/**
 * Get child places of a place
 *
 * Returns all places that are children of the specified place
 * (e.g., counties within a state, cities within a country).
 *
 * @param sdk - SDK instance
 * @param placeId - Parent place ID
 * @returns Child places or null
 *
 * @example
 * ```typescript
 * const children = await readPlaceChildren(sdk, '12345');
 * console.log('Child places:', children?.places?.length);
 * ```
 */
export async function readPlaceChildren(
	sdk: FamilySearchSDK,
	placeId: string
): Promise<PlaceChildrenResponse | null> {
	try {
		const response = await sdk.get<PlaceChildrenResponse>(
			`/platform/places/${placeId}/children`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get children for place ${placeId}:`,
			error
		);
		return null;
	}
}

/**
 * Get place descriptions
 *
 * Returns source descriptions for places, which contain metadata
 * about place resources.
 *
 * @param sdk - SDK instance
 * @param descriptionIds - Array of place description IDs
 * @returns Place descriptions or null
 *
 * @example
 * ```typescript
 * const descriptions = await readPlaceDescriptions(sdk, ['DESC-123', 'DESC-456']);
 * ```
 */
export async function readPlaceDescriptions(
	sdk: FamilySearchSDK,
	descriptionIds: string[]
): Promise<PlaceDescriptionsResponse | null> {
	try {
		const params = new URLSearchParams();
		descriptionIds.forEach((id) => params.append("pdids", id));

		const response = await sdk.get<PlaceDescriptionsResponse>(
			`/platform/places/description?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place descriptions:`,
			error
		);
		return null;
	}
}

/**
 * Get single place description
 *
 * Returns the source description for a specific place.
 *
 * @param sdk - SDK instance
 * @param descriptionId - Place description ID
 * @returns Place description or null
 *
 * @example
 * ```typescript
 * const description = await readPlaceDescription(sdk, 'DESC-ID');
 * ```
 */
export async function readPlaceDescription(
	sdk: FamilySearchSDK,
	descriptionId: string
): Promise<PlaceDescriptionResponse | null> {
	try {
		const response = await sdk.get<PlaceDescriptionResponse>(
			`/platform/places/description/${descriptionId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place description ${descriptionId}:`,
			error
		);
		return null;
	}
}

/**
 * Get place types vocabulary
 *
 * Returns the vocabulary of available place types (e.g., City, County, State).
 *
 * @param sdk - SDK instance
 * @returns Place types or null
 *
 * @example
 * ```typescript
 * const types = await readPlaceTypes(sdk);
 * console.log('Available place types:', types?.elements?.length);
 * ```
 */
export async function readPlaceTypes(
	sdk: FamilySearchSDK
): Promise<PlaceTypesResponse | null> {
	try {
		const response = await sdk.get<PlaceTypesResponse>(
			`/platform/places/types`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place types:`,
			error
		);
		return null;
	}
}

/**
 * Get single place type
 *
 * Returns details for a specific place type.
 *
 * @param sdk - SDK instance
 * @param typeId - Place type ID
 * @returns Place type or null
 *
 * @example
 * ```typescript
 * const type = await readPlaceType(sdk, 'City');
 * ```
 */
export async function readPlaceType(
	sdk: FamilySearchSDK,
	typeId: string
): Promise<PlaceTypeResponse | null> {
	try {
		const response = await sdk.get<PlaceTypeResponse>(
			`/platform/places/types/${typeId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place type ${typeId}:`,
			error
		);
		return null;
	}
}

/**
 * Get place type groups
 *
 * Returns groupings of place types (e.g., administrative divisions,
 * geographic features).
 *
 * @param sdk - SDK instance
 * @returns Place type groups or null
 *
 * @example
 * ```typescript
 * const groups = await readPlaceTypeGroups(sdk);
 * ```
 */
export async function readPlaceTypeGroups(
	sdk: FamilySearchSDK
): Promise<PlaceTypeGroupsResponse | null> {
	try {
		const response = await sdk.get<PlaceTypeGroupsResponse>(
			`/platform/places/type-groups`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place type groups:`,
			error
		);
		return null;
	}
}

/**
 * Get single place type group
 *
 * Returns details for a specific place type group by ID.
 *
 * @param sdk - SDK instance
 * @param groupId - Place type group ID
 * @returns Place type group or null
 *
 * @example
 * ```typescript
 * const group = await readPlaceTypeGroup(sdk, 'city-like');
 * ```
 */
export async function readPlaceTypeGroup(
	sdk: FamilySearchSDK,
	groupId: string
): Promise<PlaceTypeGroupsResponse | null> {
	try {
		const response = await sdk.get<PlaceTypeGroupsResponse>(
			`/platform/places/type-groups/${groupId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place type group ${groupId}:`,
			error
		);
		return null;
	}
}

/**
 * Search for parent places
 *
 * Searches for places that contain the given text string and their parents.
 * Filter results based on the parent IDs parameter if provided.
 *
 * @param sdk - SDK instance
 * @param searchValue - The search value (place name text to search for)
 * @param parentIds - Optional comma-separated list of parent place IDs to limit results
 * @returns Parent places or null
 *
 * @example
 * ```typescript
 * // Search for places containing "Provo"
 * const results = await searchParentPlaces(sdk, 'Provo');
 *
 * // Search with parent filter
 * const filtered = await searchParentPlaces(sdk, 'London', '1,33,56');
 * ```
 */
export async function searchParentPlaces(
	sdk: FamilySearchSDK,
	searchValue: string,
	parentIds?: string
): Promise<ParentPlacesResponse | null> {
	try {
		const params = new URLSearchParams({ value: searchValue });
		if (parentIds) {
			params.append("pids", parentIds);
		}

		const response = await sdk.get<ParentPlacesResponse>(
			`/platform/places/parents?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to search parent places for "${searchValue}":`,
			error
		);
		return null;
	}
}

/**
 * Check if place is child of another place
 *
 * Verifies whether a place is a child (sub-jurisdiction) of another place.
 *
 * @param sdk - SDK instance
 * @param childId - Child place ID
 * @param parentId - Parent place ID
 * @returns Result indicating if child relationship exists or null
 *
 * @example
 * ```typescript
 * const isChild = await checkPlaceIsChild(sdk, 'london-id', 'england-id');
 * if (isChild?.isChild) {
 *   console.log('London is in England');
 * }
 * ```
 */
export async function checkPlaceIsChild(
	sdk: FamilySearchSDK,
	childId: string,
	parentId: string
): Promise<CheckPlaceIsChildResponse | null> {
	try {
		const response = await sdk.get<CheckPlaceIsChildResponse>(
			`/platform/places/${childId}/is-child/${parentId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to check if ${childId} is child of ${parentId}:`,
			error
		);
		return null;
	}
}

/**
 * Read Place Description Attributes
 *
 * Read attributes of a place description including metadata and
 * administrative details.
 *
 * @param sdk - SDK instance
 * @param pdid - Place Description ID
 * @returns Place description attributes or null
 *
 * @example
 * ```typescript
 * const attributes = await readPlaceAttributes(sdk, '12345');
 * console.log(attributes);
 * ```
 */
export async function readPlaceAttributes(
	sdk: FamilySearchSDK,
	pdid: string
): Promise<PlaceDescriptionResponse | null> {
	try {
		const response = await sdk.get<PlaceDescriptionResponse>(
			`/platform/places/description/${pdid}/attributes`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place attributes for ${pdid}:`,
			error
		);
		return null;
	}
}

/**
 * Read Place Description With Related
 *
 * Read a place description with related place descriptions,
 * including historical variations and related jurisdictions.
 *
 * @param sdk - SDK instance
 * @param pdid - Place Description ID
 * @returns Place description with related places or null
 *
 * @example
 * ```typescript
 * const placeWithRelated = await readPlaceDescriptionWithRelated(sdk, '12345');
 * console.log(placeWithRelated);
 * ```
 */
export async function readPlaceDescriptionWithRelated(
	sdk: FamilySearchSDK,
	pdid: string
): Promise<PlaceDescriptionResponse | null> {
	try {
		const response = await sdk.get<PlaceDescriptionResponse>(
			`/platform/places/description/${pdid}/with-related`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place description with related for ${pdid}:`,
			error
		);
		return null;
	}
}

/**
 * Read Place Descriptions Group
 *
 * Read a group of place descriptions that represent the same
 * geographic location across different time periods or contexts.
 *
 * @param sdk - SDK instance
 * @param groupId - Place Descriptions Group ID
 * @returns Place descriptions group or null
 *
 * @example
 * ```typescript
 * const group = await readPlaceDescriptionsGroup(sdk, 'group-123');
 * console.log(group);
 * ```
 */
export async function readPlaceDescriptionsGroup(
	sdk: FamilySearchSDK,
	groupId: string
): Promise<PlaceDescriptionsResponse | null> {
	try {
		const response = await sdk.get<PlaceDescriptionsResponse>(
			`/platform/places/description-group/${groupId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get place descriptions group ${groupId}:`,
			error
		);
		return null;
	}
}

/**
 * PlacesAPI class provides convenient methods for searching and managing place standards.
 */
export class PlacesAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async searchPlaces(
		query: string | PlaceSearchQuery,
		options?: { count?: number; start?: number }
	) {
		return searchPlaces(this.sdk, query, options);
	}

	async readPlaceDetails(placeId: string) {
		return readPlaceDetails(this.sdk, placeId);
	}

	async readPlaceChildren(placeId: string) {
		return readPlaceChildren(this.sdk, placeId);
	}

	async readPlaceDescriptions(descriptionIds: string[]) {
		return readPlaceDescriptions(this.sdk, descriptionIds);
	}

	async readPlaceDescription(descriptionId: string) {
		return readPlaceDescription(this.sdk, descriptionId);
	}

	async readPlaceTypes() {
		return readPlaceTypes(this.sdk);
	}

	async readPlaceType(typeId: string) {
		return readPlaceType(this.sdk, typeId);
	}

	async readPlaceTypeGroups() {
		return readPlaceTypeGroups(this.sdk);
	}

	async readPlaceTypeGroup(groupId: string) {
		return readPlaceTypeGroup(this.sdk, groupId);
	}

	async searchParentPlaces(searchValue: string, parentIds?: string) {
		return searchParentPlaces(this.sdk, searchValue, parentIds);
	}

	async checkPlaceIsChild(childPlaceId: string, parentPlaceId: string) {
		return checkPlaceIsChild(this.sdk, childPlaceId, parentPlaceId);
	}

	async readPlaceAttributes(placeId: string) {
		return readPlaceAttributes(this.sdk, placeId);
	}

	async readPlaceDescriptionWithRelated(descriptionId: string) {
		return readPlaceDescriptionWithRelated(this.sdk, descriptionId);
	}

	async readPlaceDescriptionsGroup(groupId: string) {
		return readPlaceDescriptionsGroup(this.sdk, groupId);
	}
}
