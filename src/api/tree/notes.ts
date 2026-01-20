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
		sdk["logger"].error(
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
		sdk["logger"].error(
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
	note: NoteInput
): Promise<NoteResponse | null> {
	try {
		const body = {
			persons: [{
				id: personId,
				notes: [{
					subject: note.subject,
					text: note.text,
					attribution: note.attribution,
				}],
			}],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/persons/${personId}/notes`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
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
	note: NoteInput
): Promise<NoteResponse | null> {
	try {
		const body = {
			persons: [{
				id: personId,
				notes: [{
					id: noteId,
					subject: note.subject,
					text: note.text,
					attribution: note.attribution,
				}],
			}],
		};

		const response = await sdk.post<NoteResponse>(
			`/platform/tree/persons/${personId}/notes/${noteId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
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
	noteId: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/tree/persons/${personId}/notes/${noteId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete note ${noteId} for person ${personId}:`,
			error
		);
		throw error;
	}
}
