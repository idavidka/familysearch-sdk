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
	getPlaceDetails,
	getPlaceChildren,
	getPlaceDescriptions,
	getPlaceDescription,
	getPlaceTypes,
	getPlaceType,
	getPlaceTypeGroups,
	getPlaceTypeGroup,
	searchParentPlaces,
	checkPlaceIsChild,
} from "./places";

// Dates API
export {
	normalizeDate,
} from "./dates";

// Names API
export {
	getNameScript,
	getNameSegments,
} from "./names";

// Vocabularies API
export {
	getVocabularies,
	getVocabularyConcepts,
	getVocabularyConcept,
} from "./vocabularies";
