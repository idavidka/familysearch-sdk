#!/usr/bin/env node

/**
 * Comprehensive API Analysis and Implementation Generator
 *
 * This script:
 * 1. Reads all HTML documentation files
 * 2. Extracts endpoint details (method, params, response)
 * 3. Checks existing implementation
 * 4. Generates missing implementations
 * 5. Creates detailed report
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { JSDOM } = require("jsdom");

// Paths
const DOCS_DIR = path.join(__dirname, "../api-docs-cache");
const SRC_DIR = path.join(__dirname, "../src");
const REPORT_FILE = path.join(__dirname, "../API_ANALYSIS_REPORT.md");

// Statistics
const stats = {
	totalEndpoints: 0,
	implemented: 0,
	missing: 0,
	needsUpdate: 0,
	notApplicable: 0,
};

// Detailed analysis results
const analysis = [];

/**
 * Parse HTML documentation to extract endpoint details
 */
function parseEndpointDoc(htmlContent, endpointName) {
	try {
		const dom = new JSDOM(htmlContent);
		const doc = dom.window.document;

		// Extract title
		const titleEl = doc.querySelector("h1");
		const title = titleEl ? titleEl.textContent.trim() : endpointName;

		// Extract HTTP method
		const methodEl = doc.querySelector(".APIMethod, .rm-APIMethod");
		const method = methodEl
			? methodEl.textContent.trim().toUpperCase()
			: "GET";

		// Extract URL
		const urlEl = doc.querySelector("[data-testid='serverurl']");
		let url = "";
		if (urlEl) {
			url = urlEl.textContent.replace(/\s+/g, "");
		}

		// Extract description
		const descEl = doc.querySelector(".markdown-body p, .rm-Markdown p");
		const description = descEl ? descEl.textContent.trim() : "";

		// Extract query parameters
		const queryParams = [];
		const paramElements = doc.querySelectorAll(
			"#query-params ~ * .Param-name, [id^='query-'] .Param-name"
		);
		paramElements.forEach((el) => {
			const name = el.textContent.trim();
			const parent = el.closest(".form-group, .Param");
			const required = parent
				? parent.querySelector(".Param-required") !== null
				: false;
			const typeEl = parent ? parent.querySelector(".Param-type") : null;
			const type = typeEl ? typeEl.textContent.trim() : "string";

			if (name && !queryParams.find((p) => p.name === name)) {
				queryParams.push({ name, type, required });
			}
		});

		// Extract path parameters from URL
		const pathParams = [];
		const pathParamMatches = url.match(/\{([^}]+)\}/g);
		if (pathParamMatches) {
			pathParamMatches.forEach((match) => {
				const name = match.replace(/[{}]/g, "");
				pathParams.push({ name, type: "string", required: true });
			});
		}

		// Extract response codes
		const responses = [];
		const responseElements = doc.querySelectorAll(
			".HTTPStatus-chit, .APIResponseSchemaPicker-label-text"
		);
		responseElements.forEach((el) => {
			const code = el.getAttribute("aria-label") || el.textContent.trim();
			if (code && /^\d+$/.test(code)) {
				responses.push(parseInt(code));
			}
		});

		return {
			name: endpointName,
			title,
			method,
			url,
			description,
			pathParams,
			queryParams,
			responses: [...new Set(responses)].sort(),
		};
	} catch (error) {
		console.error(`Error parsing ${endpointName}:`, error.message);
		return null;
	}
}

/**
 * Check if endpoint is implemented
 */
