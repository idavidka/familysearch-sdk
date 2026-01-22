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
	readGenealogyTree,
	readGenealogyTrees,
	createGenealogyTree,
	updateGenealogyTree,
	deleteGenealogyTree,
	TreesAPI,
} from "./trees";

// Person operations
export {
	readGenealogyPerson,
	readGenealogyPersons,
	createGenealogyPerson,
	updateGenealogyPerson,
	deleteGenealogyPerson,
	restoreGenealogyPerson,
	GenealogyPersonsAPI,
} from "./persons";

// Relationship operations
export {
	updateGenealogyRelationship,
	deleteGenealogyRelationship,
	GenealogyRelationshipsAPI,
} from "./relationships";

// Source operations
export {
	readGenealogySourceDescription,
	createGenealogySourceDescription,
	updateGenealogySourceDescription,
	deleteGenealogySourceDescription,
	GenealogySourcesAPI,
} from "./sources";

// Other operations
export {
	deleteGenealogyConclusion,
	readGenealogyBulkMatch,
	readGenealogyPersonMatches,
	readGenealogyNote,
	GenealogyOtherAPI,
} from "./other";
