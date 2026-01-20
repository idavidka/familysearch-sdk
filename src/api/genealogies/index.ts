/**
 * FamilySearch Genealogies API
 * 
 * Provides access to research trees (genealogies) - separate from the main FamilySearch Family Tree.
 * Genealogies allow users to create hypothesis trees for research without affecting the main tree.
 * 
 * @see https://developers.familysearch.org/main/reference/genealogies
 */

// Tree operations
export {
	getGenealogyTree,
	getGenealogyTrees,
	createGenealogyTree,
	updateGenealogyTree,
	deleteGenealogyTree,
} from "./trees";

// Person operations
export {
	getGenealogyPerson,
	getGenealogyPersons,
	createGenealogyPerson,
	updateGenealogyPerson,
	deleteGenealogyPerson,
	restoreGenealogyPerson,
} from "./persons";

// Relationship operations
export {
	updateGenealogyRelationship,
	deleteGenealogyRelationship,
} from "./relationships";

// Source operations
export {
	getGenealogySourceDescription,
	createGenealogySourceDescription,
	updateGenealogySourceDescription,
	deleteGenealogySourceDescription,
} from "./sources";

// Other operations
export {
	deleteGenealogyConclusion,
	getGenealogyBulkMatch,
	getGenealogyPersonMatches,
	getGenealogyNote,
} from "./other";
