/**
 * FamilySearch Relationships API
 * 
 * Handles couple and child-and-parents relationships in the FamilySearch Family Tree.
 * 
 * @see https://developers.familysearch.org/main/reference/readcouplerelationship
 */

import type { FamilySearchSDK } from "../../client";
import type {
	RelationshipDetails,
	CreateCoupleRelationshipInput,
	CreateChildAndParentsRelationshipInput,
	CreateRelationshipResponse,
	UpdateRelationshipResponse,
	DeletePersonResponse,
	CoupleRelationshipChangeHistoryResponse,
	ChildAndParentsRelationshipChangeHistoryResponse,
	RestoreChangeResponse,
	SetParentOrderInput,
	SetParentOrderResponse,
	SetSpouseOrderInput,
	SetSpouseOrderResponse,
} from "../../types";

/**
 * Get couple relationship details
 * 
 * @param sdk - SDK instance
 * @param relationshipId - Relationship ID
 * @returns Relationship details or null
 */
export async function getCoupleRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string
): Promise<RelationshipDetails | null> {
	try {
		const response = await sdk.get<RelationshipDetails>(
			`/platform/tree/couple-relationships/${relationshipId}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get couple relationship ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a couple relationship between two persons
 * 
 * @param sdk - SDK instance
 * @param relationship - Relationship data
 * @returns Created relationship data
 * 
 * @example
 * ```typescript
 * const marriage = await createCoupleRelationship(sdk, {
 *   person1: 'KWQS-BBQ',
 *   person2: 'KWQS-BBC',
 *   facts: [{
 *     type: 'http://gedcomx.org/Marriage',
 *     date: { original: '1875' },
 *     place: { original: 'London, England' }
 *   }]
 * });
 * ```
 */
export async function createCoupleRelationship(
	sdk: FamilySearchSDK,
	relationship: CreateCoupleRelationshipInput
): Promise<CreateRelationshipResponse | null> {
	try {
		const body = {
			relationships: [{
				type: "http://gedcomx.org/Couple",
				person1: { resourceId: relationship.person1 },
				person2: { resourceId: relationship.person2 },
				facts: relationship.facts || [],
			}],
		};

		const response = await sdk.post<CreateRelationshipResponse>(
			"/platform/tree/couple-relationships",
			body
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to create couple relationship:",
			error
		);
		throw error;
	}
}

/**
 * Update a couple relationship
 * 
 * @param sdk - SDK instance
 * @param relationshipId - ID of the relationship to update
 * @param relationship - Updated relationship data
 * @returns Updated relationship data
 */
export async function updateCoupleRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	relationship: CreateCoupleRelationshipInput
): Promise<UpdateRelationshipResponse | null> {
	try {
		const body = {
			relationships: [{
				id: relationshipId,
				type: "http://gedcomx.org/Couple",
				person1: { resourceId: relationship.person1 },
				person2: { resourceId: relationship.person2 },
				facts: relationship.facts || [],
			}],
		};

		const response = await sdk.post<UpdateRelationshipResponse>(
			`/platform/tree/couple-relationships/${relationshipId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a couple relationship
 * 
 * @param sdk - SDK instance
 * @param relationshipId - ID of the relationship to delete
 * @param reason - Optional reason for deletion
 * @returns Delete confirmation
 */
export async function deleteCoupleRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	reason?: string
): Promise<DeletePersonResponse | null> {
	try {
		const url = reason
			? `/platform/tree/couple-relationships/${relationshipId}?reason=${encodeURIComponent(reason)}`
			: `/platform/tree/couple-relationships/${relationshipId}`;

		const response = await sdk.delete<DeletePersonResponse>(url);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete couple relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get child-and-parents relationship details
 * 
 * @param sdk - SDK instance
 * @param relationshipId - Relationship ID
 * @returns Relationship details or null
 */
export async function getChildAndParentsRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string
): Promise<RelationshipDetails | null> {
	try {
		const response = await sdk.get<RelationshipDetails>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get child-and-parents relationship ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Create a child-and-parents relationship
 * 
 * @param sdk - SDK instance
 * @param relationship - Relationship data
 * @returns Created relationship data
 * 
 * @example
 * ```typescript
 * const parentChild = await createChildAndParentsRelationship(sdk, {
 *   child: 'KWQS-BBC',
 *   father: 'KWQS-BBQ',
 *   mother: 'KWQS-BBD',
 *   fatherFacts: [{
 *     type: 'http://gedcomx.org/BiologicalParent'
 *   }],
 *   motherFacts: [{
 *     type: 'http://gedcomx.org/BiologicalParent'
 *   }]
 * });
 * ```
 */
export async function createChildAndParentsRelationship(
	sdk: FamilySearchSDK,
	relationship: CreateChildAndParentsRelationshipInput
): Promise<CreateRelationshipResponse | null> {
	try {
		const body = {
			childAndParentsRelationships: [{
				type: "http://gedcomx.org/ParentChild",
				child: { resourceId: relationship.child },
				...(relationship.father && {
					parent1: { resourceId: relationship.father },
					parent1Facts: relationship.fatherFacts || [],
				}),
				...(relationship.mother && {
					parent2: { resourceId: relationship.mother },
					parent2Facts: relationship.motherFacts || [],
				}),
			}],
		};

		const response = await sdk.post<CreateRelationshipResponse>(
			"/platform/tree/child-and-parents-relationships",
			body
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			"[FamilySearch SDK] Failed to create child-and-parents relationship:",
			error
		);
		throw error;
	}
}

/**
 * Update a child-and-parents relationship
 * 
 * @param sdk - SDK instance
 * @param relationshipId - ID of the relationship to update
 * @param relationship - Updated relationship data
 * @returns Updated relationship data
 */
export async function updateChildAndParentsRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	relationship: CreateChildAndParentsRelationshipInput
): Promise<UpdateRelationshipResponse | null> {
	try {
		const body = {
			childAndParentsRelationships: [{
				id: relationshipId,
				type: "http://gedcomx.org/ParentChild",
				child: { resourceId: relationship.child },
				...(relationship.father && {
					parent1: { resourceId: relationship.father },
					parent1Facts: relationship.fatherFacts || [],
				}),
				...(relationship.mother && {
					parent2: { resourceId: relationship.mother },
					parent2Facts: relationship.motherFacts || [],
				}),
			}],
		};

		const response = await sdk.post<UpdateRelationshipResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}`,
			body
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to update child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Delete a child-and-parents relationship
 * 
 * @param sdk - SDK instance
 * @param relationshipId - ID of the relationship to delete
 * @param reason - Optional reason for deletion
 * @returns Delete confirmation
 */
export async function deleteChildAndParentsRelationship(
	sdk: FamilySearchSDK,
	relationshipId: string,
	reason?: string
): Promise<DeletePersonResponse | null> {
	try {
		const url = reason
			? `/platform/tree/child-and-parents-relationships/${relationshipId}?reason=${encodeURIComponent(reason)}`
			: `/platform/tree/child-and-parents-relationships/${relationshipId}`;

		const response = await sdk.delete<DeletePersonResponse>(url);
		return {
			statusCode: response.statusCode,
			statusText: response.statusText,
		};
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to delete child-and-parents relationship ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Get couple relationship change history
 * 
 * Returns the change history entries for a couple relationship,
 * showing who made changes, when, and what operations were performed.
 * 
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @returns Change history entries or null
 * 
 * @example
 * ```typescript
 * const history = await getCoupleRelationshipChangeHistory(sdk, "PPPP-PPP");
 * if (history?.entries) {
 *   history.entries.forEach(entry => {
 *     console.log(`${entry.title}: ${entry.updated}`);
 *   });
 * }
 * ```
 */
export async function getCoupleRelationshipChangeHistory(
	sdk: FamilySearchSDK,
	relationshipId: string
): Promise<CoupleRelationshipChangeHistoryResponse | null> {
	try {
		const response = await sdk.get<CoupleRelationshipChangeHistoryResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/changes`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get couple relationship change history for ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Get child-and-parents relationship change history
 * 
 * Returns the change history entries for a child-and-parents relationship,
 * showing who made changes, when, and what operations were performed.
 * 
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @returns Change history entries or null
 * 
 * @example
 * ```typescript
 * const history = await getChildAndParentsRelationshipChangeHistory(sdk, "PPPP-PPP");
 * if (history?.entries) {
 *   history.entries.forEach(entry => {
 *     console.log(`${entry.title}: ${entry.updated}`);
 *   });
 * }
 * ```
 */
export async function getChildAndParentsRelationshipChangeHistory(
	sdk: FamilySearchSDK,
	relationshipId: string
): Promise<ChildAndParentsRelationshipChangeHistoryResponse | null> {
	try {
		const response = await sdk.get<ChildAndParentsRelationshipChangeHistoryResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/changes`
		);
		return response.data || null;
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to get child-and-parents relationship change history for ${relationshipId}:`,
			error
		);
		return null;
	}
}

/**
 * Restore a change from history
 * 
 * Restores a person, relationship, or conclusion from a change history entry.
 * This operation recreates the state of the entity as it was in the specified change.
 * 
 * **Note:** This endpoint works for any entity type (persons, relationships, etc.)
 * by using the change ID from the change history.
 * 
 * @param sdk - SDK instance
 * @param changeId - Change ID from change history (e.g., from entries[].id)
 * @returns Restored change details
 * @throws Error if restore fails
 * 
 * @example
 * ```typescript
 * // Get change history first
 * const history = await getPersonChangeHistory(sdk, "PPPP-PPP");
 * const changeId = history?.entries?.[0]?.id;
 * 
 * // Restore the change
 * if (changeId) {
 *   const result = await restoreChange(sdk, changeId);
 *   console.log("Change restored:", result);
 * }
 * ```
 */
export async function restoreChange(
	sdk: FamilySearchSDK,
	changeId: string
): Promise<RestoreChangeResponse> {
	try {
		const response = await sdk.post<RestoreChangeResponse>(
			`/platform/tree/restore`,
			{
				changeIds: [changeId],
			}
		);
		return response.data || { entries: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to restore change ${changeId}:`,
			error
		);
		throw error;
	}
}

/**
 * Set parent order in a child-and-parents relationship
 * 
 * Controls the display order of parents (who appears as parent1 vs parent2)
 * in a child-and-parents relationship. This is useful for determining which
 * parent is listed first in family tree views.
 * 
 * @param sdk - SDK instance
 * @param relationshipId - Child-and-parents relationship ID
 * @param parent1Id - Person ID to be set as parent1
 * @param parent2Id - Person ID to be set as parent2
 * @returns Updated relationship with new parent order
 * @throws Error if order update fails
 * 
 * @example
 * ```typescript
 * // Set mother as parent1, father as parent2
 * const result = await setParentOrder(sdk, "RRRR-RRR", "PPPP-PPP", "PPPP-PPQ");
 * console.log("Parent order set:", result);
 * ```
 */
export async function setParentOrder(
	sdk: FamilySearchSDK,
	relationshipId: string,
	parent1Id: string,
	parent2Id: string
): Promise<SetParentOrderResponse> {
	try {
		const input: SetParentOrderInput = {
			persons: [
				{
					resourceId: parent1Id,
					resource: `#${parent1Id}`,
				},
				{
					resourceId: parent2Id,
					resource: `#${parent2Id}`,
				},
			],
		};

		const response = await sdk.post<SetParentOrderResponse>(
			`/platform/tree/child-and-parents-relationships/${relationshipId}/parents/order`,
			input
		);
		return response.data || { childAndParentsRelationships: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to set parent order for ${relationshipId}:`,
			error
		);
		throw error;
	}
}

/**
 * Set spouse order in a couple relationship
 * 
 * Controls the display order of spouses (who appears as person1 vs person2)
 * in a couple relationship. This is useful for determining which spouse
 * is listed first in family tree views.
 * 
 * @param sdk - SDK instance
 * @param relationshipId - Couple relationship ID
 * @param person1Id - Person ID to be set as person1
 * @param person2Id - Person ID to be set as person2
 * @returns Updated relationship with new spouse order
 * @throws Error if order update fails
 * 
 * @example
 * ```typescript
 * // Set wife as person1, husband as person2
 * const result = await setSpouseOrder(sdk, "RRRR-RRR", "PPPP-PPP", "PPPP-PPQ");
 * console.log("Spouse order set:", result);
 * ```
 */
export async function setSpouseOrder(
	sdk: FamilySearchSDK,
	relationshipId: string,
	person1Id: string,
	person2Id: string
): Promise<SetSpouseOrderResponse> {
	try {
		const input: SetSpouseOrderInput = {
			persons: [
				{
					resourceId: person1Id,
					resource: `#${person1Id}`,
				},
				{
					resourceId: person2Id,
					resource: `#${person2Id}`,
				},
			],
		};

		const response = await sdk.post<SetSpouseOrderResponse>(
			`/platform/tree/couple-relationships/${relationshipId}/spouses/order`,
			input
		);
		return response.data || { relationships: [] };
	} catch (error) {
		sdk["logger"].error(
			`[FamilySearch SDK] Failed to set spouse order for ${relationshipId}:`,
			error
		);
		throw error;
	}
}
