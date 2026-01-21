/**
 * FamilySearch Conclusions API
 *
 * Handles deletion of individual conclusions (facts, names, gender) from persons
 * and relationships without deleting the entire entity.
 *
 * Conclusions are individual pieces of information about a person or relationship:
 * - Person: facts (birth, death, residence, etc.), names, gender
 * - Relationship: facts (marriage, divorce, etc.)
 *
 * @see https://developers.familysearch.org/docs/api/tree/Persons_Conclusion_resource
 */

import type { FamilySearchSDK } from "../../client";
import type { DeleteResponse } from "../../types";

/**
 * Delete a conclusion from a person
 *
 * Removes a specific conclusion (fact, name, or gender) from a person
 * without deleting the entire person. The conclusion ID can be found in
 * the person's data (e.g., facts[].id, names[].id, gender.id).
 *
 * **Important**: This is a destructive operation that permanently removes
 * the conclusion from the person's profile.
 *
 * @param sdk - SDK instance
 * @param personId - Person ID
 * @param conclusionId - Conclusion ID (fact/name/gender ID)
 * @param reason - Optional reason for deletion (recommended for audit trail)
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * // Delete a birth fact
 * const person = await getPerson(sdk, "PPPP-PPP");
 * const birthFactId = person?.persons?.[0]?.facts?.find(f => f.type === "Birth")?.id;
 *
 * if (birthFactId) {
 *   await deletePersonConclusion(sdk, "PPPP-PPP", birthFactId, "Incorrect birth date");
 *   console.log("Birth fact deleted");
 * }
 * ```
 */
export async function deletePersonConclusion(
	sdk: FamilySearchSDK,
	personId: string,
	conclusionId: string,
	reason?: string
): Promise<DeleteResponse> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/persons/${personId}/conclusions/${conclusionId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete conclusion ${conclusionId} from person ${personId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a conclusion from a couple relationship
 *
 * Removes a specific conclusion (fact like marriage, divorce, etc.) from
 * a couple relationship without deleting the entire relationship.
 * The conclusion ID can be found in the relationship's facts array.
 *
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param conclusionId - Conclusion ID (fact ID)
 * @param reason - Optional reason for deletion (recommended for audit trail)
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * // Delete a marriage fact
 * const rel = await getCoupleRelationship(sdk, "RRRR-RRR");
 * const marriageFactId = rel?.relationships?.[0]?.facts?.find(f => f.type === "Marriage")?.id;
 *
 * if (marriageFactId) {
 *   await deleteCoupleRelationshipConclusion(sdk, "RRRR-RRR", marriageFactId, "Wrong date");
 *   console.log("Marriage fact deleted");
 * }
 * ```
 */
export async function deleteCoupleRelationshipConclusion(
	sdk: FamilySearchSDK,
	relationshipId: string,
	conclusionId: string,
	reason?: string
): Promise<DeleteResponse> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/conclusions/${conclusionId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete conclusion ${conclusionId} from couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a conclusion from a child-and-parents relationship
 *
 * Removes a specific conclusion (fact like adoption, guardianship, etc.) from
 * a child-and-parents relationship without deleting the entire relationship.
 * The conclusion ID can be found in the relationship's facts array.
 *
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param conclusionId - Conclusion ID (fact ID)
 * @param reason - Optional reason for deletion (recommended for audit trail)
 * @returns Delete response with status
 * @throws Error if deletion fails
 *
 * @example
 * ```typescript
 * // Delete an adoption fact
 * const rel = await getChildAndParentsRelationship(sdk, "RRRR-RRR");
 * const adoptionFactId = rel?.childAndParentsRelationships?.[0]?.facts?.find(f => f.type === "Adoption")?.id;
 *
 * if (adoptionFactId) {
 *   await deleteChildAndParentsRelationshipConclusion(sdk, "RRRR-RRR", adoptionFactId, "Not adopted");
 *   console.log("Adoption fact deleted");
 * }
 * ```
 */
export async function deleteChildAndParentsRelationshipConclusion(
	sdk: FamilySearchSDK,
	relationshipId: string,
	conclusionId: string,
	reason?: string
): Promise<DeleteResponse> {
	try {
		const headers: Record<string, string> = {};
		if (reason) {
			headers["X-Reason"] = reason;
		}

		const response = await sdk.delete<DeleteResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/conclusions/${conclusionId}`,
			{ headers }
		);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to delete conclusion ${conclusionId} from child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * ConclusionsAPI class provides convenient methods for deleting conclusions from persons and relationships.
 */
export class ConclusionsAPI {
	constructor(private sdk: FamilySearchSDK) {}

	async deletePersonConclusion(
		personId: string,
		conclusionId: string,
		reason?: string
	) {
		return deletePersonConclusion(this.sdk, personId, conclusionId, reason);
	}

	async deleteCoupleRelationshipConclusion(
		relationshipId: string,
		conclusionId: string,
		reason?: string
	) {
		return deleteCoupleRelationshipConclusion(
			this.sdk,
			relationshipId,
			conclusionId,
			reason
		);
	}

	async deleteChildAndParentsRelationshipConclusion(
		relationshipId: string,
		conclusionId: string,
		reason?: string
	) {
		return deleteChildAndParentsRelationshipConclusion(
			this.sdk,
			relationshipId,
			conclusionId,
			reason
		);
	}
}
