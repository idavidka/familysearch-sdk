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
	readPerson,
	readPersonWithDetails,
	createPerson,
	updatePerson,
	deletePerson,
	restorePerson,
	readPersonNotes,
	readPersonMemories,
	readPersonSources,
	readPersonDiscussions,
	readPersonPortraits,
	readPersonChangeHistory,
	readPersonFamilies,
	readPersonParents,
	readPersonChildren,
	readPersonSpouses,
	updatePersonPortraits,
	deletePersonPortrait,
	deletePersonDiscussionReference,
	deletePersonMemoriesPersonaReference,
	deletePersonSourceReference,
	deleteTreePersonReference,
	createPersonMemory,
} from "./persons";

// Relationships API
export {
	readCoupleRelationship,
	createCoupleRelationship,
	updateCoupleRelationship,
	deleteCoupleRelationship,
	readChildAndParentsRelationship,
	createChildAndParentsRelationship,
	updateChildAndParentsRelationship,
	deleteChildAndParentsRelationship,
	readCoupleRelationshipChangeHistory,
	readChildAndParentsRelationshipChangeHistory,
	restoreChange,
	restoreChildAndParentsRelationship,
	restoreCoupleRelationship,
	setParentOrder,
	setSpouseOrder,
	readCoupleRelationshipSourceReferences,
	readCoupleRelationshipSources,
	readChildAndParentsRelationshipSourceReferences,
	readChildAndParentsRelationshipSources,
	createCoupleRelationshipSourceReference,
	createChildAndParentsRelationshipSourceReference,
	deleteCoupleRelationshipSourceReference,
	deleteChildAndParentsRelationshipSourceReference,
	deleteChildAndParentsRelationshipParent,
	readChildAndParentRelationshipNote,
} from "./relationships";

// Pedigrees API
export { readAncestry, readDescendancy } from "./pedigrees";

// Search API
export { searchPersons } from "./search";

// Matches API
export {
	readPersonMatches,
	readPersonNonMatches,
	updateMatchResolution,
	readNotAMatchDeclarations,
	createNotAMatchDeclaration,
	deleteNotAMatchDeclaration,
	deleteAllNotAMatchDeclarations,
	readPersonNotAMatches,
	updatePersonNotAMatches,
	deletePersonNotAMatches,
	deletePersonNotAMatch,
	readTreeMatches,
	performPersonMatchesByExample,
} from "./matches";

// Sources API
export {
	readSourceDescriptions,
	readSourceDescription,
	createSourceDescription,
	updateSourceDescription,
	deleteSourceDescription,
	readSourceDescriptionChanges,
} from "./sources";

// Notes API
export {
	readPersonNote,
	createPersonNote,
	updatePersonNote,
	deletePersonNote,
	readCoupleRelationshipNotes,
	readCoupleRelationshipNote,
	createCoupleRelationshipNote,
	updateCoupleRelationshipNote,
	deleteCoupleRelationshipNote,
	readChildAndParentsRelationshipNotes,
	readChildAndParentsRelationshipNote,
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
	readPersonMergeAnalysis,
	allowPersonMerge,
	canMergePersons,
	mergePerson,
} from "./merges";

// Preferred Relationships API
export {
	readPreferredParentRelationship,
	setPreferredParentRelationship,
	deletePreferredParentRelationship,
	readPreferredSpouseRelationship,
	setPreferredSpouseRelationship,
	deletePreferredSpouseRelationship,
} from "./preferences";

// Conclusions API
export {
	deletePersonConclusion,
	deleteCoupleRelationshipConclusion,
	deleteChildAndParentsRelationshipConclusion,
} from "./conclusions";

// Source Box API (Collections and Folders)
export {
	readUserSourceFolders,
	readSourceFolders,
	createSourceFolder,
	readUserDefinedCollection,
	updateUserDefinedCollection,
	deleteUserDefinedCollection,
	readCollectionSourceDescriptions,
	readUserSourceDescriptions,
	addSourcesToCollection,
	removeSourcesFromCollection,
} from "./source-box";

// Agent API
export { readAgent } from "./agent";

// Pending Modifications API
export { readPendingModifications } from "./pending-modifications";

// Groups (Community Trees) API
export {
	readGroup,
	readGroups,
	createGroup,
	updateGroup,
	deleteGroup,
} from "./groups";

// Tree Changes API
export { readTreeChanges } from "./tree-changes";

// Trees API
export { readTree, deleteTree, createTree, readResearchTreePersons } from "./trees";
