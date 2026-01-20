/**
 * FamilySearch Sources API
 * 
 * Handles source descriptions and source box operations.
 * 
 * @see https://developers.familysearch.org/main/reference/readsourcedescription
 */

import type { FamilySearchSDK } from "../../client";
import type {
	SourceDescriptionResponse,
	SourceDescriptionsResponse,
	SourceDescriptionInput,
	CreateSourceDescriptionResponse,
	UpdateSourceDescriptionResponse,
	DeleteResponse,
} from "../../types";

/**
 * Get source descriptions
 * 
 * @param sdk - SDK instance
 * @returns Source descriptions or null
 */
export async function getSourceDescriptions(
	sdk: FamilySearchSDK
): Promise<SourceDescriptionsResponse | null> {
	try {
		const response = await sdk.get<SourceDescriptionsResponse>(
			"/platform/sources"
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to get source descriptions:",
			error
		);
		return null;
	}
}

/**
 * Get a specific source description
 * 
 * @param sdk - SDK instance
 * @param sourceId - Source description ID
 * @returns Source description or null
 */
export async function getSourceDescription(
	sdk: FamilySearchSDK,
	sourceId: string
): Promise<SourceDescriptionResponse | null> {
	try {
		const response = await sdk.get<SourceDescriptionResponse>(
			`/platform/sources/${sourceId}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get source description ${sourceId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a new source description
 * 
 * Creates a source description for a record, document, book, or other source.
 * This is typically the first step before attaching a source to persons or relationships.
 * 
 * @param sdk - SDK instance
 * @param sourceData - Source description data
 * @returns Created source description
 * @throws Error if creation fails
 * 
 * @example
 * ```typescript
 * const source = await createSourceDescription(sdk, {
 *   about: "https://www.familysearch.org/ark:/61903/1:1:XXXX-XXX",
 *   titles: [{ value: "1900 US Census" }],
 *   citations: [{ value: "Line 42, Family 123" }],
 *   resourceType: "http://gedcomx.org/DigitalArtifact"
 * });
 * console.log("Source created:", source.sourceDescriptions?.[0]?.id);
 * ```
 */
export async function createSourceDescription(
	sdk: FamilySearchSDK,
	sourceData: SourceDescriptionInput
): Promise<CreateSourceDescriptionResponse> {
	try {
		const input = {
			sourceDescriptions: [sourceData],
		};
		const response = await sdk.post<CreateSourceDescriptionResponse>(
			"/platform/sources",
			input
		);
		return response.data || { sourceDescriptions: [] };
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to create source description:",
			error
		);
		throw error;
	}
}

/**
 * Update an existing source description
 * 
 * Updates metadata for an existing source description.
 * Only the fields provided will be updated.
 * 
 * @param sdk - SDK instance
 * @param sourceId - Source description ID
 * @param sourceData - Updated source description data
 * @returns Updated source description
 * @throws Error if update fails
 * 
 * @example
 * ```typescript
 * await updateSourceDescription(sdk, "MMMM-MMM", {
 *   titles: [{ value: "1900 US Census - Updated Title" }],
 *   citations: [{ value: "Updated citation info" }]
 * });
 * ```
 */
export async function updateSourceDescription(
	sdk: FamilySearchSDK,
	sourceId: string,
	sourceData: SourceDescriptionInput
): Promise<UpdateSourceDescriptionResponse> {
	try {
		const input = {
			sourceDescriptions: [
				{
					id: sourceId,
					...sourceData,
				},
			],
		};
		const response = await sdk.post<UpdateSourceDescriptionResponse>(
			`/platform/sources/${sourceId}`,
			input
		);
		return response.data || { sourceDescriptions: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update source description ${sourceId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a source description
 * 
 * Permanently deletes a source description.
 * **Warning:** This will also remove all attachments of this source to persons and relationships.
 * 
 * @param sdk - SDK instance
 * @param sourceId - Source description ID
 * @returns Delete response with status
 * @throws Error if deletion fails
 * 
 * @example
 * ```typescript
 * await deleteSourceDescription(sdk, "MMMM-MMM");
 * console.log("Source description deleted");
 * ```
 */
export async function deleteSourceDescription(
	sdk: FamilySearchSDK,
	sourceId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<DeleteResponse>(
			`/platform/sources/${sourceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete source description ${sourceId}:`,
			error
		);
		throw error;
	}
}
