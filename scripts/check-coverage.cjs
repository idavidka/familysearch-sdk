#!/usr/bin/env node

/**
 * FamilySearch SDK Coverage Checker
 *
 * Compares documented API endpoints with SDK implementation
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("FamilySearch SDK Coverage Checker");
console.log("=================================\n");

// Step 1: Run endpoint analyzer to get all documented endpoints
console.log("📊 Analyzing documented endpoints...");
execSync("node scripts/analyze-endpoints.cjs", { stdio: "inherit" });

// Step 2: Get list of SDK implemented functions
console.log("\n📦 Extracting SDK implemented functions...");
const sdkFunctions = execSync(
	"grep -r \"^export.*function\" src/api --include=\"*.ts\" | sed 's/.*function //' | sed 's/(.*$//' | sort | uniq",
	{ encoding: "utf-8" }
)
	.trim()
	.split("\n");

console.log(`Found ${sdkFunctions.length} SDK functions\n`);

// Step 3: Load endpoint analysis
const endpointsFile = "api-docs-cache/endpoints.json";
if (!fs.existsSync(endpointsFile)) {
	console.error("ERROR: Run analyze-endpoints first!");
	process.exit(1);
}

const endpointsData = JSON.parse(fs.readFileSync(endpointsFile, "utf-8"));

// Step 4: Create mapping of endpoint names to common function names
const endpointToFunction = (endpoint) => {
	const name = endpoint.toLowerCase();

	// Comprehensive manual mappings from SETUP_FOR_TOMORROW.md
	const mappings = {
		// Genealogies API
		readgenealogiesperson: "readGenealogyPerson",
		readgenealogiespersons: "readGenealogyPersons",
		creategenealogiesperson: "createGenealogyPerson",
		updategenealogiesperson: "updateGenealogyPerson",
		deletegenealogiesperson: "deleteGenealogyPerson",
		restoregenealogiesperson: "restoreGenealogyPerson",
		readgenealogiesrelationship: "readGenealogyRelationship",
		updategenealogiesrelationship: "updateGenealogyRelationship",
		deletegenealogiesrelationship: "deleteGenealogyRelationship",
		readgenealogysourcedescription: "readGenealogySourceDescription",
		creategenealogysourcedescription: "createGenealogySourceDescription",
		updategenealogysourcedescription: "updateGenealogySourceDescription",
		deletegenealogysourcedescription: "deleteGenealogySourceDescription",
		readgenealogytree: "readGenealogyTree",
		readgenealogytrees: "readGenealogyTrees",
		creategenealogytree: "createGenealogyTree",
		updategenealogytree: "updateGenealogyTree",
		deletegenealogytree: "deleteGenealogyTree",
		readgenealogiesnote: "readGenealogyNote",
		updategenealogiestree: "updateGenealogyTree",
		deletegenealogiesconclusion: "deleteGenealogyConclusion",
		readgenealogiesbulkmatch: "readGenealogyBulkMatch",
		readgenealogiespersonmatches: "readGenealogyPersonMatches",
		readgenealogiestree: "readGenealogyTree",
		deletegenealogiestree: "deleteGenealogyTree",
		readgenealogiestrees: "readGenealogyTrees",
		creategenealogiestree: "createGenealogyTree",
		readgenealogiessourcedescription: "readGenealogySourceDescription",
		updategenealogiessourcedescription: "updateGenealogySourceDescription",
		deletegenealogiessourcedescription: "deleteGenealogySourceDescription",
		creategenealogiessourcedescription: "createGenealogySourceDescription",

		// Current User / Tree
		readcurrenttreeperson: "readCurrentUser",
		readcurrentuser: "readCurrentUser",
		readagent: "readAgent",

		// Person APIs
		readperson: "readPerson",
		readpersons: "readPersons",
		createperson: "createPerson",
		updateperson: "updatePerson",
		deleteperson: "deletePerson",
		restoreperson: "restorePerson",
		readpersonchildren: "readPersonChildren",
		readpersonfamilies: "readPersonFamilies",
		readpersonparents: "readPersonParents",
		readpersonspouses: "readPersonSpouses",
		readpersonchangehistory: "readPersonChangeHistory",
		readpersonmerge: "readPersonMerge",
		readpersonnotamatches: "readPersonNotAMatches",
		deletepersonnotamatch: "deletePersonNotAMatch",
		readpersonnote: "readPersonNote",
		readpersonnotes: "readPersonNotes",
		readpersonsources: "readPersonSources",
		readpersonportrait: "readPersonPortrait",
		readpersonportraits: "readPersonPortraits",

		// Relationships
		readrelationship: "readRelationship",
		readrelationships: "readRelationships",
		createrelationship: "createRelationship",
		updaterelationship: "updateRelationship",
		deleterelationship: "deleteRelationship",
		restorerelationship: "restoreRelationship",
		readchildandparentsrelationship: "readChildAndParentsRelationship",
		readchildandparentrelationship:
			"readChildAndParentsRelationshipChangeHistory",
		createchildandparentsrelationship: "createChildAndParentsRelationship",
		updatechildandparentsrelationship: "updateChildAndParentsRelationship",
		deletechildandparentsrelationship: "deleteChildAndParentsRelationship",
		readcouplerelationship: "readCoupleRelationship",
		createcouplerelationship: "createCoupleRelationship",
		updatecouplerelationship: "updateCoupleRelationship",
		deletecouplerelationship: "deleteCoupleRelationship",
		updatechildandparentsrelationshipparentsorder: "setParentOrder",
		updatecouplerelationshipspousesorder: "setSpouseOrder",
		restorechildandparentsrelationshipchange: "restoreChange",
		restorecouplerelationshipchange: "restoreChange",

		// Sources
		readsourcedescription: "readSourceDescription",
		createsourcedescription: "createSourceDescription",
		updatesourcedescription: "updateSourceDescription",
		deletesourcedescription: "deleteSourceDescription",
		readuserdefinedcollectionsourcedescriptions:
			"readCollectionSourceDescriptions",
		deletesourcedescriptionsfromcollections: "removeSourcesFromCollection",
		updatesourcedescriptionstocollection: "addSourcesToCollection",
		attachsource: "attachSource",
		detachsource: "detachSource",
		updatesourceattachment: "updateSourceAttachment",

		// Places
		standardizedate: "normalizeDate",
		readplaces: "readPlaces",
		readplace: "readPlaceDetails",
		searchforparentplaces: "searchParentPlaces",

		// Memories
		readmemory: "readMemory",
		readmemories: "readMemories",
		creatememory: "createMemory",
		updatememory: "updateMemory",
		deletememory: "deleteMemory",

		// Discussions
		readdiscussion: "readDiscussion",
		creatediscussion: "createDiscussion",
		updatediscussion: "updateDiscussion",
		deletediscussion: "deleteDiscussion",
		readcomments: "readDiscussionComments",
		updatecomments: "addDiscussionComment",
		deletecomment: "deleteDiscussionComment",
		creatememorycomments: "createMemoryComment",
		readmemorycomments: "readMemoryComments",
		deletememorycomment: "deleteMemoryComment",

		// Vocabularies & Standards
		readvocabulary: "readVocabulary",
		readvocabularies: "readVocabularies",
		readname: "readNameType",
		readnames: "readNameTypes",
		readvocabconceptssearch: "readVocabConceptsSearch",
		readvocabconceptv2: "readVocabConceptV2",

		// Places - Additional endpoints
		readplaceattributes: "readPlaceAttributes",
		readplacedescriptionwithrelated: "readPlaceDescriptionWithRelated",
		readplacedescriptionsgroup: "readPlaceDescriptionsGroup",

		// Matches
		readtreematches: "readTreeMatches",

		// Trees
		readtree: "readTree",
		deletetree: "deleteTree",
		createtree: "createTree",
		readtreechanges: "readTreeChanges",
	};

	if (mappings[name]) return mappings[name];

	// Helper function to convert to proper camelCase
	const toCamelCase = (str) => {
		// Common word patterns in FamilySearch API (longest words first to match greedily)
		const patterns = [
			"relationship",
			"tree",
			"comments",
			"relationships",
			"description",
			"descriptions",
			"genealogies",
			"genealogy",
			"modifications",
			"collection",
			"collections",
			"discussion",
			"discussions",
			"children",
			"families",
			"parents",
			"spouses",
			"sources",
			"portraits",
			"notes",
			"memories",
			"matches",
			"personas",
			"attributes",
			"headers",
			"changes",
			"persons",
			"person",
			"source",
			"tree",
			"match",
			"memory",
			"portrait",
			"note",
			"comment",
			"spouse",
			"parent",
			"child",
			"couple",
			"reference",
			"conclusion",
			"change",
			"history",
			"merge",
			"restore",
			"artifact",
			"coverage",
			"folder",
			"group",
			"user",
			"defined",
			"current",
			"allow",
			"perform",
			"search",
			"research",
			"attribute",
			"related",
			"pending",
			"preferred",
			"order",
			"gedcomx",
			"bulk",
			"not",
			"and",
			"head",
			"from",
			"to",
			"by",
			"example",
			"a",
			"the",
			"with",
			"for",
			"of",
			"in",
		];

		// Create regex pattern - sort by length descending for greedy matching
		const sortedPatterns = patterns.sort((a, b) => b.length - a.length);
		const pattern = new RegExp(`(${sortedPatterns.join("|")})`, "gi");

		// Split by word boundaries and capitalize each word
		let result = "";
		let lastIndex = 0;
		let match;

		const regex = new RegExp(pattern);
		while ((match = regex.exec(str)) !== null) {
			// Add any characters before the match (shouldn't happen in clean input)
			if (match.index > lastIndex) {
				const between = str.substring(lastIndex, match.index);
				result +=
					between.charAt(0).toUpperCase() +
					between.slice(1).toLowerCase();
			}
			// Capitalize the matched word
			result +=
				match[0].charAt(0).toUpperCase() +
				match[0].slice(1).toLowerCase();
			lastIndex = regex.lastIndex;
		}

		// Add any remaining characters
		if (lastIndex < str.length) {
			const remaining = str.substring(lastIndex);
			result +=
				remaining.charAt(0).toUpperCase() +
				remaining.slice(1).toLowerCase();
		}

		return result;
	};

	// Generic patterns - improved camelCase conversion
	if (name.startsWith("read")) {
		const remainder = name.substring(4);
		return "read" + toCamelCase(remainder);
	}
	if (name.startsWith("create")) {
		const remainder = name.substring(6);
		return "create" + toCamelCase(remainder);
	}
	if (name.startsWith("update")) {
		const remainder = name.substring(6);
		return "update" + toCamelCase(remainder);
	}
	if (name.startsWith("delete")) {
		const remainder = name.substring(6);
		return "delete" + toCamelCase(remainder);
	}
	if (name.startsWith("restore")) {
		const remainder = name.substring(7);
		return "restore" + toCamelCase(remainder);
	}
	if (name.startsWith("attach")) {
		const remainder = name.substring(6);
		return "attach" + toCamelCase(remainder);
	}
	if (name.startsWith("detach")) {
		const remainder = name.substring(6);
		return "detach" + toCamelCase(remainder);
	}
	if (name.startsWith("allow")) {
		const remainder = name.substring(5);
		return "allow" + toCamelCase(remainder);
	}
	if (name.startsWith("perform")) {
		const remainder = name.substring(7);
		return "perform" + toCamelCase(remainder);
	}
	if (name.startsWith("search")) {
		const remainder = name.substring(6);
		return "search" + toCamelCase(remainder);
	}
	if (name.startsWith("merge")) {
		const remainder = name.substring(5);
		return "merge" + toCamelCase(remainder);
	}
	if (name.startsWith("check")) {
		const remainder = name.substring(5);
		return "check" + toCamelCase(remainder);
	}
	if (name.startsWith("find")) {
		const remainder = name.substring(4);
		return "find" + toCamelCase(remainder);
	}
	if (name.startsWith("get")) {
		const remainder = name.substring(3);
		return "get" + toCamelCase(remainder);
	}
	if (name.startsWith("set")) {
		const remainder = name.substring(3);
		return "set" + toCamelCase(remainder);
	}
	if (name.startsWith("head")) {
		const remainder = name.substring(4);
		return "head" + toCamelCase(remainder);
	}

	// Default - use toCamelCase for any remaining cases
	return toCamelCase(endpoint);
};

// Step 5: Check coverage
const results = {
	implemented: [],
	missing: [],
	uncertain: [],
};

let totalEndpoints = 0;

Object.keys(endpointsData.categories).forEach((category) => {
	endpointsData.categories[category].endpoints.forEach((ep) => {
		totalEndpoints++;
		const expectedFunc = endpointToFunction(ep.name);
		const found = sdkFunctions.some(
			(f) =>
				f.toLowerCase() === expectedFunc.toLowerCase() ||
				f.toLowerCase().includes(ep.name.toLowerCase().substring(4)) // Skip 'read/get/create/update/delete'
		);

		if (found) {
			results.implemented.push({
				endpoint: ep.name,
				category,
				method: ep.method,
			});
		} else {
			// Check if it's a HEAD request or other rare method
			if (ep.method === "HEAD" || ep.name.includes("header")) {
				results.uncertain.push({
					endpoint: ep.name,
					category,
					method: ep.method,
					reason: "HEAD request - rarely needed",
				});
			} else {
				results.missing.push({
					endpoint: ep.name,
					category,
					method: ep.method,
					expected: expectedFunc,
				});
			}
		}
	});
});

// Step 6: Generate report
console.log("\n=================================");
console.log("COVERAGE REPORT");
console.log("=================================\n");

console.log(`Total Documented Endpoints: ${totalEndpoints}`);
console.log(
	`Implemented: ${results.implemented.length} (${Math.round((results.implemented.length / totalEndpoints) * 100)}%)`
);
console.log(`Missing: ${results.missing.length}`);
console.log(`Uncertain (HEAD/rare): ${results.uncertain.length}\n`);

// Group missing by category
const missingByCategory = {};
results.missing.forEach((item) => {
	if (!missingByCategory[item.category]) {
		missingByCategory[item.category] = [];
	}
	missingByCategory[item.category].push(item);
});

console.log("MISSING ENDPOINTS BY CATEGORY:");
console.log("==============================\n");

Object.keys(missingByCategory)
	.sort()
	.forEach((cat) => {
		console.log(`${cat} (${missingByCategory[cat].length} missing):`);
		missingByCategory[cat].forEach((item) => {
			console.log(
				`  ❌ ${item.method} ${item.endpoint} → Expected: ${item.expected}()`
			);
		});
		console.log("");
	});

// Save detailed report
const reportFile = "api-docs-cache/coverage-report.json";
fs.writeFileSync(
	reportFile,
	JSON.stringify(
		{
			summary: {
				total: totalEndpoints,
				implemented: results.implemented.length,
				missing: results.missing.length,
				uncertain: results.uncertain.length,
				coverage: Math.round(
					(results.implemented.length / totalEndpoints) * 100
				),
			},
			implemented: results.implemented,
			missing: results.missing,
			uncertain: results.uncertain,
			generatedAt: new Date().toISOString(),
		},
		null,
		2
	),
	"utf-8"
);

console.log(`\nDetailed report saved to: ${reportFile}\n`);