function checkImplementation(endpointName) {
	const name = endpointName.toLowerCase();

	// Comprehensive manual mappings from check-coverage.cjs
	const mappings = {
		// OAuth
		getauthorizationpage: "buildAuthorizationUrl",
		getaccesstoken: "exchangeCodeForToken",

		// Genealogies API
		readgenealogiesperson: "getGenealogyPerson",
		readgenealogiespersons: "getGenealogyPersons",
		creategenealogiesperson: "createGenealogyPerson",
		updategenealogiesperson: "updateGenealogyPerson",
		deletegenealogiesperson: "deleteGenealogyPerson",
		restoregenealogiesperson: "restoreGenealogyPerson",
		readgenealogiesrelationship: "getGenealogyRelationship",
		updategenealogiesrelationship: "updateGenealogyRelationship",
		deletegenealogiesrelationship: "deleteGenealogyRelationship",
		readgenealogysourcedescription: "getGenealogySourceDescription",
		creategenealogysourcedescription: "createGenealogySourceDescription",
		updategenealogysourcedescription: "updateGenealogySourceDescription",
		deletegenealogysourcedescription: "deleteGenealogySourceDescription",
		readgenealogytree: "getGenealogyTree",
		readgenealogytrees: "getGenealogyTrees",
		creategenealogytree: "createGenealogyTree",
		updategenealogytree: "updateGenealogyTree",
		deletegenealogytree: "deleteGenealogyTree",

		// Current User / Tree
		readcurrenttreeperson: "getCurrentUser",
		readcurrentuser: "getCurrentUser",
		readagent: "getAgent",

		// Person APIs
		readperson: "getPerson",
		readpersons: "getPersons",
		createperson: "createPerson",
		updateperson: "updatePerson",
		deleteperson: "deletePerson",
		restoreperson: "restorePerson",
		readpersonchildren: "getPersonChildren",
		readpersonfamilies: "getPersonFamilies",
		readpersonparents: "getPersonParents",
		readpersonspouses: "getPersonSpouses",
		readpersonchangehistory: "getPersonChangeHistory",
		readpersonmerge: "getPersonMerge",
		readpersonnotamatches: "getNotAMatchDeclarations",
		updatepersonnotamatches: "createNotAMatchDeclaration",
		deletepersonnotamatches: "deleteAllNotAMatchDeclarations",
		deletepersonnotamatch: "deleteNotAMatchDeclaration",
		readpersonnote: "getPersonNote",
		readpersonnotes: "getPersonNotes",
		createpersonnote: "createPersonNote",
		updatepersonnote: "updatePersonNote",
		deletepersonnote: "deletePersonNote",
		readpersonsources: "getPersonSources",
		deletepersonsourcereference: "deletePersonSourceReference",
		readpersonportrait: "getPersonPortrait",
		readpersonportraits: "getPersonPortraits",
		updatepersonportraits: "updatePersonPortraits",
		deletepersonportrait: "deletePersonPortrait",
		createpersonmemory: "createPersonMemory",
		readpersonmemories: "getPersonMemories",
		deletepersonmemoriespersonareference: "deletePersonMemoryPersonaReference",
		deletepersonconclusion: "deletePersonConclusion",
		deletepersondiscussionreference: "deletePersonDiscussionReference",

	// Relationships
	readrelationship: "getRelationship",
	readrelationships: "getRelationships",
	createrelationship: "createRelationship",
	updaterelationship: "updateRelationship",
	deleterelationship: "deleteRelationship",
	restorerelationship: "restoreRelationship",
	restorechange: "restoreChange",
	readchildandparentsrelationship: "getChildAndParentsRelationship",
	readchildandparentrelationship: "getChildAndParentsRelationshipChangeHistory",
	createchildandparentsrelationship: "createChildAndParentsRelationship",
	updatechildandparentsrelationship: "updateChildAndParentsRelationship",
	deletechildandparentsrelationship: "deleteChildAndParentsRelationship",
	restorechildandparentsrelationship:
		"restoreChildAndParentsRelationship",
	readchildandparentrelationshipnote: "getChildAndParentsRelationshipNote",
	readchildandparentsrelationshipnote: "getChildAndParentsRelationshipNote",
	readchildandparentsrelationshipnotes: "getChildAndParentsRelationshipNotes",
	createchildandparentsrelationshipnote: "createChildAndParentsRelationshipNote",
	updatechildandparentsrelationshipnote: "updateChildAndParentsRelationshipNote",
	deletechildandparentsrelationshipnote: "deleteChildAndParentsRelationshipNote",
	readchildandparentsrelationshipsourcereferences: "getChildAndParentsRelationshipSourceReferences",
	createchildandparentsrelationshipsourcereference: "createChildAndParentsRelationshipSourceReference",
	deletechildandparentsrelationshipsourcereference: "deleteChildAndParentsRelationshipSourceReference",
	deletechildandparentsrelationshipconclusion: "deleteChildAndParentsRelationshipConclusion",
	deletechildandparentsrelationshipparent: "deleteChildAndParentsRelationshipParent",
	readcouplerelationship: "getCoupleRelationship",
	createcouplerelationship: "createCoupleRelationship",
	updatecouplerelationship: "updateCoupleRelationship",
	deletecouplerelationship: "deleteCoupleRelationship",
	restorecouplerelationship: "restoreCoupleRelationship",
	readcouplerelationshipchangehistory: "getCoupleRelationshipChangeHistory",
	readcouplerelationshipnote: "getCoupleRelationshipNote",
	readcouplerelationshipnotes: "getCoupleRelationshipNotes",
	createcouplerelationshipnote: "createCoupleRelationshipNote",
	updatecouplerelationshipnote: "updateCoupleRelationshipNote",
	deletecouplerelationshipnote: "deleteCoupleRelationshipNote",
	readcouplerelationshipsourcereferences: "getCoupleRelationshipSourceReferences",
	createcouplerelationshipsourcereference: "createCoupleRelationshipSourceReference",
	deletecouplerelationshipsourcereference: "deleteCoupleRelationshipSourceReference",
	deletecouplerelationshipconclusion: "deleteCoupleRelationshipConclusion",
	getchildandparentsrelationshipnotes: "getChildAndParentsRelationshipNotes",
	getcouplerelationshipnotes: "getCoupleRelationshipNotes",
	getchildandparentsrelationshipsourcereferences: "getChildAndParentsRelationshipSourceReferences",
	getcouplerelationshipsourcereferences: "getCoupleRelationshipSourceReferences",
	getpersonmemories: "getPersonMemories",
	getchildandparentsrelationship: "getChildAndParentsRelationship",
	getgroups: "getGroups",
	getmemories: "getMemories",
	getnamescript: "getNameScript",
	getnamesegments: "getNameSegments",
	getpreferredparentrelationship: "getPreferredParentRelationship",
	updatepreferredparentrelationship: "setPreferredParentRelationship",
	deletepreferredparentrelationship: "deletePreferredParentRelationship",
	readpreferredspouserelationship: "getPreferredSpouseRelationship",
	updatepreferredspouserelationship: "setPreferredSpouseRelationship",
	deletepreferredspouserelationship: "deletePreferredSpouseRelationship",
	getsourcedescriptionchanges: "getSourceDescriptionChanges",
	
	// Sources
	readsourcedescription: "getSourceDescription",
	createsourcedescription: "createSourceDescription",
	updatesourcedescription: "updateSourceDescription",
	deletesourcedescription: "deleteSourceDescription",
	readsourcedescriptionchanges: "getSourceDescriptionChanges",
	attachsource: "attachSource",
	detachsource: "detachSource",
	updatesourceattachment: "updateSourceAttachment",

		// Places
		standardizedate: "normalizeDate",
		readplaces: "searchPlaces",
		readplace: "getPlaceDetails",
		searchforparentplaces: "searchParentPlaces",

		// Memories
		readmemory: "getMemory",
		readmemories: "getMemories",
		creatememory: "createMemory",
		updatememory: "updateMemory",
		deletememory: "deleteMemory",

		// Discussions
		readdiscussion: "getDiscussion",
		creatediscussion: "createDiscussion",
		updatediscussion: "updateDiscussion",
		deletediscussion: "deleteDiscussion",

		// Vocabularies & Standards
		readvocabulary: "getVocabulary",
		readvocabularies: "getVocabularies",
		readname: "getNameType",
		readnames: "getNameTypes",
	};

	if (mappings[name]) {
		return { implemented: true, function: mappings[name] };
	}

	// Generic patterns - improved camelCase conversion
	const patterns = [];

	// read* → get*
	if (name.startsWith("read")) {
		const remainder = name.substring(4);
		patterns.push(
			"get" + remainder.charAt(0).toUpperCase() + remainder.substring(1)
		);
	}

	// create*, update*, delete*, restore*, attach*, detach*
	if (name.startsWith("create")) {
		const remainder = name.substring(6);
		patterns.push(
			"create" +
				remainder.charAt(0).toUpperCase() +
				remainder.substring(1)
		);
	}
	if (name.startsWith("update")) {
		const remainder = name.substring(6);
		patterns.push(
			"update" +
				remainder.charAt(0).toUpperCase() +
				remainder.substring(1)
		);
	}
	if (name.startsWith("delete")) {
		const remainder = name.substring(6);
		patterns.push(
			"delete" +
				remainder.charAt(0).toUpperCase() +
				remainder.substring(1)
		);
	}
	if (name.startsWith("restore")) {
		const remainder = name.substring(7);
		patterns.push(
			"restore" +
				remainder.charAt(0).toUpperCase() +
				remainder.substring(1)
		);
	}
	if (name.startsWith("attach")) {
		const remainder = name.substring(6);
		patterns.push(
			"attach" +
				remainder.charAt(0).toUpperCase() +
				remainder.substring(1)
		);
	}
	if (name.startsWith("detach")) {
		const remainder = name.substring(6);
		patterns.push(
			"detach" +
				remainder.charAt(0).toUpperCase() +
				remainder.substring(1)
		);
	}

	// Also try the original name
	patterns.push(endpointName);

	for (const pattern of patterns) {
		try {
			const result = execSync(
				`grep -r "export.*function ${pattern}" "${SRC_DIR}" 2>/dev/null | head -1`,
				{ encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] }
			).trim();

			if (result) {
				return { implemented: true, function: pattern };
			}
		} catch (error) {
			// Continue
		}
	}

	return { implemented: false };
}

