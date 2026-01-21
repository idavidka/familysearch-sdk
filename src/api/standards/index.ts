/**
 * FamilySearch Standards API
 *
 * Exports all standards-related API functions:
 * - Places (search and details)
 * - Dates (normalization)
 * - Names (script detection and segmentation)
 * - Vocabularies (controlled vocabularies)
 */

// Places API
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
	PlacesAPI,
} from "./places";

// Dates API
export { normalizeDate, DatesAPI } from "./dates";

// Names API
export { readNameScript, readNameSegments, NamesAPI } from "./names";

// Vocabularies API
export {
	readVocabularies,
	readVocabularyConcepts,
	readVocabularyConcept,
	VocabulariesAPI,
} from "./vocabularies";
