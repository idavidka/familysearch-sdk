/**
 * FamilySearch Places search returns Place Descriptions.
 * `place.id` is a Description ID. The Places web UI `focusedId` is a
 * gazetteer Place ID (different namespace). The Place ID lives on
 * `identifiers["http://gedcomx.org/Persistent"]` or `place.place`.
 *
 * @see https://developers.familysearch.org/main/docs/places
 */

export type FamilySearchPlacePayload = {
	id?: string;
	identifiers?: Record<string, string[]>;
	place?: {
		original?: string;
		description?: string;
	};
	display?: {
		name?: string;
		fullName?: string;
		type?: string;
	};
	names?: Array<{ value?: string }>;
	type?: string;
	latitude?: number;
	longitude?: number;
};

/** Numeric ID from a Place authority URL, never from /places/description/. */
export const numericPlaceIdFromRef = (ref?: string): string | undefined => {
	if (!ref) {
		return undefined;
	}
	if (ref.includes("/places/description/") || ref.includes("ark:/")) {
		return undefined;
	}
	const match = ref.match(/\/places\/(\d+)/);
	return match?.[1];
};

export const extractGazetteerPlaceId = (
	place: FamilySearchPlacePayload
): string | undefined => {
	const persistent =
		place.identifiers?.["http://gedcomx.org/Persistent"]?.[0];
	const fromPersistent = numericPlaceIdFromRef(persistent);
	if (fromPersistent) {
		return fromPersistent;
	}
	return numericPlaceIdFromRef(place.place?.description);
};

export const familySearchResearchPlaceUrl = (
	placeId: string,
	baseUrl = "https://www.familysearch.org"
): string => `${baseUrl}/en/research/places/?focusedId=${placeId}`;

export const pickBestPlaceSearchResult = <
	T extends { name?: string; fullName?: string; title?: string },
>(
	results: T[],
	query: string
): T | undefined => {
	if (results.length === 0) {
		return undefined;
	}
	const town = query.split(",")[0]?.trim().toLowerCase();
	if (!town) {
		return results[0];
	}
	const label = (result: T) =>
		(
			result.fullName ||
			result.name ||
			result.title ||
			""
		).toLowerCase();
	return (
		results.find(
			(result) =>
				label(result) === town || label(result).startsWith(`${town},`)
		) ||
		results.find((result) => label(result).includes(town)) ||
		results[0]
	);
};
