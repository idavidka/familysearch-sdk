/**
 * FamilySearch Source Box API
 *
 * Handles user source folders and collections for organizing sources.
 *
 * @see https://developers.familysearch.org/main/reference/readusersourcefolders
 */

import type { FamilySearchSDK } from "../../client";
import type {
	UserSourceFoldersResponse,
	SourceFoldersResponse,
	CreateSourceFolderInput,
	CreateSourceFolderResponse,
	UserDefinedCollectionResponse,
	UpdateUserDefinedCollectionInput,
	UpdateUserDefinedCollectionResponse,
	CollectionSourceDescriptionsResponse,
	UpdateSourcesToCollectionInput,
	UpdateSourcesToCollectionResponse,
	DeleteResponse,
} from "../../types";

/**
 * Get user's source folders
 *
 * Returns all source folders (collections) owned by the current user.
 *
 * @param sdk - SDK instance
 * @returns User source folders or null
 *
 * @example
 * ```typescript
 * const folders = await readUserSourceFolders(sdk);
 * console.log('Folders:', folders?.collections?.length);
 * ```
 */
export async function readUserSourceFolders(
	sdk: FamilySearchSDK
): Promise<UserSourceFoldersResponse | null> {
	try {
		const response = await sdk.get<UserSourceFoldersResponse>(
			`/platform/tree/source-folders`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get user source folders:`,
			error
		);
		return null;
	}
}

/**
 * Get source folders
 *
 * Returns source folders with detailed information.
 *
 * @param sdk - SDK instance
 * @returns Source folders or null
 *
 * @example
 * ```typescript
 * const folders = await readSourceFolders(sdk);
 * ```
 */
export async function readSourceFolders(
	sdk: FamilySearchSDK
): Promise<SourceFoldersResponse | null> {
	try {
		const response = await sdk.get<SourceFoldersResponse>(
			`/platform/sources/folders`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get source folders:`,
			error
		);
		return null;
	}
}

/**
 * Create a source folder
 *
 * Creates a new folder (collection) for organizing sources.
 *
 * @param sdk - SDK instance
 * @param title - Folder title
 * @param description - Optional folder description
 * @returns Created folder response
 * @throws Error if creation fails
 *
 * @example
 * ```typescript
 * const folder = await createSourceFolder(sdk, 'My Research', 'Sources for Smith family');
 * console.log('Created folder:', folder?.collections?.[0]?.id);
 * ```
 */
