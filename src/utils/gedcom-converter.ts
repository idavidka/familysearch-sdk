/**
 * FamilySearch to GEDCOM Converter
 *
 * Converts FamilySearch API responses into GEDCOM 5.5 format
 */

import type {
	EnhancedPedigreeData,
	PersonData,
	PersonFact,
	Relationship,
	SourceDescription,
	SourceReference,
} from "../types";

/**
 * Transform FamilySearch API URLs to web URLs
 * Supports: apibeta.familysearch.org, beta.familysearch.org, integration.familysearch.org
 */
function transformFamilySearchUrl(url: string): string {
	// If it's not an API URL, return as-is
	if (!url.includes("/platform/tree/persons/")) {
		return url;
	}

	// Extract person ID from API URL
	const personId = url.match(/persons\/([^/?]+)/)?.[1];
	if (!personId) {
		return url;
	}

	// Detect environment from the URL
	let baseUrl = "https://www.familysearch.org";

	if (
		url.includes("integration.familysearch.org") ||
		url.includes("api-integ.familysearch.org")
	) {
		baseUrl = "https://integration.familysearch.org";
	} else if (
		url.includes("beta.familysearch.org") ||
		url.includes("apibeta.familysearch.org")
	) {
		baseUrl = "https://beta.familysearch.org";
	}

	return `${baseUrl}/tree/person/${personId}`;
}

/**
 * Transform FamilySearch source URLs to web-accessible ARK URLs
 *
 * FamilySearch API returns source URLs in the format:
 * - https://api.familysearch.org/platform/sources/ark:/NAAN/Name
 * - https://apibeta.familysearch.org/platform/sources/ark:/NAAN/Name
 * - https://api-integ.familysearch.org/platform/sources/ark:/NAAN/Name
 *
 * These need to be transformed to web-accessible URLs:
 * - https://www.familysearch.org/ark:/NAAN/Name
 * - https://beta.familysearch.org/ark:/NAAN/Name
 * - https://integration.familysearch.org/ark:/NAAN/Name
 *
 * ARK (Archival Resource Key) format: ark:/NAAN/Name
 * - NAAN: Name Assigning Authority Number
 * - Name: Unique identifier
 *
 * @param url - FamilySearch API source URL
 * @returns Web-accessible ARK URL
 */
function transformSourceUrl(url: string): string {
	if (!url) return url;

	// If it's already a web URL (not API URL with /platform/), return as-is
	if (!url.includes("/platform/") && url.includes("ark:")) {
		return url;
	}

	// Extract ARK identifier from URL
	const arkMatch = url.match(/ark:\/[^/?]+\/[^/?]+/);
	if (!arkMatch) {
		return url;
	}

	const arkId = arkMatch[0];

	// Detect environment from URL
	let baseUrl = "https://www.familysearch.org";

	if (
		url.includes("integration.familysearch.org") ||
		url.includes("api-integ.familysearch.org")
	) {
		baseUrl = "https://integration.familysearch.org";
	} else if (
		url.includes("beta.familysearch.org") ||
		url.includes("apibeta.familysearch.org")
	) {
		baseUrl = "https://beta.familysearch.org";
	}

	return `${baseUrl}/${arkId}`;
}

/**
 * Extract name from FamilySearch person
 */
function extractName(person?: PersonData): string | null {
	if (!person) return null;

	// Try structured name
	if (person.names?.[0]?.nameForms?.[0]) {
		const nameForm = person.names[0].nameForms[0];

		// Build from parts
		const parts = nameForm.parts || [];
		const given = parts.find((p) => p.type?.includes("Given"))?.value || "";
		const surname =
			parts.find((p) => p.type?.includes("Surname"))?.value || "";

		if (given || surname) {
			return `${given} /${surname}/`.trim();
		}

		if (nameForm.fullText) {
			return nameForm.fullText;
		}
	}

	// Try display name
	if (person.display?.name) {
		return person.display.name;
	}

	return null;
}

/**
 * Extract gender from FamilySearch person
 */
function extractGender(person?: PersonData): string | null {
	if (!person) return null;

	if (person.gender?.type?.includes("Male")) {
		return "M";
	} else if (person.gender?.type?.includes("Female")) {
		return "F";
	} else if (person.display?.gender === "Male") {
		return "M";
	} else if (person.display?.gender === "Female") {
		return "F";
	}

	return null;
}

