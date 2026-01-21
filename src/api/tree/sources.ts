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
export async function readSourceDescriptions(
	sdk: FamilySearchSDK
): Promise<SourceDescriptionsResponse | null> {
	try {
		const response =
			await sdk.get<SourceDescriptionsResponse>("/platform/sources");
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
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
export async function readSourceDescription(
	sdk: FamilySearchSDK,
	sourceId: string
): Promise<SourceDescriptionResponse | null> {
	try {
		const response = await sdk.get<SourceDescriptionResponse>(
			`/platform/sources/${sourceId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
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
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete source description ${sourceId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get source description changes
 *
 * Checks if source descriptions have changed since a specified timestamp.
 * This is useful for syncing/caching source data.
 *
 * @param sdk - SDK instance
 * @param sourceIds - Array of source description IDs to check (max 100)
 * @param since - Unix epoch timestamp in milliseconds (e.g. 1346107362000)
 * @returns Source descriptions that have changed, or null if none changed
 *
 * @example
 * ```typescript
 * const timestamp = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
 * const changes = await readSourceDescriptionChanges(sdk, ['SRC-1', 'SRC-2'], timestamp);
 * if (changes) {
 *   console.log('Changed sources:', changes.sourceDescriptions?.length);
 * }
 * ```
 */
export async function readSourceDescriptionChanges(
	sdk: FamilySearchSDK,
	sourceIds: string[],
	since: number
): Promise<SourceDescriptionsResponse | null> {
	try {
		// Validate max 100 sources
		if (sourceIds.length > 100) {
			sdk.logger.warn(
				`[FamilySearch SDK] Maximum 100 source descriptions allowed, got ${sourceIds.length}. Using first 100.`
			);
			sourceIds = sourceIds.slice(0, 100);
		}

		const params = new URLSearchParams({
			since: since.toString(),
		});

		// Build request body with source description IDs
		const input = {
			sourceDescriptions: sourceIds.map((id) => ({ id })),
		};

		const response = await sdk.post<SourceDescriptionsResponse>(
			`/platform/sources/descriptions/changes?${params.toString()}`,
			input
		);

		// 204 No Content means no changes
		if (response.statusCode === 204) {
			return null;
		}

		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get source description changes:`,
			error
		);
		return null;
	}
}

/**
 * Check if source description exists (HEAD request)
 *
 * Performs a HEAD request to check if a source description exists without
 * retrieving the full content. Useful for verifying existence or checking
 * metadata via response headers.
 *
 * @param sdk - SDK instance
 * @param sourceId - Source description ID
 * @returns Object with exists flag and response headers
 *
 * @example
 * ```typescript
 * const check = await readSourceDescriptionHead(sdk, "MMMM-MMM");
 * if (check.exists) {
 *   console.log("Source exists, last modified:", check.headers?.["last-modified"]);
 * }
 * ```
 */
export async function readSourceDescriptionHead(
	sdk: FamilySearchSDK,
	sourceId: string
): Promise<{ exists: boolean; headers?: Record<string, string> }> {
	try {
		const response = await sdk.head(
			`/platform/sources/descriptions/${sourceId}`
		);

		return {
			exists: response.statusCode === 200,
			headers: response.headers,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to check source description ${sourceId}:`,
			error
		);
		return { exists: false };
	}
}

/**
 * SourcesAPI class provides convenient methods for managing source descriptions.
 */
export class SourcesAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readSourceDescriptions() {
		return readSourceDescriptions(this.sdk);
	}

	async readSourceDescription(sourceId: string) {
		return readSourceDescription(this.sdk, sourceId);
	}

	async createSourceDescription(source: SourceDescriptionInput) {
		return createSourceDescription(this.sdk, source);
	}

	async updateSourceDescription(
		sourceId: string,
		source: SourceDescriptionInput
	) {
		return updateSourceDescription(this.sdk, sourceId, source);
	}

	async deleteSourceDescription(sourceId: string) {
		return deleteSourceDescription(this.sdk, sourceId);
	}

	async readSourceDescriptionChanges(sourceIds: string[], since: number) {
		return readSourceDescriptionChanges(this.sdk, sourceIds, since);
	}

	async readSourceDescriptionHead(sourceId: string) {
		return readSourceDescriptionHead(this.sdk, sourceId);
	}
}
