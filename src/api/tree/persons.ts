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
	PersonFamiliesResponse,
	PersonParentsResponse,
	PersonChildrenResponse,
	PersonSpousesResponse,
	PersonWithRelationships,
	UpdatePersonResponse,
	UpdatePersonPortraitsInput,
	UpdatePersonPortraitsResponse,
	DeleteResponse,
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
		sdk.logger.error(
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
		sdk.logger.error(
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
	person: PersonInput,
	reason?: string
): Promise<CreatePersonResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.post<CreatePersonResponse>(
			"/platform/tree/persons",
			{ persons: [person] },
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error("[FamilySearch SDK] Failed to create person:", error);
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
	person: PersonInput,
	reason?: string
): Promise<UpdatePersonResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.post<UpdatePersonResponse>(
			`/platform/tree/persons/${personId}`,
			{ persons: [{ ...person, id: personId }] },
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
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
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<DeletePersonResponse>(
			`/platform/tree/persons/${personId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get change history for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get person families (all relationships person belongs to)
 *
 * Returns all family relationships for a person, including:
 * - Child-and-parents relationships (families where person is a child)
 * - Couple relationships (families where person is a spouse/partner)
 * - Related persons (parents, spouses, children)
 *
 * This is a convenience endpoint that aggregates relationship data.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Person families with relationships and related persons, or null
 *
 * @example
 * ```typescript
 * const families = await getPersonFamilies(sdk, "PPPP-PPP");
 * if (families) {
 *   console.log("Child-parent families:", families.childAndParentsRelationships?.length);
 *   console.log("Couple families:", families.relationships?.length);
 *   console.log("Related persons:", families.persons?.length);
 * }
 * ```
 */
export async function getPersonFamilies(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonFamiliesResponse | null> {
	try {
		const response = await sdk.get<PersonFamiliesResponse>(
			`/platform/tree/persons/${personId}/families`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get families for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get person parents
 *
 * Returns the parents of a person through child-and-parents relationships.
 * This is a convenience endpoint that provides direct access to parent data
 * without manually traversing relationships.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Parents and their relationships, or null
 *
 * @example
 * ```typescript
 * const parents = await getPersonParents(sdk, "PPPP-PPP");
 * if (parents?.persons) {
 *   parents.persons.forEach(parent => {
 *     console.log("Parent:", parent.display?.name);
 *   });
 * }
 * ```
 */
export async function getPersonParents(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonParentsResponse | null> {
	try {
		const response = await sdk.get<PersonParentsResponse>(
			`/platform/tree/persons/${personId}/parents`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get parents for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get person spouses
 *
 * Returns all spouses/partners of a person through couple relationships.
 * This is a convenience endpoint that provides direct access to spouse data
 * without manually traversing relationships.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Spouses and their relationships, or null
 *
 * @example
 * ```typescript
 * const spouses = await getPersonSpouses(sdk, "PPPP-PPP");
 * if (spouses?.persons) {
 *   spouses.persons.forEach(spouse => {
 *     console.log("Spouse:", spouse.display?.name);
 *   });
 * }
 * ```
 */
export async function getPersonSpouses(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonSpousesResponse | null> {
	try {
		const response = await sdk.get<PersonSpousesResponse>(
			`/platform/tree/persons/${personId}/spouses`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get spouses for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Update person portraits (set preferred portrait)
 *
 * Sets which memory/photo should be used as the person's preferred portrait.
 * The portrait appears on the person's profile and in family tree views.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param memoryId - Memory ID to set as preferred portrait
 * @returns Update response
 * @throws Error if update fails
 *
 * @example
 * ```typescript
 * // Set a memory as the person's preferred portrait
 * await updatePersonPortraits(sdk, "PPPP-PPP", "MMMM-MMM");
 * console.log("Preferred portrait updated");
 * ```
 */
export async function updatePersonPortraits(
	sdk: FamilySearchSDK,
	personId: string,
	memoryId: string
): Promise<UpdatePersonPortraitsResponse> {
	try {
		const input: UpdatePersonPortraitsInput = {
			persons: [
				{
					id: personId,
					media: [
						{
							id: memoryId,
							resource: `#${memoryId}`,
						},
					],
				},
			],
		};

		const response = await sdk.put<UpdatePersonPortraitsResponse>(
			`/platform/tree/persons/${personId}/portraits`,
			input
		);
		return response.data || { persons: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update portraits for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get person children
 *
 * Retrieves a list of all children for a person.
 * Returns persons with their child relationships.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @returns Children with relationships
 * @throws Error if request fails
 *
 * @example
 * ```typescript
 * const children = await getPersonChildren(sdk, "PPPP-PPP");
 * console.log("Children:", children);
 * ```
 */
export async function getPersonChildren(
	sdk: FamilySearchSDK,
	personId: string
): Promise<PersonChildrenResponse | null> {
	try {
		const response = await sdk.get<PersonChildrenResponse>(
			`/platform/tree/persons/${personId}/children`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get children for ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Delete person portrait
 *
 * Removes a specific portrait from a person's profile.
 * This doesn't delete the memory itself, only removes it as a portrait.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param portraitId - Portrait/Memory ID to remove
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deletePersonPortrait(sdk, "PPPP-PPP", "MMMM-MMM");
 * console.log("Portrait removed");
 * ```
 */
export async function deletePersonPortrait(
	sdk: FamilySearchSDK,
	personId: string,
	portraitId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/portraits/${portraitId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete portrait ${portraitId} for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete person discussion reference
 *
 * Removes a reference to a discussion from a person's record.
 * This doesn't delete the discussion itself, only the reference to it.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param discussionReferenceId - Discussion reference ID to remove
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deletePersonDiscussionReference(sdk, "PPPP-PPP", "DREF-123");
 * console.log("Discussion reference removed");
 * ```
 */
export async function deletePersonDiscussionReference(
	sdk: FamilySearchSDK,
	personId: string,
	discussionReferenceId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/discussion-references/${discussionReferenceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete discussion reference ${discussionReferenceId} for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete person memories persona reference
 *
 * Removes a reference to a memory persona from a person's record.
 * This disconnects the person from a memory but doesn't delete the memory itself.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param memoryReferenceId - Memory reference ID (Evidence Reference ID) to remove
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deletePersonMemoriesPersonaReference(sdk, "PPPP-PPP", "ERID-456");
 * console.log("Memory reference removed");
 * ```
 */
export async function deletePersonMemoriesPersonaReference(
	sdk: FamilySearchSDK,
	personId: string,
	memoryReferenceId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/memory-references/${memoryReferenceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete memory reference ${memoryReferenceId} for ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete person source reference
 *
 * Removes a source reference from a person's record.
 * This detaches the source but doesn't delete the source itself.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param sourceReferenceId - Source reference ID to remove
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deletePersonSourceReference(sdk, "PPPP-PPP", "SRID-789");
 * console.log("Source reference removed");
 * ```
 */
export async function deletePersonSourceReference(
	sdk: FamilySearchSDK,
	personId: string,
	sourceReferenceId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/source-references/${sourceReferenceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete source reference ${sourceReferenceId} for ${personId}:`,
			error
		);
		throw error;
	}
}