/**
 * Extract a specific fact (like birth or death) from FamilySearch person
 */
function extractFact(
	person: PersonData | undefined,
	factType: "BIRTH" | "DEATH"
): { date?: string; place?: string } | null {
	if (!person) return null;

	const result: { date?: string; place?: string } = {};

	// Try structured facts
	const factTypeUrl = `http://gedcomx.org/${factType === "BIRTH" ? "Birth" : "Death"}`;
	const fact = person.facts?.find((f) => f.type === factTypeUrl);

	if (fact) {
		if (fact.date?.formal || fact.date?.original) {
			result.date = (fact.date?.formal || fact.date?.original)?.replace(
				/^(-|\+)/,
				""
			);
		}
		if (fact.place?.original) {
			result.place = fact.place.original;
		}
	}

	// Try display data
	if (factType === "BIRTH") {
		result.date = result.date || person.display?.birthDate;
		result.place = result.place || person.display?.birthPlace;
	} else if (factType === "DEATH") {
		result.date = result.date || person.display?.deathDate;
		result.place = result.place || person.display?.deathPlace;
	}

	return result.date || result.place ? result : null;
}

/**
 * Format a date for GEDCOM
 */
function formatDateForGedcom(date: Date): string {
	const months = [
		"JAN",
		"FEB",
		"MAR",
		"APR",
		"MAY",
		"JUN",
		"JUL",
		"AUG",
		"SEP",
		"OCT",
		"NOV",
		"DEC",
	];

	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
}

/**
 * Convert a FamilySearch fact to GEDCOM lines
 */
function convertFactToGedcom(fact: PersonFact): string[] {
	const lines: string[] = [];

	if (!fact.type) return lines;

	// Map FamilySearch fact types to GEDCOM tags
	const typeMap: Record<string, string> = {
		"http://gedcomx.org/Burial": "BURI",
		"http://gedcomx.org/Christening": "CHR",
		"http://gedcomx.org/Baptism": "BAPM",
		"http://gedcomx.org/Marriage": "MARR",
		"http://gedcomx.org/Divorce": "DIV",
		"http://gedcomx.org/Residence": "RESI",
		"http://gedcomx.org/Occupation": "OCCU",
		"http://gedcomx.org/Immigration": "IMMI",
		"http://gedcomx.org/Emigration": "EMIG",
		"http://gedcomx.org/Naturalization": "NATU",
		"http://gedcomx.org/Census": "CENS",
	};

	const gedcomTag = typeMap[fact.type] || "EVEN";

	// Special handling for occupation with value
	if (gedcomTag === "OCCU" && fact.value) {
		lines.push(`1 OCCU ${fact.value}`);
	} else {
		lines.push(`1 ${gedcomTag}`);
	}

	// Add FamilySearch link for this specific fact/event (conclusion link)
	if (fact.links?.conclusion?.href) {
		const webUrl = transformFamilySearchUrl(fact.links.conclusion.href);
		lines.push(`2 _FS_LINK ${webUrl}`);
	}

	// Add date
	if (fact.date?.formal || fact.date?.original) {
		lines.push(
			`2 DATE ${(fact.date?.formal || fact.date?.original)?.replace(/^(-|\+)/, "")}`
		);
	}

	// Add place
	if (fact.place?.original) {
		lines.push(`2 PLAC ${fact.place.original}`);
	}

	// Add value as note for non-occupation facts
	if (fact.value && gedcomTag !== "OCCU") {
		lines.push(`2 NOTE ${fact.value}`);
	}

	return lines;
}

/**
 * Options for GEDCOM conversion
 */
export interface GedcomConversionOptions {
	/** Tree name for the GEDCOM file header */
	treeName?: string;
	/** Include FamilySearch links in output */
	includeLinks?: boolean;
	/** Include notes in output */
	includeNotes?: boolean;

	/** FamilySearch environment (production, beta, integration) */
	environment?: "production" | "beta" | "integration";

	/** Allow orphan families (families not connected to root person) */
	allowOrphanFamilies?: boolean;

