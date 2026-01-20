/**
 * FamilySearch Tree API
 * 
 * Exports all tree-related API functions:
 * - Persons (CRUD operations)
 * - Relationships (couple and child-parent, change history, order management)
 * - Pedigrees (ancestry and descendancy)
 * - Search (person search)
 * - Matches (record matches and hints)
 * - Sources (source descriptions)
 * - Notes (CRUD on persons/relationships)
 * - Source Attachments (attach/detach sources)
 * - Person Merges (merge analysis and execution)
 * - Preferred Relationships (parent/spouse preferences)
 * - Conclusions (delete facts/names/gender)
 */

// Persons API
export {
	getPerson,
	getPersonWithDetails,
	createPerson,
	updatePerson,
	deletePerson,
	restorePerson,
	getPersonNotes,
	getPersonMemories,
	getPersonSources,
	getPersonDiscussions,
	getPersonPortraits,
	getPersonChangeHistory,
	getPersonFamilies,
	getPersonParents,
	getPersonSpouses,
} from "./persons";

// Relationships API
export {
	getCoupleRelationship,
	createCoupleRelationship,
	updateCoupleRelationship,
	deleteCoupleRelationship,
	getChildAndParentsRelationship,
	createChildAndParentsRelationship,
	updateChildAndParentsRelationship,
	deleteChildAndParentsRelationship,
	getCoupleRelationshipChangeHistory,
	getChildAndParentsRelationshipChangeHistory,
	restoreChange,
	setParentOrder,
	setSpouseOrder,
} from "./relationships";

// Pedigrees API
export {
	getAncestry,
	getDescendancy,
} from "./pedigrees";

// Search API
export {
	searchPersons,
} from "./search";

// Matches API
export {
	getPersonMatches,
	getPersonNonMatches,
	updateMatchResolution,
	getNotAMatchDeclarations,
	createNotAMatchDeclaration,
	deleteNotAMatchDeclaration,
	deleteAllNotAMatchDeclarations,
} from "./matches";

// Sources API
export {
	getSourceDescriptions,
	getSourceDescription,
} from "./sources";

// Notes API
export {
	getPersonNote,
	createPersonNote,
	updatePersonNote,
	deletePersonNote,
	getCoupleRelationshipNotes,
	getCoupleRelationshipNote,
	createCoupleRelationshipNote,
	updateCoupleRelationshipNote,
	deleteCoupleRelationshipNote,
	getChildAndParentsRelationshipNotes,
	getChildAndParentsRelationshipNote,
	createChildAndParentsRelationshipNote,
	updateChildAndParentsRelationshipNote,
	deleteChildAndParentsRelationshipNote,
} from "./notes";

// Source Attachments API
export {
	attachSourceToPerson,
	detachSourceFromPerson,
	attachSourceToCoupleRelationship,
	detachSourceFromCoupleRelationship,
	attachSourceToChildAndParentsRelationship,
	detachSourceFromChildAndParentsRelationship,
} from "./source-attachments";

// Person Merges API
export {
	getPersonMergeAnalysis,
	canMergePersons,
	mergePerson,
} from "./merges";

// Preferred Relationships API
export {
	getPreferredParentRelationship,
	setPreferredParentRelationship,
	deletePreferredParentRelationship,
	getPreferredSpouseRelationship,
	setPreferredSpouseRelationship,
	deletePreferredSpouseRelationship,
} from "./preferences";

// Conclusions API
export {
	deletePersonConclusion,
	deleteCoupleRelationshipConclusion,
	deleteChildAndParentsRelationshipConclusion,
} from "./conclusions";
