/**
 * FamilySearch to GEDCOM Converter
 *
 * Converts FamilySearch API responses into GEDCOM 5.5 format
 */

import type {
	EnhancedPedigreeData,
	EnhancedPerson,
	PersonData,
	PersonFact,
	Relationship,
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

	// Add FamilySearch link for this fact
	if (fact.links?.conclusion?.href) {
		const webUrl = transformFamilySearchUrl(fact.links.conclusion.href);
		lines.push(`2 _FS_LINK ${webUrl}`);
	} else if (fact.links?.person?.href) {
		const webUrl = transformFamilySearchUrl(fact.links.person.href);
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
	lines.push("1 NAME FamilySearch User");

	// Convert persons to INDI records
	const personIdMap = new Map<string, string>();

	pedigreeData.persons.forEach((person, index) => {
		const gedcomId = `@I${index + 1}@`;
		personIdMap.set(person.id, gedcomId);

		lines.push(`0 ${gedcomId} INDI`);

		// Add FamilySearch link for this person
		if (includeLinks) {
			const personLink =
				person.links?.person?.href ||
				person.identifiers?.["http://gedcomx.org/Persistent"]?.[0];
			if (personLink) {
				const webUrl = transformFamilySearchUrl(personLink);
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
	});

	// Build family data structures
	const families = new Map<
		string,
		{ spouses: Set<string>; children: string[] }
	>();
	const childToParents = new Map<string, string[]>();

	pedigreeData.relationships?.forEach((rel) => {
		if (rel.type?.includes("ParentChild")) {
			const parentId = rel.person1?.resourceId;
			const childId = rel.person2?.resourceId;
			const parent2Id = rel.parent2?.resourceId;

			if (parentId && childId) {
				if (!childToParents.has(childId)) {
					childToParents.set(childId, []);
				}
				const parents = childToParents.get(childId)!;
				if (!parents.includes(parentId)) {
					parents.push(parentId);
				}
				if (parent2Id && !parents.includes(parent2Id)) {
					parents.push(parent2Id);
				}
			}
		} else if (rel.type?.includes("Couple")) {
			const person1 = rel.person1?.resourceId;
			const person2 = rel.person2?.resourceId;

			if (person1 && person2) {
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

	// Create FAM records
	let famIndex = 1;
	const familyIdMap = new Map<string, string>();

	families.forEach((family, key) => {
		const famId = `@F${famIndex++}@`;
		familyIdMap.set(key, famId);

		lines.push(`0 ${famId} FAM`);

		const spouseArray = Array.from(family.spouses);

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
			addMarriageFacts(lines, pedigreeData.relationships || [], person1, person2);
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
		const a = r.person1?.resourceId;
		const b = r.person2?.resourceId;
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