export async function createSourceFolder(
	sdk: FamilySearchSDK,
	title: string,
	description?: string
): Promise<CreateSourceFolderResponse> {
	try {
		const input: CreateSourceFolderInput = {
			collections: [
				{
					title,
					description,
				},
			],
		};

		const response = await sdk.post<CreateSourceFolderResponse>(
			`/platform/sources/folders`,
			input
		);
		return response.data || { collections: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to create source folder:`,
			error
		);
		throw error;
	}
}

/**
 * Get user-defined collection
 *
 * Returns a specific user collection with its sources.
 *
 * @param sdk - SDK instance
 * @param collectionId - Collection ID
 * @returns Collection details or null
 *
 * @example
 * ```typescript
 * const collection = await readUserDefinedCollection(sdk, 'COLL-ID');
 * console.log('Sources:', collection?.collections?.[0]?.count);
 * ```
 */
export async function readUserDefinedCollection(
	sdk: FamilySearchSDK,
	collectionId: string
): Promise<UserDefinedCollectionResponse | null> {
	try {
		const response = await sdk.get<UserDefinedCollectionResponse>(
			`/platform/tree/collections/${collectionId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get collection ${collectionId}:`,
			error
		);
		return null;
	}
}

/**
 * Update user-defined collection
 *
 * Updates the title or description of a user collection.
 *
 * @param sdk - SDK instance
 * @param collectionId - Collection ID
 * @param title - New title
 * @param description - New description
 * @returns Updated collection response
 * @throws Error if update fails
 *
 * @example
 * ```typescript
 * await updateUserDefinedCollection(sdk, 'COLL-ID', 'Updated Title', 'New description');
 * ```
 */
export async function updateUserDefinedCollection(
	sdk: FamilySearchSDK,
	collectionId: string,
	title?: string,
	description?: string
): Promise<UpdateUserDefinedCollectionResponse> {
	try {
		const input: UpdateUserDefinedCollectionInput = {
			collections: [
				{
					id: collectionId,
					title,
					description,
				},
			],
		};

		const response = await sdk.post<UpdateUserDefinedCollectionResponse>(
			`/platform/tree/collections/${collectionId}`,
			input
		);
		return response.data || { collections: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to update collection ${collectionId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete user-defined collection
 *
 * Deletes a user collection. Sources in the collection are not deleted,
 * only the collection itself.
 *
 * @param sdk - SDK instance
 * @param collectionId - Collection ID to delete
 * @returns Delete response
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await deleteUserDefinedCollection(sdk, 'COLL-ID');
 * console.log('Collection deleted');
 * ```
 */
export async function deleteUserDefinedCollection(
	sdk: FamilySearchSDK,
	collectionId: string
): Promise<DeleteResponse> {
	try {
		const response = await sdk.delete<void>(
			`/platform/tree/collections/${collectionId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete collection ${collectionId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get collection source descriptions
 *
 * Returns all source descriptions in a collection.
 *
 * @param sdk - SDK instance
 * @param collectionId - Collection ID
 * @returns Source descriptions or null
 *
 * @example
 * ```typescript
 * const sources = await readCollectionSourceDescriptions(sdk, 'COLL-ID');
 * console.log('Sources in collection:', sources?.sourceDescriptions?.length);
 * ```
 */
export async function readCollectionSourceDescriptions(
	sdk: FamilySearchSDK,
	collectionId: string
): Promise<CollectionSourceDescriptionsResponse | null> {
	try {
		const response = await sdk.get<CollectionSourceDescriptionsResponse>(
			`/platform/tree/collections/${collectionId}/source-descriptions`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get source descriptions for collection ${collectionId}:`,
			error
		);
		return null;
	}
}

/**
 * Add sources to collection
 *
 * Adds one or more source descriptions to a collection.
 *
 * @param sdk - SDK instance
 * @param collectionId - Collection ID
 * @param sourceIds - Array of source description IDs to add
 * @returns Update response
 * @throws Error if update fails
 *
 * @example
 * ```typescript
 * await addSourcesToCollection(sdk, 'COLL-ID', ['SRC-1', 'SRC-2']);
 * console.log('Sources added to collection');
 * ```
 */
export async function addSourcesToCollection(
	sdk: FamilySearchSDK,
	collectionId: string,
	sourceIds: string[]
): Promise<UpdateSourcesToCollectionResponse> {
	try {
		const input: UpdateSourcesToCollectionInput = {
			sourceDescriptions: sourceIds.map((id) => ({ id })),
		};

		const response = await sdk.post<UpdateSourcesToCollectionResponse>(
			`/platform/tree/collections/${collectionId}/source-descriptions`,
			input
		);
		return response.data || { collections: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to add sources to collection ${collectionId}:`,
			error
		);
		throw error;
	}
}

/**
 * Remove sources from collection
 *
 * Removes one or more source descriptions from a collection.
 * The sources themselves are not deleted, only removed from the collection.
 *
 * @param sdk - SDK instance
 * @param collectionId - Collection ID
 * @param sourceIds - Array of source description IDs to remove
 * @returns Delete response
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * await removeSourcesFromCollection(sdk, 'COLL-ID', ['SRC-1', 'SRC-2']);
 * console.log('Sources removed from collection');
 * ```
 */
export async function removeSourcesFromCollection(
	sdk: FamilySearchSDK,
	collectionId: string,
	sourceIds: string[]
): Promise<DeleteResponse> {
	try {
		const params = new URLSearchParams();
		sourceIds.forEach((id) => params.append("sourceDescriptions", id));

		const response = await sdk.delete<void>(
			`/platform/tree/collections/${collectionId}/source-descriptions?${params.toString()}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to remove sources from collection ${collectionId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get user source descriptions
 *
 * Returns all source descriptions from all user-defined collections owned by a specific user.
 * This provides a complete inventory of sources the user has organized.
 *
 * @param sdk - SDK instance
 * @param userId - User ID (or 'current' for current user)
 * @param start - Zero-based index of first result (default: 0)
 * @param count - Maximum number of results to return (default: 25)
 * @returns Collection source descriptions response
 * @throws Error if request fails
 *
 * @example
 * ```typescript
 * const sources = await readUserSourceDescriptions(sdk, 'current');
 * console.log('User sources:', sources?.sourceDescriptions?.length);
 * ```
 */
export async function readUserSourceDescriptions(
	sdk: FamilySearchSDK,
	userId: string = "current",
	start: number = 0,
	count: number = 25
): Promise<CollectionSourceDescriptionsResponse> {
	try {
		const params = new URLSearchParams({
			start: start.toString(),
			count: count.toString(),
		});

		const response = await sdk.get<CollectionSourceDescriptionsResponse>(
			`/platform/sources/${userId}/collections/descriptions?${params.toString()}`
		);
		return response.data || { sourceDescriptions: [] };
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get user source descriptions for ${userId}:`,
			error
		);
		throw error;
	}
}

/**
 * SourceBoxAPI class provides convenient methods for managing user source folders and collections.
 */
export class SourceBoxAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async readUserSourceFolders() {
		return readUserSourceFolders(this.sdk);
	}

	async readSourceFolders() {
		return readSourceFolders(this.sdk);
	}

	async createSourceFolder(title: string, description?: string) {
		return createSourceFolder(this.sdk, title, description);
	}

	async readUserDefinedCollection(collectionId: string) {
		return readUserDefinedCollection(this.sdk, collectionId);
	}

	async updateUserDefinedCollection(
		collectionId: string,
		title?: string,
		description?: string
	) {
		return updateUserDefinedCollection(
			this.sdk,
			collectionId,
			title,
			description
		);
	}

	async deleteUserDefinedCollection(collectionId: string) {
		return deleteUserDefinedCollection(this.sdk, collectionId);
	}

	async readCollectionSourceDescriptions(collectionId: string) {
		return readCollectionSourceDescriptions(this.sdk, collectionId);
	}

	async addSourcesToCollection(collectionId: string, sourceIds: string[]) {
		return addSourcesToCollection(this.sdk, collectionId, sourceIds);
	}

	async removeSourcesFromCollection(
		collectionId: string,
		sourceIds: string[]
	) {
		return removeSourcesFromCollection(this.sdk, collectionId, sourceIds);
	}

	async readUserSourceDescriptions(
		userId: string = "current",
		start: number = 0,
		count: number = 25
	) {
		return readUserSourceDescriptions(this.sdk, userId, start, count);
	}
}
