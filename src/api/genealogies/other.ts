/**
 * FamilySearch Genealogies API - Other Operations Module
 *
 * Handles miscellaneous genealogy operations (conclusions, matches, notes).
 *
 * @see https://developers.familysearch.org/main/reference/deletegenealogiesconclusion
 */

import type { FamilySearchSDK } from "../../client";
import type {
	GenealogyBulkMatchResponse,
	GenealogyPersonMatchesResponse,
	GenealogyNoteResponse,
} from "../../types/genealogies";

/**
 * Delete a conclusion from a genealogy
 *
 * Removes a conclusion (fact, name, etc.) from a person or relationship.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param conclusionId - Conclusion identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * const success = await deleteGenealogyConclusion(sdk, 'TREE-123', 'CONC-456');
 * console.log('Deleted:', success);
 * ```
 */
export async function deleteGenealogyConclusion(
	sdk: FamilySearchSDK,
	treeId: string,
	conclusionId: string
): Promise<boolean> {
	try {
		await sdk.delete(
			`/platform/genealogies/trees/${treeId}/conclusions/${conclusionId}`
		);
		return true;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete genealogy conclusion ${conclusionId} in tree ${treeId}:`,
			error
		);
		return false;
	}
}

/**
 * Read bulk match results for a genealogy
 *
 * Returns bulk matching results comparing genealogy persons to the main tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @returns Bulk match results or null
 *
 * @example
 * ```typescript
 * const matches = await readGenealogyBulkMatch(sdk, 'TREE-123');
 * console.log('Found', matches?.entries?.length, 'potential matches');
 * ```
 */
export async function readGenealogyBulkMatch(
	sdk: FamilySearchSDK,
	treeId: string
): Promise<GenealogyBulkMatchResponse | null> {
	try {
		const response = await sdk.get<GenealogyBulkMatchResponse>(
			`/platform/genealogies/trees/${treeId}/bulk-match`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy bulk match for tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Read person matches for a genealogy person
 *
 * Returns potential matches for a specific person in the genealogy.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param personId - Person identifier
 * @returns Person match results or null
 *
 * @example
 * ```typescript
 * const matches = await readGenealogyPersonMatches(sdk, 'TREE-123', 'PERSON-456');
 * console.log('Found', matches?.entries?.length, 'matches for person');
 * ```
 */
export async function readGenealogyPersonMatches(
	sdk: FamilySearchSDK,
	treeId: string,
	personId: string
): Promise<GenealogyPersonMatchesResponse | null> {
	try {
		const response = await sdk.get<GenealogyPersonMatchesResponse>(
			`/platform/genealogies/trees/${treeId}/persons/${personId}/matches`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy person matches for ${personId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Read a note in a genealogy
 *
 * Returns a specific note from the genealogy.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param noteId - Note identifier
 * @returns Note details or null
 *
 * @example
 * ```typescript
 * const note = await readGenealogyNote(sdk, 'TREE-123', 'NOTE-456');
 * console.log('Note text:', note?.notes?.[0]?.text);
 * ```
 */
export async function readGenealogyNote(
	sdk: FamilySearchSDK,
	treeId: string,
	noteId: string
): Promise<GenealogyNoteResponse | null> {
	try {
		const response = await sdk.get<GenealogyNoteResponse>(
			`/platform/genealogies/trees/${treeId}/notes/${noteId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy note ${noteId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * GenealogyOtherAPI class provides convenient methods for miscellaneous genealogy operations.
 */
export class GenealogyOtherAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async deleteConclusion(treeId: string, conclusionId: string) {
		return deleteGenealogyConclusion(this.sdk, treeId, conclusionId);
	}

	async readBulkMatch(treeId: string) {
		return readGenealogyBulkMatch(this.sdk, treeId);
	}

	async readPersonMatches(treeId: string, personId: string) {
		return readGenealogyPersonMatches(this.sdk, treeId, personId);
	}

	async readNote(treeId: string, noteId: string) {
		return readGenealogyNote(this.sdk, treeId, noteId);
	}
}
