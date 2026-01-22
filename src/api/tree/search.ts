/**
 * FamilySearch Search API
 *
 * Handles person search functionality in the FamilySearch Family Tree.
 *
 * @see https://developers.familysearch.org/main/reference/searchpersons
 */

import type { FamilySearchSDK } from "../../client";
import type {
	PersonSearchResult,
	PersonMatchInput,
	PersonSearchResponse,
	FamilySearchApiResponse,
} from "../../types";

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
 * Search for persons using external GEDCOM data
 *
 * Converts person data to search query parameters and searches FamilySearch.
 * Works with both Tree and Records collections.
 *
 * @param sdk - SDK instance
 * @param person - Person data to search for (name, dates, places, etc.)
 * @param options - Search options (collection, pagination)
 * @returns FamilySearch API response with search results
 *
 * @example
 * ```typescript
 * const results = await searchPersonByData(sdk, {
 *   givenName: 'John',
 *   familyName: 'Smith',
 *   birthDate: '1850',
 *   birthPlace: 'London, England'
 * }, { collection: 'tree', count: 20 });
 * ```
 */
export async function searchPersonByData(
	sdk: FamilySearchSDK,
	person: PersonMatchInput,
	options: {
		start?: number;
		count?: number;
		collection?: "tree" | "records";
	} = {}
): Promise<FamilySearchApiResponse<PersonSearchResponse>> {
	// Build query parameters from person data
	const query: Record<string, string> = {};

	// Add name
	if (person.givenName) {
		query["q.givenName"] = person.givenName;
	}
	if (person.familyName) {
		query["q.surname"] = person.familyName;
	}

	// Add birth info
	if (person.birthDate) {
		// Extract year from date (FamilySearch expects +YYYY format)
		const year = person.birthDate.match(/\d{4}/)?.[0];
		if (year) {
			query["q.birthLikeDate"] = `+${year}`;
		}
	}
	if (person.birthPlace) {
		query["q.birthLikePlace"] = person.birthPlace;
	}

	// Add death info
	if (person.deathDate) {
		const year = person.deathDate.match(/\d{4}/)?.[0];
		if (year) {
			query["q.deathLikeDate"] = `+${year}`;
		}
	}
	if (person.deathPlace) {
		query["q.deathLikePlace"] = person.deathPlace;
	}

	// Add marriage info
	if (person.marriageDate) {
		const year = person.marriageDate.match(/\d{4}/)?.[0];
		if (year) {
			query["q.marriageLikeDate"] = `+${year}`;
		}
	}
	if (person.marriagePlace) {
		query["q.marriageLikePlace"] = person.marriagePlace;
	}

	// Add father info
	if (person.fatherGivenName) {
		query["q.fatherGivenName"] = person.fatherGivenName;
	}
	if (person.fatherFamilyName) {
		query["q.fatherSurname"] = person.fatherFamilyName;
	}

	// Add mother info
	if (person.motherGivenName) {
		query["q.motherGivenName"] = person.motherGivenName;
	}
	if (person.motherFamilyName) {
		query["q.motherSurname"] = person.motherFamilyName;
	}

	// Add spouse info
	if (person.spouseGivenName) {
		query["q.spouseGivenName"] = person.spouseGivenName;
	}
	if (person.spouseFamilyName) {
		query["q.spouseSurname"] = person.spouseFamilyName;
	}

	// Build query parameters
	const params = new URLSearchParams({
		...query,
		...(options.start !== undefined && {
			start: options.start.toString(),
		}),
		...(options.count !== undefined && {
			count: options.count.toString(),
		}),
	});

	// Note: Collection filtering is not supported in the current FamilySearch Search API
	// The search will return results from all available collections
	// We'll need to filter results client-side if needed

	return sdk.get<PersonSearchResponse>(
		`/platform/tree/search?${params.toString()}`
	);
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

	async searchPersonByData(
		person: PersonMatchInput,
		options?: {
			start?: number;
			count?: number;
			collection?: "tree" | "records";
		}
	) {
		return searchPersonByData(this.sdk, person, options);
	}
}
