/**
 * FamilySearch Search API
 *
 * Handles person search functionality in the FamilySearch Family Tree.
 *
 * @see https://developers.familysearch.org/main/reference/searchpersons
 */

import type { FamilySearchSDK } from "../../client";
import type { PersonSearchResult } from "../../types";

/**
 * Search for persons in FamilySearch
 *
 * @param sdk - SDK instance
 * @param query - Search query parameters
 * @returns Search results or null
 *
 * @example
 * ```typescript
 * const results = await searchPersons(sdk, {
 *   givenName: 'John',
 *   surname: 'Smith',
 *   birthYear: '1850',
 *   birthPlace: 'England',
 *   start: 0,
 *   count: 20
 * });
 * ```
 */
export async function searchPersons(
	sdk: FamilySearchSDK,
	query: {
		givenName?: string;
		surname?: string;
		birthYear?: string;
		birthPlace?: string;
		deathYear?: string;
		deathPlace?: string;
		gender?: "male" | "female";
		spouseName?: string;
		fatherName?: string;
		motherName?: string;
		start?: number;
		count?: number;
	}
): Promise<PersonSearchResult | null> {
	try {
		const params = new URLSearchParams();

		if (query.givenName) params.append("givenName", query.givenName);
		if (query.surname) params.append("surname", query.surname);
		if (query.birthYear) params.append("birthYear", query.birthYear);
		if (query.birthPlace) params.append("birthPlace", query.birthPlace);
		if (query.deathYear) params.append("deathYear", query.deathYear);
		if (query.deathPlace) params.append("deathPlace", query.deathPlace);
		if (query.gender) params.append("gender", query.gender);
		if (query.spouseName) params.append("spouseName", query.spouseName);
		if (query.fatherName) params.append("fatherName", query.fatherName);
		if (query.motherName) params.append("motherName", query.motherName);
		if (query.start !== undefined)
			params.append("start", query.start.toString());
		if (query.count !== undefined)
			params.append("count", query.count.toString());

		const response = await sdk.get<PersonSearchResult>(
			`/platform/tree/search?${params.toString()}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error("[FamilySearch SDK] Failed to search persons:", error);
		return null;
	}
}

/**
 * SearchAPI class provides convenient methods for searching persons in the tree.
 */
export class SearchAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async searchPersons(query: {
		givenName?: string;
		surname?: string;
		birthYear?: string;
		birthPlace?: string;
		deathYear?: string;
		deathPlace?: string;
		gender?: "male" | "female";
		spouseName?: string;
		fatherName?: string;
		motherName?: string;
		start?: number;
		count?: number;
	}) {
		return searchPersons(this.sdk, query);
	}
}
