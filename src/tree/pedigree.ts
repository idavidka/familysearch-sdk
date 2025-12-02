/**
 * FamilySearch Tree/Pedigree API Module
 *
 * Provides helpers for fetching and managing family tree data
 * including pedigree, ancestry, and relationship information.
 */

import type { FamilySearchSDK } from "../client";
import type {
	EnhancedPedigreeData,
	EnhancedPerson,
	FamilySearchUser,
	PedigreeData,
	ProgressCallback,
	Relationship,
} from "../types";

/**
 * Fetch pedigree/ancestry data with enhanced details
 *
 * @param sdk - FamilySearch SDK instance
 * @param personId - Optional person ID to start from. If not provided, uses current user.
 * @param options - Fetch options
 * @returns Promise with enhanced pedigree data
 *
 * @example
 * ```typescript
 * const pedigree = await fetchPedigree(sdk, "XXXX-YYY", {
 *   generations: 5,
 *   onProgress: (p) => console.log(`${p.percent}% complete`)
 * });
 * ```
 */
export async function fetchPedigree(
	sdk: FamilySearchSDK,
	personId?: string,
	options: {
		generations?: number;
		onProgress?: ProgressCallback;
		includeDetails?: boolean;
		includeNotes?: boolean;
		includeRelationshipDetails?: boolean;
	} = {}
): Promise<EnhancedPedigreeData> {
	const {
		generations = 4,
		onProgress,
		includeDetails = true,
		includeNotes = true,
		includeRelationshipDetails = true,
	} = options;

	// Get current user's person ID if not provided
	let targetPersonId = personId;
	if (!targetPersonId) {
		onProgress?.({
			stage: "getting_current_user",
			current: 0,
			total: 1,
			percent: 0,
		});

		const currentUser = await sdk.getCurrentUser();
		targetPersonId =
			currentUser?.personId ||
			currentUser?.treeUserId ||
			currentUser?.id;

		if (!targetPersonId) {
			throw new Error("Could not determine person ID for current user");
		}
	}

	// Step 1: Fetch ancestry structure
	onProgress?.({
		stage: "fetching_ancestry_structure",
		current: 1,
		total: 3,
		percent: 10,
	});

	const ancestryResponse = await sdk.getAncestry(targetPersonId, generations);
	const ancestry = ancestryResponse.data as PedigreeData;

	if (!ancestry.persons || ancestry.persons.length === 0) {
		throw new Error("No persons found in ancestry");
	}

	// Step 2: Enhance each person with detailed data
	onProgress?.({
		stage: "fetching_person_details",
		current: 0,
		total: ancestry.persons.length,
		percent: 20,
	});

	const personsWithDetails: EnhancedPerson[] = [];
	for (let i = 0; i < ancestry.persons.length; i++) {
		const person = ancestry.persons[i];

		onProgress?.({
			stage: "fetching_person_details",
			current: i + 1,
			total: ancestry.persons.length,
			percent: 20 + Math.floor(((i + 1) / ancestry.persons.length) * 45),
		});

		try {
			const enhanced: EnhancedPerson = { ...person };

			// Fetch full person details with sources
			if (includeDetails) {
				enhanced.fullDetails = (await sdk.getPersonWithDetails(
					person.id
				)) as EnhancedPerson["fullDetails"];
			}

			// Fetch notes
			if (includeNotes) {
				enhanced.notes = (await sdk.getPersonNotes(
					person.id
				)) as EnhancedPerson["notes"];
			}

			personsWithDetails.push(enhanced);
		} catch {
			// Fallback to basic person data
			personsWithDetails.push(person as EnhancedPerson);
		}
	}

	// Step 3: Enhance couple relationships with marriage details
	onProgress?.({
		stage: "fetching_relationship_details",
		current: 0,
		total: ancestry.relationships?.length || 0,
		percent: 65,
	});

	const relationshipsWithDetails: Relationship[] = [];
	if (ancestry.relationships && includeRelationshipDetails) {
		for (let i = 0; i < ancestry.relationships.length; i++) {
			const rel = ancestry.relationships[i];

			onProgress?.({
				stage: "fetching_relationship_details",
				current: i + 1,
				total: ancestry.relationships.length,
				percent:
					65 +
					Math.floor(((i + 1) / ancestry.relationships.length) * 25),
			});

			try {
				// Only fetch details for couple relationships
				if (rel.type?.includes?.("Couple")) {
					const relDetails = await sdk.getCoupleRelationship(rel.id);
					relationshipsWithDetails.push({
						...rel,
						details: relDetails as Relationship["details"],
					});
				} else {
					relationshipsWithDetails.push(rel);
				}
			} catch {
				relationshipsWithDetails.push(rel);
			}
		}
	} else if (ancestry.relationships) {
		relationshipsWithDetails.push(...ancestry.relationships);
	}

	// Step 4: Extract additional relationships from person details
	onProgress?.({
		stage: "extracting_additional_relationships",
		current: 0,
		total: 1,
		percent: 90,
	});

	const allRelationships = [...relationshipsWithDetails];
	const relationshipIds = new Set(relationshipsWithDetails.map((r) => r.id));

	personsWithDetails.forEach((person) => {
		// Extract child-parent relationships from person details
		const childAndParentsRels =
			person.fullDetails?.childAndParentsRelationships;
		if (childAndParentsRels && Array.isArray(childAndParentsRels)) {
			childAndParentsRels.forEach((rel) => {
				if (!relationshipIds.has(rel.id)) {
					relationshipIds.add(rel.id);
					allRelationships.push({
						id: rel.id,
						type: "http://gedcomx.org/ParentChild",
						person1: rel.parent1,
						person2: rel.child,
						parent2: rel.parent2,
					});
				}
			});
		}

		// Extract couple relationships from person details
		const relationships = person.fullDetails?.relationships;
		if (relationships && Array.isArray(relationships)) {
			relationships.forEach((rel) => {
				if (rel.type?.includes?.("Couple") && !relationshipIds.has(rel.id)) {
					relationshipIds.add(rel.id);
					allRelationships.push({
						id: rel.id,
						type: rel.type,
						person1: rel.person1,
						person2: rel.person2,
						facts: rel.facts,
					});
				}
			});
		}
	});

	onProgress?.({
		stage: "completing_data_fetch",
		current: 1,
		total: 1,
		percent: 98,
	});

	return {
		persons: personsWithDetails,
		relationships: allRelationships,
		environment: sdk.getEnvironment(),
	};
}

/**
 * Get current user information
 */
export async function getCurrentUser(
	sdk: FamilySearchSDK
): Promise<FamilySearchUser | null> {
	return sdk.getCurrentUser();
}

/**
 * Get person by ID with full details
 */
export async function getPersonWithDetails(
	sdk: FamilySearchSDK,
	personId: string
): Promise<EnhancedPerson | null> {
	try {
		const [details, notes] = await Promise.all([
			sdk.getPersonWithDetails(personId),
			sdk.getPersonNotes(personId),
		]);

		if (!details) {
			return null;
		}

		// The details response contains the person data in persons array
		const fullDetails = details as EnhancedPerson["fullDetails"];
		const personData = fullDetails?.persons?.[0];

		if (!personData) {
			return null;
		}

		return {
			...personData,
			fullDetails: fullDetails,
			notes: notes as EnhancedPerson["notes"],
		};
	} catch {
		return null;
	}
}

/**
 * Fetch multiple persons at once
 */
export async function fetchMultiplePersons(
	sdk: FamilySearchSDK,
	personIds: string[]
): Promise<unknown> {
	const pids = personIds.join(",");
	const response = await sdk.get(`/platform/tree/persons?pids=${pids}`);
	return response.data;
}
