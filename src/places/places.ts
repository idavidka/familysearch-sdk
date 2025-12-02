/**
 * FamilySearch Places API Module
 *
 * Provides helpers for searching and retrieving place information
 * from the FamilySearch Places API.
 *
 * API Documentation: https://developers.familysearch.org/main/page/places-endpoints
 */

import type { FamilySearchSDK } from "../client";
import type {
	PlaceDescription,
	PlaceDetailsResponse,
	PlaceSearchResponse,
	PlaceSearchResult,
} from "../types";

/**
 * Search for places by name
 *
 * @param sdk - FamilySearch SDK instance
 * @param query - The search query string
 * @param options - Optional search parameters
 * @returns Promise with search results
 *
 * @example
 * ```typescript
 * const results = await searchPlaces(sdk, "London", { date: "1850" });
 * ```
 */
export async function searchPlaces(
	sdk: FamilySearchSDK,
	query: string,
	options?: {
		count?: number;
		start?: number;
		date?: string;
		parentId?: string;
	}
): Promise<PlaceSearchResult[]> {
	// Build query parameters according to FamilySearch API docs
	const queryParts = [`name:"${query}"`];

	// Add date to query if provided
	if (options?.date) {
		queryParts.push(`+date:${options.date}`);
	}

	// Add parentId to query if provided
	if (options?.parentId) {
		queryParts.push(`+parentId:${options.parentId}`);
	}

	const finalQuery = queryParts.join(" ");

	const params = new URLSearchParams({
		q: finalQuery,
		...(options?.count && { count: options.count.toString() }),
		...(options?.start && { start: options.start.toString() }),
	});

	const response = await sdk.get<PlaceSearchResponse>(
		`/platform/places/search?${params.toString()}`
	);

	const data = response.data || {};

	// Check if entries exist
	if (!data?.entries?.length) {
		// If we had a date filter and got no results, try again without it
		if (options?.date) {
			const { date: _date, ...optionsWithoutDate } = options;
			return searchPlaces(sdk, query, optionsWithoutDate);
		}
		return [];
	}

	// Transform the response into a cleaner format
	return (
		data.entries?.map((entry) => {
			const place = entry.content?.gedcomx?.places?.[0];
			return {
				id: place?.id || entry.id,
				title: entry.title,
				fullyQualifiedName: entry.title,
				names: place?.names,
				standardized: place?.jurisdiction
					? {
							id: place.jurisdiction.id,
							fullyQualifiedName: place.jurisdiction.name,
						}
					: undefined,
				jurisdiction: place?.jurisdiction,
				temporalDescription: place?.temporalDescription,
			};
		}) || []
	);
}

/**
 * Get a specific place by its ID
 *
 * @param sdk - FamilySearch SDK instance
 * @param id - The FamilySearch place ID
 * @returns Promise with place details
 */
export async function getPlaceById(
	sdk: FamilySearchSDK,
	id: string
): Promise<PlaceDescription | null> {
	const response = await sdk.get<PlaceDetailsResponse>(
		`/platform/places/${id}`
	);
	return response.data?.places?.[0] || null;
}

/**
 * Get child places of a specific place
 *
 * @param sdk - FamilySearch SDK instance
 * @param id - The parent place ID
 * @param options - Optional parameters
 * @returns Promise with child places
 */
export async function getPlaceChildren(
	sdk: FamilySearchSDK,
	id: string,
	options?: {
		count?: number;
		start?: number;
	}
): Promise<PlaceSearchResult[]> {
	const params = new URLSearchParams({
		...(options?.count && { count: options.count.toString() }),
		...(options?.start && { start: options.start.toString() }),
	});

	const queryString = params.toString();
	const url = `/platform/places/${id}/children${queryString ? `?${queryString}` : ""}`;

	const response = await sdk.get<PlaceSearchResponse>(url);
	const data = response.data || {};

	// Transform the response
	return (
		data.entries?.map((entry) => {
			const place = entry.content?.gedcomx?.places?.[0];
			return {
				id: place?.id || entry.id,
				title: entry.title,
				fullyQualifiedName: entry.title,
				names: place?.names,
				jurisdiction: place?.jurisdiction,
			};
		}) || []
	);
}

/**
 * Get detailed information about a place including standardized names and aliases
 *
 * @param sdk - FamilySearch SDK instance
 * @param id - The FamilySearch place ID
 * @returns Promise with detailed place information
 */
export async function getPlaceDetails(
	sdk: FamilySearchSDK,
	id: string
): Promise<{
	id: string;
	name: string;
	standardizedName?: string;
	aliases: string[];
	latitude?: number;
	longitude?: number;
	jurisdiction?: string;
} | null> {
	const place = await getPlaceById(sdk, id);

	if (!place) {
		return null;
	}

	// Extract primary name (first name entry or English name)
	const primaryName =
		place.names?.find((n) => n.lang === "en")?.value ||
		place.names?.[0]?.value ||
		"";

	// Extract all alternative names as aliases
	const aliases =
		place.names
			?.filter((n) => n.value !== primaryName)
			.map((n) => n.value || "")
			.filter(Boolean) || [];

	return {
		id: place.id || id,
		name: primaryName,
		standardizedName: place.jurisdiction?.name,
		aliases,
		latitude: place.latitude,
		longitude: place.longitude,
		jurisdiction: place.jurisdiction?.name,
	};
}
