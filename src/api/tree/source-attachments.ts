/**
 * FamilySearch Source Attachments API
 *
 * Handles attaching and detaching sources to/from persons and relationships.
 *
 * @see https://developers.familysearch.org/main/reference/createsourcereference
 */

import type { FamilySearchSDK } from "../../client";
import type { AttachSourceInput, AttachSourceResponse } from "../../types";

/**
 * Attach a source to a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param source - Source attachment input
 * @returns Attached source response
 *
 * @example
 * ```typescript
 * const result = await attachSourceToPerson(sdk, 'KWQS-BBQ', {
 *   descriptionId: 'MMMM-MMM',
 *   tags: [
 *     { resource: 'http://gedcomx.org/Birth' },
 *     { resource: 'http://gedcomx.org/Name' }
 *   ]
 * });
 * ```
 */
export async function attachSourceToPerson(
	sdk: FamilySearchSDK,
	personId: string,
	source: AttachSourceInput
): Promise<AttachSourceResponse | null> {
	try {
		const body = {
			persons: [
				{
					id: personId,
					sources: [
						{
							description: `#${source.descriptionId}`,
							...(source.tags && { tags: source.tags }),
						},
					],
				},
			],
			sourceDescriptions: [
				{
					id: source.descriptionId,
				},
			],
		};

		const response = await sdk.post<AttachSourceResponse>(
			`/platform/tree/persons/${personId}/source-references`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to attach source to person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Detach a source from a person
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param sourceReferenceId - Source reference ID
 * @returns Delete confirmation
 */
export async function detachSourceFromPerson(
	sdk: FamilySearchSDK,
	personId: string,
	sourceReferenceId: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/tree/persons/${personId}/source-references/${sourceReferenceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to detach source from person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Attach a source to a couple relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param source - Source attachment input
 * @returns Attached source response
 */
export async function attachSourceToCoupleRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	source: AttachSourceInput
): Promise<AttachSourceResponse | null> {
	try {
		const body = {
			relationships: [
				{
					id: relationshipId,
					sources: [
						{
							description: `#${source.descriptionId}`,
							...(source.tags && { tags: source.tags }),
						},
					],
				},
			],
			sourceDescriptions: [
				{
					id: source.descriptionId,
				},
			],
		};

		const response = await sdk.post<AttachSourceResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/source-references`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to attach source to couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Detach a source from a couple relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param sourceReferenceId - Source reference ID
 * @returns Delete confirmation
 */
export async function detachSourceFromCoupleRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	sourceReferenceId: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/tree/couple-relationships/${relationshipId}/source-references/${sourceReferenceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to detach source from couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Attach a source to a child-and-parents relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param source - Source attachment input
 * @returns Attached source response
 */
export async function attachSourceToChildAndParentsRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	source: AttachSourceInput
): Promise<AttachSourceResponse | null> {
	try {
		const body = {
			childAndParentsRelationships: [
				{
					id: relationshipId,
					sources: [
						{
							description: `#${source.descriptionId}`,
							...(source.tags && { tags: source.tags }),
						},
					],
				},
			],
			sourceDescriptions: [
				{
					id: source.descriptionId,
				},
			],
		};

		const response = await sdk.post<AttachSourceResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/source-references`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to attach source to child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Detach a source from a child-and-parents relationship
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param sourceReferenceId - Source reference ID
 * @returns Delete confirmation
 */
export async function detachSourceFromChildAndParentsRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	sourceReferenceId: string
): Promise<{ statusCode: number; statusText: string } | null> {
	try {
		const response = await sdk.delete<void>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/source-references/${sourceReferenceId}`
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to detach source from child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * SourceAttachmentsAPI class provides convenient methods for attaching and detaching sources.
 */
export class SourceAttachmentsAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async attachSourceToPerson(personId: string, source: AttachSourceInput) {
		return attachSourceToPerson(this.sdk, personId, source);
	}

	async detachSourceFromPerson(personId: string, sourceReferenceId: string) {
		return detachSourceFromPerson(this.sdk, personId, sourceReferenceId);
	}

	async attachSourceToCoupleRelationship(
		relationshipId: string,
		source: AttachSourceInput
	) {
		return attachSourceToCoupleRelationship(
			this.sdk,
			relationshipId,
			source
		);
	}

	async detachSourceFromCoupleRelationship(
		relationshipId: string,
		sourceReferenceId: string
	) {
		return detachSourceFromCoupleRelationship(
			this.sdk,
			relationshipId,
			sourceReferenceId
		);
	}

	async attachSourceToChildAndParentsRelationship(
		relationshipId: string,
		source: AttachSourceInput
	) {
		return attachSourceToChildAndParentsRelationship(
			this.sdk,
			relationshipId,
			source
		);
	}

	async detachSourceFromChildAndParentsRelationship(
		relationshipId: string,
		sourceReferenceId: string
	) {
		return detachSourceFromChildAndParentsRelationship(
			this.sdk,
			relationshipId,
			sourceReferenceId
		);
	}
}
