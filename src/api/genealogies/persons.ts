/**
 * FamilySearch Genealogies API - Persons Module
 *
 * Handles person management within research trees (genealogies).
 *
 * @see https://developers.familysearch.org/main/reference/readgenealogiesperson
 */

import type { FamilySearchSDK } from "../../client";
import type {
	GenealogyPersonResponse,
	GenealogyPersonsResponse,
	CreateGenealogyPersonInput,
	UpdateGenealogyPersonInput,
} from "../../types/genealogies";

/**
 * Read a specific person in a genealogy
 *
 * Returns details for a person within a research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param personId - Person identifier
 * @returns Person details or null
 *
 * @example
 * ```typescript
 * const person = await readGenealogyPerson(sdk, 'TREE-123', 'PERSON-456');
 * console.log('Person name:', person?.persons?.[0]?.display?.name);
 * ```
 */
export async function readGenealogyPerson(
	sdk: FamilySearchSDK,
	treeId: string,
	personId: string
): Promise<GenealogyPersonResponse | null> {
	try {
		const response = await sdk.get<GenealogyPersonResponse>(
			`/platform/genealogies/trees/${treeId}/persons/${personId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy person ${personId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Get all persons in a genealogy tree
 *
 * Returns all persons within a research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @returns List of persons or null
 *
 * @example
 * ```typescript
 * const persons = await readGenealogyPersons(sdk, 'TREE-123');
 * console.log('Tree has', persons?.persons?.length, 'persons');
 * ```
 */
export async function readGenealogyPersons(
	sdk: FamilySearchSDK,
	treeId: string
): Promise<GenealogyPersonsResponse | null> {
	try {
		const response = await sdk.get<GenealogyPersonsResponse>(
			`/platform/genealogies/trees/${treeId}/persons`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to read genealogy persons for tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a new person in a genealogy tree
 *
 * Adds a new person to a research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param input - Person creation data
 * @returns Created person or null
 *
 * @example
 * ```typescript
 * const person = await createGenealogyPerson(sdk, 'TREE-123', {
 *   names: [{ givenName: 'John', surname: 'Smith' }],
 *   gender: 'Male'
 * });
 * ```
 */
export async function createGenealogyPerson(
	sdk: FamilySearchSDK,
	treeId: string,
	input: CreateGenealogyPersonInput
): Promise<GenealogyPersonResponse | null> {
	try {
		const response = await sdk.post<GenealogyPersonResponse>(
			`/platform/genealogies/trees/${treeId}/persons`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create genealogy person in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Update an existing person in a genealogy tree
 *
 * Updates details for a person within a research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param personId - Person identifier
 * @param input - Updated person data
 * @returns Updated person or null
 *
 * @example
 * ```typescript
 * const updated = await updateGenealogyPerson(sdk, 'TREE-123', 'PERSON-456', {
 *   names: [{ givenName: 'Jonathan', surname: 'Smith' }]
 * });
 * ```
 */
export async function updateGenealogyPerson(
	sdk: FamilySearchSDK,
	treeId: string,
	personId: string,
	input: UpdateGenealogyPersonInput
): Promise<GenealogyPersonResponse | null> {
	try {
		const response = await sdk.post<GenealogyPersonResponse>(
			`/platform/genealogies/trees/${treeId}/persons/${personId}`,
			input
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update genealogy person ${personId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete a person from a genealogy tree
 *
 * Removes a person from a research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param personId - Person identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * const success = await deleteGenealogyPerson(sdk, 'TREE-123', 'PERSON-456');
 * console.log('Deleted:', success);
 * ```
 */
export async function deleteGenealogyPerson(
	sdk: FamilySearchSDK,
	treeId: string,
	personId: string
): Promise<boolean> {
	try {
		await sdk.delete(
			`/platform/genealogies/trees/${treeId}/persons/${personId}`
		);
		return true;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete genealogy person ${personId} in tree ${treeId}:`,
			error
		);
		return false;
	}
}

/**
 * Restore a deleted person in a genealogy tree
 *
 * Restores a previously deleted person in a research tree.
 *
 * @param sdk - SDK instance
 * @param treeId - Tree identifier
 * @param personId - Person identifier
 * @returns Restored person or null
 *
 * @example
 * ```typescript
 * const restored = await restoreGenealogyPerson(sdk, 'TREE-123', 'PERSON-456');
 * console.log('Restored:', restored?.persons?.[0]?.display?.name);
 * ```
 */
export async function restoreGenealogyPerson(
	sdk: FamilySearchSDK,
	treeId: string,
	personId: string
): Promise<GenealogyPersonResponse | null> {
	try {
		const response = await sdk.post<GenealogyPersonResponse>(
			`/platform/genealogies/trees/${treeId}/persons/${personId}/restore`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to restore genealogy person ${personId} in tree ${treeId}:`,
			error
		);
		return null;
	}
}