/**
 * Check if endpoint is a special case (not applicable)
 */
function isNotApplicable(endpoint) {
	// OAuth authorization pages
	if (
		endpoint.name.includes("authorization") &&
		endpoint.name.includes("page")
	) {
		return "OAuth redirect page";
	}

	// HEAD requests
	if (endpoint.method === "HEAD") {
		return "HEAD request (metadata only)";
	}

	// Documentation pages
	if (
		endpoint.name.includes("api-reference") ||
		endpoint.name.includes("json-schema")
	) {
		return "Documentation page";
	}

	return null;
}

/**
 * Generate function implementation template
 */
function generateImplementation(endpoint) {
	const functionName = endpoint.name.replace(/^read/, "get");

	// Generate parameters
	const params = [];
	params.push("sdk: FamilySearchSDK");

	endpoint.pathParams.forEach((p) => {
		params.push(`${p.name}: string`);
	});

	if (endpoint.queryParams.length > 0) {
		const optionalParams = endpoint.queryParams.filter((p) => !p.required);
		if (optionalParams.length > 0) {
			params.push(
				"options?: { " +
					optionalParams
						.map((p) => `${p.name}?: ${p.type}`)
						.join("; ") +
					" }"
			);
		}
	}

	// Generate JSDoc
	let code = `/**\n * ${endpoint.title}\n *\n`;
	code += ` * ${endpoint.description}\n *\n`;

	if (endpoint.pathParams.length > 0) {
		endpoint.pathParams.forEach((p) => {
			code += ` * @param ${p.name} - ${p.name}\n`;
		});
	}

	code += ` * @returns Promise with response data\n */\n`;

	// Generate function
	code += `export async function ${functionName}(\n`;
	code += `\t${params.join(",\n\t")}\n`;
	code += `): Promise<any> {\n`;

	// Generate URL
	let urlPath = endpoint.url.replace(/https:\/\/[^/]+/, "");
	endpoint.pathParams.forEach((p) => {
		urlPath = urlPath.replace(`{${p.name}}`, `\${${p.name}}`);
	});

	// Generate query params
	const queryParamsCode =
		endpoint.queryParams.length > 0
			? `\n\tconst params = new URLSearchParams();\n` +
				endpoint.queryParams
					.map((p) => {
						const optional = !p.required;
						return optional
							? `\tif (options?.${p.name}) params.set("${p.name}", options.${p.name});`
							: `\tparams.set("${p.name}", ${p.name});`;
					})
					.join("\n")
			: "";

	code += `\ttry {\n`;

	if (endpoint.method === "GET") {
		if (queryParamsCode) {
			code += queryParamsCode + "\n";
			code += `\t\tconst response = await sdk.get<any>(\`${urlPath}?\${params.toString()}\`);\n`;
		} else {
			code += `\t\tconst response = await sdk.get<any>(\`${urlPath}\`);\n`;
		}
	} else if (endpoint.method === "POST") {
		code += `\t\tconst response = await sdk.post<any>(\`${urlPath}\`, data);\n`;
	} else if (endpoint.method === "PUT") {
		code += `\t\tconst response = await sdk.put<any>(\`${urlPath}\`, data);\n`;
	} else if (endpoint.method === "DELETE") {
		code += `\t\tconst response = await sdk.delete<any>(\`${urlPath}\`);\n`;
	}

	code += `\t\treturn response.data;\n`;
	code += `\t} catch (error) {\n`;
	code += `\t\tsdk["logger"].error("[FamilySearch SDK] Failed to ${functionName}:", error);\n`;
	code += `\t\tthrow error;\n`;
	code += `\t}\n`;
	code += `}\n`;

	return code;
}