	/**
	 * Set of person IDs who are in the direct ancestry of the root person.
	 * These are the persons returned by the ancestry API before fullTree expansion.
	 * Used to determine which persons are "connectable" to the root person.
	 */
	ancestryPersonIds?: Set<string>;
}

/**
 * Convert FamilySearch pedigree data to GEDCOM format
 *
 * @param pedigreeData - Enhanced pedigree data from FamilySearch
 * @param options - Conversion options
 * @returns GEDCOM 5.5 formatted string
 *
 * @example
 * ```typescript
 * const pedigree = await fetchPedigree(sdk);
 * const gedcom = convertToGedcom(pedigree, { treeName: "My Family Tree" });
 * ```
 */
export function convertToGedcom(
	pedigreeData: EnhancedPedigreeData,
	options: GedcomConversionOptions = {}
): string {
	const {
		treeName = "FamilySearch Import",
		includeLinks = true,
		includeNotes = true,
		environment = "production",
	} = options;

	if (!pedigreeData || !pedigreeData.persons) {
		throw new Error("Invalid FamilySearch data: no persons found");
	}

	const lines: string[] = [];

	// GEDCOM Header
	lines.push("0 HEAD");
	lines.push("1 SOUR FamilySearch");
	lines.push("2 VERS 1.0");
	lines.push("2 NAME FamilySearch API");
	lines.push("1 DEST ANY");
	lines.push("1 DATE " + formatDateForGedcom(new Date()));
	lines.push("1 SUBM @SUBM1@");
	lines.push("1 FILE " + treeName);
	lines.push("1 GEDC");
	lines.push("2 VERS 5.5");
	lines.push("2 FORM LINEAGE-LINKED");
	lines.push("1 CHAR UTF-8");

	// Submitter record
	lines.push("0 @SUBM1@ SUBM");

	// ==============================================
	// COLLECT AND CREATE SOURCE RECORDS
	// ==============================================
	const sourceMap = new Map<string, SourceDescription>();
	let sourceCounter = 1;

	// Extract source descriptions from all persons
	pedigreeData.persons.forEach((person) => {
		const sourceDescriptions = person.fullDetails?.sourceDescriptions;

		if (sourceDescriptions && Array.isArray(sourceDescriptions)) {
			sourceDescriptions.forEach((source) => {
				if (source.id && !sourceMap.has(source.id)) {
					sourceMap.set(source.id, source);
				}
			});
		}
	});

	// Create GEDCOM SOUR records for each source
	sourceMap.forEach((source) => {
		const sourceId = `@S${sourceCounter++}@`;

		lines.push(`0 ${sourceId} SOUR`);

		// Add title (use titles[0] if available, otherwise default)
		const title = source.titles?.[0]?.value || "FamilySearch Source";
		lines.push(`1 TITL ${title}`);

		// Add citation as TEXT
		if (source.citations?.[0]?.value) {
			lines.push(`1 TEXT ${source.citations[0].value}`);
		}

		// Add web link if available
		if (source.about) {
			const webUrl = transformSourceUrl(source.about);
			lines.push(`1 WWW ${webUrl}`);
		}

		// Add resource type as NOTE
		if (source.resourceType) {
			lines.push(`1 NOTE Resource Type: ${source.resourceType}`);
		}
	});

	// ==============================================
	// STEP 1: BUILD PERSON ID MAPPING ONLY
	// Create GEDCOM IDs for all persons (for relationship processing)
	// INDI records will be created later after filtering
	// ==============================================
	const personIdMap = new Map<string, string>();
	pedigreeData.persons.forEach((person, index) => {
		const gedcomId = `@I${index + 1}@`;
		personIdMap.set(person.id, gedcomId);
	});

	// Build family data structures
	const families = new Map<
		string,
		{ spouses: Set<string>; children: string[] }
	>();
	const childToParents = new Map<string, string[]>();

	// ==============================================
	// COLLECT ALL RELATIONSHIPS (from pedigree AND person details)
	// ==============================================
	const allRelationships: Relationship[] = [
		...(pedigreeData.relationships || []),
	];

	// Extract relationships from person.fullDetails.relationships
	pedigreeData.persons.forEach((person) => {
		const personRelationships = person.fullDetails
			?.relationships as Relationship[];

		if (personRelationships && Array.isArray(personRelationships)) {
			personRelationships.forEach((rel) => {
				const exists = allRelationships.some((r) => r.id === rel.id);
				if (!exists) {
					allRelationships.push(rel);
				}
			});
		}

		// Extract childAndParentsRelationships and convert to standard format
		const childAndParentsRels = person.fullDetails
			?.childAndParentsRelationships as Array<{
			id: string;
			parent1?: { resourceId: string };
			parent2?: { resourceId: string };
			child?: { resourceId: string };
		}>;

		if (childAndParentsRels && Array.isArray(childAndParentsRels)) {
			childAndParentsRels.forEach((capRel) => {
				// Convert to ParentChild relationship format
				if (capRel.parent1 && capRel.child) {
					const rel: Relationship = {
						id: `${capRel.id}-p1`,
						type: "http://gedcomx.org/ParentChild",
						person1: { resourceId: capRel.parent1.resourceId },
						person2: { resourceId: capRel.child.resourceId },
						parent2: capRel.parent2
							? { resourceId: capRel.parent2.resourceId }
							: undefined,
					};

					const exists = allRelationships.some(
						(r) => r.id === rel.id
					);
					if (!exists) {
						allRelationships.push(rel);
					}
				}

				// If parent2 exists, also add relationship for parent2
				if (capRel.parent2 && capRel.child) {
					const rel: Relationship = {
						id: `${capRel.id}-p2`,
						type: "http://gedcomx.org/ParentChild",
						person1: { resourceId: capRel.parent2.resourceId },
						person2: { resourceId: capRel.child.resourceId },
						parent2: capRel.parent1
							? { resourceId: capRel.parent1.resourceId }
							: undefined,
					};

					const exists = allRelationships.some(
						(r) => r.id === rel.id
					);
					if (!exists) {
						allRelationships.push(rel);
					}
				}
			});
		}
	});

	// Create a Set of valid person IDs for fast lookup
	const validPersonIds = new Set(pedigreeData.persons.map((p) => p.id));

	// Process all relationships, filtering out invalid person IDs
	allRelationships.forEach((rel) => {
		if (rel.type?.includes("ParentChild")) {
			const parentId = rel.person1?.resourceId;
			const childId = rel.person2?.resourceId;
			const parent2Id = rel.parent2?.resourceId;

			// Validate all person IDs exist in dataset
			if (!parentId || !childId) {
				return;
			}

			// Skip if child doesn't exist in dataset
			if (!validPersonIds.has(childId)) {
				return;
			}

			// Filter parent IDs - only include parents who exist in dataset
			const validParents: string[] = [];
			if (validPersonIds.has(parentId)) {
				validParents.push(parentId);
			}
			if (parent2Id && validPersonIds.has(parent2Id)) {
				validParents.push(parent2Id);
			}

			// Only add relationship if at least one parent exists
			if (validParents.length > 0) {
				if (!childToParents.has(childId)) {
					childToParents.set(childId, []);
				}
				const parents = childToParents.get(childId)!;
				validParents.forEach((parentId) => {
					if (!parents.includes(parentId)) {
						parents.push(parentId);
					}
				});
			}
		} else if (rel.type?.includes("Couple")) {
			const person1 = rel.person1?.resourceId;
			const person2 = rel.person2?.resourceId;

			if (!person1 || !person2) {
				return;
			}

			// Only add couple if BOTH persons exist in dataset
			if (validPersonIds.has(person1) && validPersonIds.has(person2)) {
				const famKey = [person1, person2].sort().join("-");
				if (!families.has(famKey)) {
					families.set(famKey, {
						spouses: new Set([person1, person2]),
						children: [],
					});
				}
			}
		}
	});

	// Add children to their families
	childToParents.forEach((parents, childId) => {
		if (parents.length >= 2) {
			const famKey = parents.slice(0, 2).sort().join("-");
			if (!families.has(famKey)) {
				families.set(famKey, {
					spouses: new Set(parents.slice(0, 2)),
					children: [],
				});
			}
			families.get(famKey)!.children.push(childId);
		} else if (parents.length === 1) {
			const famKey = `single-${parents[0]}`;
			if (!families.has(famKey)) {
				families.set(famKey, {
					spouses: new Set([parents[0]]),
					children: [],
				});
			}
			families.get(famKey)!.children.push(childId);
		}
	});

	// Build set of persons who are "connectable" to the root person
	// A person is connectable if:
	// 1. They are in the direct ancestry (ancestryPersonIds)
	// 2. They are a spouse of someone in the ancestry
	// 3. They are a descendant of someone in the ancestry (recursive)
	// 4. They are a spouse of a descendant (recursive)
	const connectablePersons = new Set<string>();

	// If ancestryPersonIds is provided, use graph traversal
	// Otherwise, fall back to old logic (everyone in childToParents)
	if (options.ancestryPersonIds && options.ancestryPersonIds.size > 0) {
		// Step 1: Add all ancestry persons
		options.ancestryPersonIds.forEach((personId) => {
			connectablePersons.add(personId);
		});

		// Step 2: Add spouses of ancestry persons
		families.forEach((family) => {
			const spouses = Array.from(family.spouses);
			// If any spouse is in ancestry, add all spouses
			if (spouses.some((spouseId) => connectablePersons.has(spouseId))) {
				spouses.forEach((spouseId) => connectablePersons.add(spouseId));
			}
		});

		// Step 3: Recursively expand the graph DOWNWARD and SIDEWAYS only
		// Add: descendants + their spouses (NO upward traversal to parents)
		// Keep iterating until no new persons are added
		let addedNewPersons = true;
		while (addedNewPersons) {
			addedNewPersons = false;
			const beforeSize = connectablePersons.size;

			// 3a. Add children of connectable persons (downward traversal)
			childToParents.forEach((parents, childId) => {
				// If any parent is connectable, the child is connectable
				if (
					parents.some((parentId) => connectablePersons.has(parentId))
				) {
					if (!connectablePersons.has(childId)) {
						connectablePersons.add(childId);
						addedNewPersons = true;
					}
				}
			});

			// 3b. Add spouses of connectable persons (sideways traversal)
			families.forEach((family) => {
				const spouses = Array.from(family.spouses);
				const hasConnectableSpouse = spouses.some((spouseId) =>
					connectablePersons.has(spouseId)
				);
				const hasConnectableChild = family.children.some((childId) =>
					connectablePersons.has(childId)
				);

				// If any spouse OR child is connectable, add all spouses
				if (hasConnectableSpouse || hasConnectableChild) {
					spouses.forEach((spouseId) => {
						if (!connectablePersons.has(spouseId)) {
							connectablePersons.add(spouseId);
							addedNewPersons = true;
						}
					});
				}
			});

			const afterSize = connectablePersons.size;
			if (afterSize > beforeSize) {
				addedNewPersons = afterSize !== beforeSize;
			}
		}
	} else {
		// Fallback: old logic (everyone in parent-child relationships)
		childToParents.forEach((parents, childId) => {
			connectablePersons.add(childId);
			parents.forEach((parentId) => connectablePersons.add(parentId));
		});
	}

	// ==============================================
	// STEP 4: DETECT ORPHAN FAMILIES AND BUILD PERSON-TO-FAMILY MAPPING
	// Identify which families are orphan (disconnected from ancestry)
	// ==============================================
	const allowOrphanFamilies = options.allowOrphanFamilies === true; // Default to false
	const orphanFamKeys = new Set<string>(); // Keys of families that are orphan

	// Build a map from personId to all their FAM keys (as spouse or child)
	const personToFamKeys = new Map<string, Set<string>>();
	families.forEach((family, key) => {
		const spouseArray = Array.from(family.spouses);

		// Check if this is an orphan family
		const anyMemberConnectable =
			spouseArray.some((spouseId) => connectablePersons.has(spouseId)) ||
			family.children.some((childId) => connectablePersons.has(childId));

		const isOrphanFamily = !anyMemberConnectable;

		// Track orphan family keys
		if (isOrphanFamily) {
			orphanFamKeys.add(key);
		}

		// Map each person to their families
		spouseArray.forEach((spouseId) => {
			if (!personToFamKeys.has(spouseId))
				personToFamKeys.set(spouseId, new Set());
			personToFamKeys.get(spouseId)!.add(key);
		});
		family.children.forEach((childId) => {
			if (!personToFamKeys.has(childId))
				personToFamKeys.set(childId, new Set());
			personToFamKeys.get(childId)!.add(key);
		});
	});

	// ==============================================
	// STEP 5: CREATE INDI RECORDS (WITH ORPHAN FILTERING)
	// ==============================================

	pedigreeData.persons.forEach((person) => {
		const gedcomId = personIdMap.get(person.id);
		if (!gedcomId) {
			// eslint-disable-next-line no-console
			console.warn(
				`[GEDCOM] Person ${person.id} not found in personIdMap`
			);
			return;
		}

		// ==============================================
		// ORPHAN PERSON FILTERING
		// If allowOrphanFamilies=false, skip persons who are ONLY in orphan families
		// ==============================================
		if (!allowOrphanFamilies) {
			const famKeys = personToFamKeys.get(person.id);
			// If person belongs to families, check if ALL of them are orphan families
			if (
				famKeys &&
				famKeys.size > 0 &&
				Array.from(famKeys).every((key) => orphanFamKeys.has(key))
			) {
				return; // Skip this orphan person
			}
		}

		lines.push(`0 ${gedcomId} INDI`);

		// Add FamilySearch ID tag
		if (person.id) {
			lines.push(`1 _FS_ID ${person.id}`);
		}

		// Add FamilySearch link for this person
		if (includeLinks) {
			const personLink =
				person.links?.person?.href ||
				person.identifiers?.["http://gedcomx.org/Persistent"]?.[0];

			if (personLink) {
				const webUrl = transformFamilySearchUrl(personLink);
				lines.push(`1 _FS_LINK ${webUrl}`);
			} else if (person.id) {
				// Fallback: construct web URL from person ID if no link provided
				let baseUrl = "https://www.familysearch.org";
				if (environment === "beta") {
					baseUrl = "https://beta.familysearch.org";
				} else if (environment === "integration") {
					baseUrl = "https://integration.familysearch.org";
				}
				const webUrl = `${baseUrl}/tree/person/${person.id}`;
				lines.push(`1 _FS_LINK ${webUrl}`);
			}
		}

		// Extract from fullDetails if available, otherwise use basic person data
		const personData = person.fullDetails?.persons?.[0] || person;

		// Name
		const name = extractName(personData);
		if (name) {
			lines.push(`1 NAME ${name}`);
		}

		// Gender
		const gender = extractGender(personData);
		if (gender) {
			lines.push(`1 SEX ${gender}`);
		}

		// Birth
		const birth = extractFact(personData, "BIRTH");
		if (birth) {
			lines.push("1 BIRT");
			if (birth.date) {
				lines.push(`2 DATE ${birth.date}`);
			}
			if (birth.place) {
				lines.push(`2 PLAC ${birth.place}`);
			}
		}

		// Death
		const death = extractFact(personData, "DEATH");
		if (death) {
			lines.push("1 DEAT");
			if (death.date) {
				lines.push(`2 DATE ${death.date}`);
			}
			if (death.place) {
				lines.push(`2 PLAC ${death.place}`);
			}
		}

		// Add all other facts from fullDetails
		personData.facts?.forEach((fact) => {
			if (
				fact.type &&
				fact.type !== "http://gedcomx.org/Birth" &&
				fact.type !== "http://gedcomx.org/Death"
			) {
				const factLines = convertFactToGedcom(fact);
				factLines.forEach((line) => lines.push(line));
			}
		});

		// Add notes
		if (includeNotes && person.notes?.persons?.[0]?.notes) {
			person.notes.persons[0].notes.forEach((note) => {
				if (note.text) {
					const noteText = note.text.replace(/\n/g, " ");
					lines.push(`1 NOTE ${noteText}`);
				}
			});
		}

		// ==============================================
		// ADD SOURCE CITATIONS TO PERSON
		// ==============================================
		const personSources = (
			personData as PersonData & { sources?: SourceReference[] }
		)?.sources;

		if (personSources && Array.isArray(personSources)) {
			personSources.forEach((sourceRef) => {
				const sourceId = sourceRef.descriptionId;
				if (!sourceId) return;

				// Find source index
				const sourceIds = Array.from(sourceMap.keys());
				const sourceIndex = sourceIds.indexOf(sourceId);
				if (sourceIndex === -1) return;

				const gedcomSourceId = `@S${sourceIndex + 1}@`;
				lines.push(`1 SOUR ${gedcomSourceId}`);

				// Add qualifiers as notes
				if (
					sourceRef.qualifiers &&
					Array.isArray(sourceRef.qualifiers)
				) {
					sourceRef.qualifiers.forEach((qualifier) => {
						if (qualifier.name && qualifier.value) {
							lines.push(
								`2 NOTE ${qualifier.name}: ${qualifier.value}`
							);
						}
					});
				}
			});
		}
	});

	// ==============================================
	// STEP 6: CREATE FAM RECORDS (WITH ORPHAN FILTERING)
	// ==============================================

	// Create FAM records
	let famIndex = 1;
	const familyIdMap = new Map<string, string>();

	families.forEach((family, key) => {
		// ==============================================
		// INVALID FAM RECORD PREVENTION
		// ==============================================

		// Check if parents exist in personIdMap
		const spouseArray = Array.from(family.spouses);
		const parentsInMap = spouseArray.filter((id) => personIdMap.has(id));

		const hasNoParents = parentsInMap.length === 0;
		const hasSingleParentNoChildren =
			parentsInMap.length === 1 && family.children.length === 0;

		// Skip invalid FAM records
		if (hasNoParents) {
			// Orphaned child - no parents exist in dataset
			if (family.children.length > 0) {
				// eslint-disable-next-line no-console
				console.warn(
					`[FS SDK GEDCOM] Skipping FAM for orphaned child(ren): ${family.children.length} child(ren) with 0 parents`
				);
			}
			return; // Skip this FAM record
		}

		if (hasSingleParentNoChildren) {
			// Single spouse with no children and no other spouse
			// This is an orphaned single-spouse family (invalid per GEDCOM 5.5)
			return; // Skip this FAM record
		}

		// Check if this is an orphan family
		// Family is orphan if NO members (neither spouses NOR children) are connectable to root person
		// This means the family is isolated and doesn't connect to the ancestry tree
		const anyMemberConnectable =
			spouseArray.some((spouseId) => connectablePersons.has(spouseId)) ||
			family.children.some((childId) => connectablePersons.has(childId));

		const isOrphanFamily = !anyMemberConnectable;

		// If orphan families are NOT allowed, skip them entirely
		if (isOrphanFamily && !allowOrphanFamilies) {
			return; // Skip this family - no FAM record created
		}

		const famId = `@F${famIndex++}@`;
		familyIdMap.set(key, famId);

		lines.push(`0 ${famId} FAM`);

		// Add _IS_ORPHAN_FAMILY tag if this is an orphan family (and allowed)
		if (isOrphanFamily && allowOrphanFamilies) {
			lines.push(`1 _IS_ORPHAN_FAMILY Y`);
		}

		if (spouseArray.length === 2) {
			const [person1, person2] = spouseArray;
			const person1Data = pedigreeData.persons?.find(
				(p) => p.id === person1
			);
			const person2Data = pedigreeData.persons?.find(
				(p) => p.id === person2
			);

			const gender1 = extractGender(
				person1Data?.fullDetails?.persons?.[0] || person1Data
			);
			const gender2 = extractGender(
				person2Data?.fullDetails?.persons?.[0] || person2Data
			);

			const p1 = personIdMap.get(person1);
			const p2 = personIdMap.get(person2);
			if (gender1 === "M" || gender2 === "F") {
				if (p1) lines.push(`1 HUSB ${p1}`);
				if (p2) lines.push(`1 WIFE ${p2}`);
			} else {
				if (p2) lines.push(`1 HUSB ${p2}`);
				if (p1) lines.push(`1 WIFE ${p1}`);
			}

			// Add marriage facts
			addMarriageFacts(lines, allRelationships, person1, person2);
		} else if (spouseArray.length === 1) {
			const parentData = pedigreeData.persons?.find(
				(p) => p.id === spouseArray[0]
			);
			const gender = extractGender(
				parentData?.fullDetails?.persons?.[0] || parentData
			);

			if (gender === "M") {
				lines.push(`1 HUSB ${personIdMap.get(spouseArray[0])}`);
			} else {
				lines.push(`1 WIFE ${personIdMap.get(spouseArray[0])}`);
			}
		}

		// Add children
		family.children.forEach((childId) => {
			const childGedcomId = personIdMap.get(childId);
			if (childGedcomId) {
				lines.push(`1 CHIL ${childGedcomId}`);
			}
		});
	});

	// Add FAMC links to individuals
	childToParents.forEach((parents, childId) => {
		const childGedcomId = personIdMap.get(childId);
		if (!childGedcomId) return;

		let famId: string | undefined;
		if (parents.length >= 2) {
			const famKey = parents.slice(0, 2).sort().join("-");
			famId = familyIdMap.get(famKey);
		} else if (parents.length === 1) {
			const famKey = `single-${parents[0]}`;
			famId = familyIdMap.get(famKey);
		}

		if (famId) {
			const indiRecordIndex = lines.findIndex(
				(line) => line === `0 ${childGedcomId} INDI`
			);
			if (indiRecordIndex !== -1) {
				lines.splice(indiRecordIndex + 1, 0, `1 FAMC ${famId}`);
			}
		}
	});

	// Add FAMS links to individuals
	families.forEach((family, key) => {
		const famId = familyIdMap.get(key);
		if (!famId) return;

		family.spouses.forEach((spouseId) => {
			const spouseGedcomId = personIdMap.get(spouseId);
			if (!spouseGedcomId) return;

			const indiRecordIndex = lines.findIndex(
				(line) => line === `0 ${spouseGedcomId} INDI`
			);
			if (indiRecordIndex !== -1) {
				let insertIndex = indiRecordIndex + 1;
				while (
					insertIndex < lines.length &&
					lines[insertIndex].startsWith("1 FAMC")
				) {
					insertIndex++;
				}
				lines.splice(insertIndex, 0, `1 FAMS ${famId}`);
			}
		});
	});

	// Final validation: Check for orphaned persons (not in any family)
	const personsInFamilies = new Set<string>();
	families.forEach((family) => {
		family.spouses.forEach((id) => personsInFamilies.add(id));
		family.children.forEach((id) => personsInFamilies.add(id));
	});

	// GEDCOM Trailer
	lines.push("0 TRLR");

	return lines.join("\n");
}

