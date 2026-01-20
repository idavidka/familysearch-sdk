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
} from "../../types";

/**
 * Search for places
 * 
 * @param sdk - SDK instance
 * @param query - Search query (place name)
 * @param count - Number of results (default: 20)
 * @returns Place search results or null
 * 
 * @example
 * ```typescript
 * const places = await searchPlaces(sdk, 'London, England', 10);
 * ```
 */
export async function searchPlaces(
	sdk: FamilySearchSDK,
	query: string,
	count: number = 20
): Promise<PlaceSearchResponse | null> {
	try {
		const params = new URLSearchParams({
			q: query,
			count: count.toString(),
		});

		const response = await sdk.get<PlaceSearchResponse>(
			`/platform/places/search?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
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
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get place details for ${placeId}:`,
			error
		);
		return null;
	}
}
