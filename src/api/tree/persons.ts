/**
 * FamilySearch Persons API
 * 
 * Handles CRUD operations for persons in the FamilySearch Family Tree.
 * 
 * @see https://developers.familysearch.org/main/reference/readperson
 */

import type { FamilySearchSDK } from "../../client";
import type {
	CreatePersonResponse,
	DeletePersonResponse,
	FamilySearchPerson,
	PersonChangeHistoryResponse,
	PersonDiscussionsResponse,
	PersonInput,
	PersonMemoriesResponse,
	PersonNotesResponse,
	PersonPortraitsResponse,
	PersonSourcesResponse,
	PersonWithRelationships,
	UpdatePersonResponse,
} from "../../types";

/**
 * Get person by ID
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person data or null
 */
export async function getPerson(
	sdk: FamilySearchSDK,
	personId: string
): Promise<FamilySearchPerson | null> {
	try {
		const response = await sdk.get<{ persons: FamilySearchPerson[] }>(
			`/platform/tree/persons/${personId}`
		);

		const person = response.data?.persons?.[0];
		return person || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get person ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get person with full details including relationships
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param options - Query options
 * @returns Person with relationships or null
 */
export async function getPersonWithDetails(
	sdk: FamilySearchSDK,
	personId: string,
	options: { sourceDescriptions?: boolean } = {}
): Promise<PersonWithRelationships | null> {
	try {
		const queryParams = options.sourceDescriptions
			? "?sourceDescriptions=true"
			: "";
		const response = await sdk.get(
			`/platform/tree/persons/${personId}${queryParams}`
		);
		return (response.data as PersonWithRelationships) || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get person details ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a new person in the tree
 * 
 * @param sdk - SDK instance
 * @param person - Person data to create
 * @returns Created person data with ID
 * 
 * @example
 * ```typescript
 * const newPerson = await createPerson(sdk, {
 *   names: [{
 *     nameForms: [{
 *       fullText: 'John Smith',
 *       parts: [
 *         { type: 'http://gedcomx.org/Given', value: 'John' },
 *         { type: 'http://gedcomx.org/Surname', value: 'Smith' }
 *       ]
 *     }]
 *   }],
 *   gender: { type: 'http://gedcomx.org/Male' },
 *   facts: [{
 *     type: 'http://gedcomx.org/Birth',
 *     date: { original: '1850' },
 *     place: { original: 'London, England' }
 *   }]
 * });
 * ```
 */
export async function createPerson(
	sdk: FamilySearchSDK,
	person: PersonInput
): Promise<CreatePersonResponse | null> {
	try {
		const response = await sdk.post<CreatePersonResponse>(
			"/platform/tree/persons",
			{ persons: [person] }
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to create person:",
			error
		);
		throw error;
	}
}

/**
 * Update an existing person in the tree
 * 
 * @param sdk - SDK instance
 * @param personId - ID of the person to update
 * @param person - Updated person data
 * @returns Updated person data
 * 
 * @example
 * ```typescript
 * const updated = await updatePerson(sdk, 'KWQS-BBQ', {
 *   facts: [{
 *     type: 'http://gedcomx.org/Death',
 *     date: { original: '1920' },
 *     place: { original: 'New York, USA' }
 *   }]
 * });
 * ```
 */
export async function updatePerson(
	sdk: FamilySearchSDK,
	personId: string,
	person: PersonInput
): Promise<UpdatePersonResponse | null> {
	try {
		const response = await sdk.post<UpdatePersonResponse>(
			`/platform/tree/persons/${personId}`,
			{ persons: [{ ...person, id: personId }] }
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a person from the tree
 * 
 * **Warning:** This is a destructive operation. The person will be marked as deleted.
 * 
 * @param sdk - SDK instance
 * @param personId - ID of the person to delete
 * @param reason - Optional reason for deletion
 * @returns Delete confirmation
 * 
 * @example
 * ```typescript
 * await deletePerson(sdk, 'KWQS-BBQ', 'Duplicate entry');
 * ```
 */
export async function deletePerson(
	sdk: FamilySearchSDK,
	personId: string,
	reason?: string
): Promise<DeletePersonResponse | null> {
	try {
		const url = reason
			? `/platform/tree/persons/${personId}?reason=${encodeURIComponent(reason)}`
			: `/platform/tree/persons/${personId}`;

		const response = await sdk.delete<DeletePersonResponse>(url);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Restore a deleted person
 * 
 * @param sdk - SDK instance
 * @param personId - ID of the person to restore
 * @returns Restored person data
 * 
 * @example
 * ```typescript
 * const restored = await restorePerson(sdk, 'KWQS-BBQ');
 * ```
 */
export async function restorePerson(
	sdk: FamilySearchSDK,
	personId: string
): Promise<UpdatePersonResponse | null> {
	try {
		const response = await sdk.post<UpdatePersonResponse>(
			`/platform/tree/persons/${personId}/restore`,
			{}
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to restore person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get notes for a person
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person notes or null
 */
export async function getPersonNotes(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonNotesResponse | null> {
	try {
		const response = await sdk.get<PersonNotesResponse>(
			`/platform/tree/persons/${personId}/notes`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get notes for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get memories for a person
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person memories or null
 */
export async function getPersonMemories(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonMemoriesResponse | null> {
	try {
		const response = await sdk.get<PersonMemoriesResponse>(
			`/platform/tree/persons/${personId}/memories`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get memories for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get sources for a person
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person sources or null
 */
export async function getPersonSources(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonSourcesResponse | null> {
	try {
		const response = await sdk.get<PersonSourcesResponse>(
			`/platform/tree/persons/${personId}/sources`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get sources for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get discussions for a person
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person discussions or null
 */
export async function getPersonDiscussions(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonDiscussionsResponse | null> {
	try {
		const response = await sdk.get<PersonDiscussionsResponse>(
			`/platform/tree/persons/${personId}/discussion-references`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get discussions for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get portraits (photos) for a person
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person portraits or null
 */
export async function getPersonPortraits(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonPortraitsResponse | null> {
	try {
		const response = await sdk.get<PersonPortraitsResponse>(
			`/platform/tree/persons/${personId}/portraits`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get portraits for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get change history for a person
 * 
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person change history or null
 */
export async function getPersonChangeHistory(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonChangeHistoryResponse | null> {
	try {
		const response = await sdk.get<PersonChangeHistoryResponse>(
			`/platform/tree/persons/${personId}/changes`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get change history for ${personId}:`,
			error
		);
		return null;
	}
}
