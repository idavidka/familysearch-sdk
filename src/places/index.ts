/**
 * FamilySearch Places Module
 *
 * Re-exports from api/standards/places for backward compatibility
 */

export {
	searchPlaces,
	readPlaceDetails,
	readPlaceChildren,
	readPlaceDescriptions,
	readPlaceDescription,
	readPlaceTypes,
	readPlaceType,
	readPlaceTypeGroups,
	readPlaceTypeGroup,
	searchParentPlaces,
	checkPlaceIsChild,
	readPlaceAttributes,
	readPlaceDescriptionWithRelated,
	readPlaceDescriptionsGroup,
	PlacesAPI,
} from "../api/standards/places";

export {
	extractGazetteerPlaceId,
	familySearchResearchPlaceUrl,
	numericPlaceIdFromRef,
	pickBestPlaceSearchResult,
	type FamilySearchPlacePayload,
} from "./gazetteer-id";

export { resolveGazetteerPlaceId } from "./resolve-gazetteer-id";
