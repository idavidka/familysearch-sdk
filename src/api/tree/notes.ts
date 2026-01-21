/**
 * FamilySearch Notes API
 *
 * Handles notes (comments) on persons and relationships.
 *
 * @see https://developers.familysearch.org/main/reference/readpersonnotes
 */

import type { FamilySearchSDK } from "../../client";
import type {
	Note,
	NoteInput,
	NoteResponse,
	PersonNotesResponse,
} from "../../types";

/**
 * Get all notes for a person
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
			`[FamilySearch SDK] Failed to get notes for person ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Get a specific note for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param noteId - Note ID
 * @returns Note or null
 */
export async function getPersonNote(
	sdk: FamilySearchSDK,
	personId: string,
	noteId: string
): Promise<Note | null> {
	try {
		const response = await sdk.get<NoteResponse>(
			`/platform/tree/persons/${personId}/notes/${noteId}`
		);
		return response.data?.notes?.[0] || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get note ${noteId} for person ${personId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a note for a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param note - Note input data
 * @returns Created note response
 *
 * @example
 * ```typescript
 * const note = await createPersonNote(sdk, 'KWQS-BBQ', {
 *   subject: 'Research Notes',
 *   text: 'Found birth certificate in county archives.'
 * });
 * ```
 */
export async function createPersonNote(
	sdk: FamilySearchSDK,
	personId: string,
	note: NoteInput,
	reason?: string
): Promise<NoteResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const body = {
			persons: [
				{
					id: personId,
					notes: [
						{
							subject: note.subject,
							text: note.text,
							attribution: note.attribution,
						},
					],
				},
			],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/persons/${personId}/notes`,
			body,
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create note for person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Update a person note
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param noteId - Note ID
 * @param note - Updated note data
 * @returns Updated note response
 */
export async function updatePersonNote(
	sdk: FamilySearchSDK,
	personId: string,
	noteId: string,
	note: NoteInput,
	reason?: string
): Promise<NoteResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const body = {
			persons: [
				{
					id: personId,
					notes: [
						{
							id: noteId,
							subject: note.subject,
							text: note.text,
							attribution: note.attribution,
						},
					],
				},
			],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/persons/${personId}/notes/${noteId}`,
			body,
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update note ${noteId} for person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a person note
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param noteId - Note ID
 * @returns Delete confirmation
 */
export async function deletePersonNote(
	sdk: FamilySearchSDK,
	personId: string,
	noteId: string,
	reason?: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<void>(
			`/platform/tree/persons/${personId}/notes/${noteId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete note ${noteId} for person ${personId}:`,
			error
		);
		throw error;
	}
}

// ====================================
// Couple Relationship Notes
// ====================================

/**
 * Get all notes for a couple relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @returns Couple relationship notes or null
 */
export async function getCoupleRelationshipNotes(
	sdk: FamilySearchSDK,
	relationshipId: string
): Promise<PersonNotesResponse | null> {
	try {
		const response = await sdk.get<PersonNotesResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/notes`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get notes for couple relationship ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Get a specific note for a couple relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param noteId - Note ID
 * @returns Note or null
 */
export async function getCoupleRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	noteId: string
): Promise<Note | null> {
	try {
		const response = await sdk.get<NoteResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/notes/${noteId}`
		);
		return response.data?.notes?.[0] || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get note ${noteId} for couple relationship ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a note for a couple relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param note - Note input data
 * @returns Created note response
 */
export async function createCoupleRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	note: NoteInput,
	reason?: string
): Promise<NoteResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const body = {
			relationships: [
				{
					id: relationshipId,
					notes: [
						{
							subject: note.subject,
							text: note.text,
							attribution: note.attribution,
						},
					],
				},
			],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/notes`,
			body,
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create note for couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Update a couple relationship note
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param noteId - Note ID
 * @param note - Updated note data
 * @returns Updated note response
 */
export async function updateCoupleRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	noteId: string,
	note: NoteInput,
	reason?: string
): Promise<NoteResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const body = {
			relationships: [
				{
					id: relationshipId,
					notes: [
						{
							id: noteId,
							subject: note.subject,
							text: note.text,
							attribution: note.attribution,
						},
					],
				},
			],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/notes/${noteId}`,
			body,
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update note ${noteId} for couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a couple relationship note
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param noteId - Note ID
 * @returns Delete confirmation
 */
export async function deleteCoupleRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	noteId: string,
	reason?: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<void>(
			`/platform/tree/couple-relationships/${relationshipId}/notes/${noteId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete note ${noteId} for couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

// ====================================
// Child and Parents Relationship Notes
// ====================================

/**
 * Get all notes for a child-and-parents relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @returns Relationship notes or null
 */
export async function getChildAndParentsRelationshipNotes(
	sdk: FamilySearchSDK,
	relationshipId: string
): Promise<PersonNotesResponse | null> {
	try {
		const response = await sdk.get<PersonNotesResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/notes`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get notes for child-and-parents relationship ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Get a specific note for a child-and-parents relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param noteId - Note ID
 * @returns Note or null
 */
export async function getChildAndParentsRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	noteId: string
): Promise<Note | null> {
	try {
		const response = await sdk.get<NoteResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/notes/${noteId}`
		);
		return response.data?.notes?.[0] || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get note ${noteId} for child-and-parents relationship ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a note for a child-and-parents relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param note - Note input data
 * @returns Created note response
 */
export async function createChildAndParentsRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	note: NoteInput,
	reason?: string
): Promise<NoteResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const body = {
			childAndParentsRelationships: [
				{
					id: relationshipId,
					notes: [
						{
							subject: note.subject,
							text: note.text,
							attribution: note.attribution,
						},
					],
				},
			],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/notes`,
			body,
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create note for child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Update a child-and-parents relationship note
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param noteId - Note ID
 * @param note - Updated note data
 * @returns Updated note response
 */
export async function updateChildAndParentsRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	noteId: string,
	note: NoteInput,
	reason?: string
): Promise<NoteResponse | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const body = {
			childAndParentsRelationships: [
				{
					id: relationshipId,
					notes: [
						{
							id: noteId,
							subject: note.subject,
							text: note.text,
							attribution: note.attribution,
						},
					],
				},
			],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/notes/${noteId}`,
			body,
			{ headers }
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update note ${noteId} for child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a child-and-parents relationship note
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param noteId - Note ID
 * @returns Delete confirmation
 */
export async function deleteChildAndParentsRelationshipNote(
	sdk: FamilySearchSDK,
	relationshipId: string,
	noteId: string,
	reason?: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<void>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/notes/${noteId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete note ${noteId} for child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}