/**
 * Main analysis
 */
async function analyzeAllEndpoints() {
	console.log("🔍 Analyzing all endpoint documentation...\n");

	const htmlFiles = fs
		.readdirSync(DOCS_DIR)
		.filter((f) => f.endsWith(".html"));
	stats.totalEndpoints = htmlFiles.length;

	for (const file of htmlFiles) {
		const endpointName = file.replace(".html", "");
		const htmlPath = path.join(DOCS_DIR, file);
		const htmlContent = fs.readFileSync(htmlPath, "utf-8");

		// Parse documentation
		const endpoint = parseEndpointDoc(htmlContent, endpointName);
		if (!endpoint) continue;

		// Check if not applicable
		const notApplicable = isNotApplicable(endpoint);
		if (notApplicable) {
			stats.notApplicable++;
			analysis.push({
				...endpoint,
				status: "NOT_APPLICABLE",
				reason: notApplicable,
			});
			console.log(`🚫 ${endpointName} - ${notApplicable}`);
			continue;
		}

		// Check implementation
		const impl = checkImplementation(endpointName);

		if (impl.implemented) {
			stats.implemented++;
			analysis.push({
				...endpoint,
				status: "IMPLEMENTED",
				function: impl.function,
			});
			console.log(`✅ ${endpointName} → ${impl.function}()`);
		} else {
			stats.missing++;
			const implementation = generateImplementation(endpoint);
			analysis.push({
				...endpoint,
				status: "MISSING",
				implementation,
			});
			console.log(`❌ ${endpointName} - MISSING`);
		}
	}
}

