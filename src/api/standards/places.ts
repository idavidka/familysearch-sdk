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
 * Search for places
 *
 * Searches for places by name with optional pagination support.
 *
 * @param sdk - SDK instance
 * @param query - Search query (place name)
 * @param count - Number of results (default: 20)
 * @param start - Starting index for pagination (default: 0)
 * @returns Place search results or null
 *
 * @example
 * ```typescript
 * // Basic search
 * const places = await searchPlaces(sdk, 'London, England', 10);
 *
 * // With pagination
 * const nextPage = await searchPlaces(sdk, 'London, England', 10, 10);
 * ```
 */
export async function searchPlaces(
	sdk: FamilySearchSDK,
	query: string,
	count: number = 20,
	start: number = 0
): Promise<PlaceSearchResponse | null> {
	try {
		const params = new URLSearchParams({
			q: query,
			count: count.toString(),
			start: start.toString(),
		});

		const response = await sdk.get<PlaceSearchResponse>(
			`/platform/places/search?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to search places for "${query}":`,
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
export async function getPlaceDetails(
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
 * const children = await getPlaceChildren(sdk, '12345');
 * console.log('Child places:', children?.places?.length);
 * ```
 */
export async function getPlaceChildren(
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
 * const descriptions = await getPlaceDescriptions(sdk, ['DESC-123', 'DESC-456']);
 * ```
 */
export async function getPlaceDescriptions(
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
 * const description = await getPlaceDescription(sdk, 'DESC-ID');
 * ```
 */
export async function getPlaceDescription(
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
 * const types = await getPlaceTypes(sdk);
 * console.log('Available place types:', types?.elements?.length);
 * ```
 */
export async function getPlaceTypes(
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
 * const type = await getPlaceType(sdk, 'City');
 * ```
 */
export async function getPlaceType(
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
 * const groups = await getPlaceTypeGroups(sdk);
 * ```
 */
export async function getPlaceTypeGroups(
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
 * const group = await getPlaceTypeGroup(sdk, 'city-like');
 * ```
 */
export async function getPlaceTypeGroup(
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