/**
 * Helper to add marriage facts to FAM record
 */
function addMarriageFacts(
	lines: string[],
	relationships: Relationship[],
	person1: string,
	person2: string
): void {
	const relKey = [person1, person2].sort().join("-");

	const rel = relationships.find((r) => {
		const a = r.person1?.resourceId || r.person1?.resource?.resourceId;
		const b = r.person2?.resourceId || r.person2?.resource?.resourceId;
		if (!a || !b) return false;
		return [a, b].sort().join("-") === relKey;
	});

	if (!rel) return;

	const marriageFacts: PersonFact[] = [];

	// Check facts directly on relationship
	if (rel.facts && Array.isArray(rel.facts)) {
		rel.facts.forEach((f) => {
			if (f.type?.includes("Marriage")) {
				marriageFacts.push(f);
			}
		});
	}

	// Check details.facts
	if (rel.details?.facts && Array.isArray(rel.details.facts)) {
		marriageFacts.push(
			...rel.details.facts.filter((f) => f.type?.includes("Marriage"))
		);
	}

	// Check details.persons[].facts
	if (rel.details?.persons && Array.isArray(rel.details.persons)) {
		rel.details.persons.forEach((p) => {
			if (p.facts && Array.isArray(p.facts)) {
				p.facts.forEach((f) => {
					if (f.type?.includes("Marriage")) {
						marriageFacts.push(f);
					}
				});
			}
		});
	}

	// Add marriage facts to FAM record
	marriageFacts.forEach((mf) => {
		const factLines = convertFactToGedcom(mf);
		factLines.forEach((line) => lines.push(line));
	});
}

// Alias for backwards compatibility
export const convertFamilySearchToGedcom = convertToGedcom;