/**
 * Generate comprehensive report
 */
function generateReport() {
	console.log("\n📝 Generating comprehensive report...\n");

	let report = `# FamilySearch SDK API Analysis Report\n\n`;
	report += `**Generated:** ${new Date().toISOString()}\n\n`;
	report += `---\n\n`;

	// Summary
	report += `## Summary\n\n`;
	report += `| Metric | Count | Percentage |\n`;
	report += `|--------|-------|------------|\n`;
	report += `| **Total Endpoints** | ${stats.totalEndpoints} | 100% |\n`;
	report += `| ✅ **Implemented** | ${stats.implemented} | ${Math.round((stats.implemented / stats.totalEndpoints) * 100)}% |\n`;
	report += `| ❌ **Missing** | ${stats.missing} | ${Math.round((stats.missing / stats.totalEndpoints) * 100)}% |\n`;
	report += `| 🚫 **Not Applicable** | ${stats.notApplicable} | ${Math.round((stats.notApplicable / stats.totalEndpoints) * 100)}% |\n\n`;

	const applicable = stats.totalEndpoints - stats.notApplicable;
	const coverage = Math.round((stats.implemented / applicable) * 100);
	report += `**Applicable Coverage:** ${stats.implemented}/${applicable} (${coverage}%)\n\n`;

	report += `---\n\n`;

	// Group by status
	const implemented = analysis.filter((a) => a.status === "IMPLEMENTED");
	const missing = analysis.filter((a) => a.status === "MISSING");
	const notApplicable = analysis.filter((a) => a.status === "NOT_APPLICABLE");

	// Implemented
	report += `## ✅ Implemented Endpoints (${implemented.length})\n\n`;
	implemented.forEach((ep) => {
		report += `### ${ep.name}\n\n`;
		report += `- **Title:** ${ep.title}\n`;
		report += `- **Method:** ${ep.method}\n`;
		report += `- **Function:** \`${ep.function}()\`\n`;
		report += `- **Description:** ${ep.description}\n\n`;
	});

	report += `---\n\n`;

	// Missing - with implementation templates
	report += `## ❌ Missing Endpoints (${missing.length})\n\n`;
	report += `These endpoints need to be implemented. Implementation templates are provided below.\n\n`;

	missing.forEach((ep) => {
		report += `### ${ep.name}\n\n`;
		report += `- **Title:** ${ep.title}\n`;
		report += `- **Method:** ${ep.method}\n`;
		report += `- **URL:** \`${ep.url}\`\n`;
		report += `- **Description:** ${ep.description}\n\n`;

		if (ep.pathParams.length > 0) {
			report += `**Path Parameters:**\n\n`;
			ep.pathParams.forEach((p) => {
				report += `- \`${p.name}\` (${p.type})${p.required ? " - required" : ""}\n`;
			});
			report += `\n`;
		}

		if (ep.queryParams.length > 0) {
			report += `**Query Parameters:**\n\n`;
			ep.queryParams.forEach((p) => {
				report += `- \`${p.name}\` (${p.type})${p.required ? " - required" : ""}\n`;
			});
			report += `\n`;
		}

		if (ep.responses.length > 0) {
			report += `**Response Codes:** ${ep.responses.join(", ")}\n\n`;
		}

		report += `**Implementation Template:**\n\n`;
		report += `\`\`\`typescript\n${ep.implementation}\n\`\`\`\n\n`;
		report += `---\n\n`;
	});

	// Not Applicable
	report += `## 🚫 Not Applicable (${notApplicable.length})\n\n`;
	notApplicable.forEach((ep) => {
		report += `- **${ep.name}** - ${ep.reason}\n`;
	});
	report += `\n`;

	fs.writeFileSync(REPORT_FILE, report);
	console.log(`✅ Report saved to: ${REPORT_FILE}\n`);
}

/**
 * Main execution
 */
async function main() {
	console.log("🚀 FamilySearch SDK API Analysis\n");
	console.log("=" + "=".repeat(60) + "\n");

	await analyzeAllEndpoints();

	console.log("\n" + "=" + "=".repeat(60));
	console.log("\n📊 Analysis Complete!\n");
	console.log(`  Total Endpoints:    ${stats.totalEndpoints}`);
	console.log(
		`  ✅ Implemented:      ${stats.implemented} (${Math.round((stats.implemented / stats.totalEndpoints) * 100)}%)`
	);
	console.log(
		`  ❌ Missing:          ${stats.missing} (${Math.round((stats.missing / stats.totalEndpoints) * 100)}%)`
	);
	console.log(
		`  🚫 Not Applicable:   ${stats.notApplicable} (${Math.round((stats.notApplicable / stats.totalEndpoints) * 100)}%)`
	);

	const applicable = stats.totalEndpoints - stats.notApplicable;
	console.log(
		`\n  📈 Applicable Coverage: ${stats.implemented}/${applicable} (${Math.round((stats.implemented / applicable) * 100)}%)\n`
	);

	generateReport();
}

main().catch((error) => {
	console.error("❌ Error:", error);
	process.exit(1);
});
