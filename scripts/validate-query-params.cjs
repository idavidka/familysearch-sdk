#!/usr/bin/env node

/**
 * Validate Query Parameters
 *
 * This script compares implemented query parameters with API documentation
 * to find mismatches.
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Map of function names to their API doc files
const IMPLEMENTATIONS = {
	// Places API
	searchPlaces: {
		file: "readplaces.html",
		implementation: path.join(__dirname, "../src/api/standards/places.ts"),
		function: "searchPlaces",
	},
	searchParentPlaces: {
		file: "searchforparentplaces.html",
		implementation: path.join(__dirname, "../src/api/standards/places.ts"),
		function: "searchParentPlaces",
	},
	readPlaceDescriptions: {
		file: "readplacedescriptions.html",
		implementation: path.join(__dirname, "../src/api/standards/places.ts"),
		function: "readPlaceDescriptions",
	},
	// Standards API
	normalizeDate: {
		file: "standardizedate.html",
		implementation: path.join(__dirname, "../src/api/standards/dates.ts"),
		function: "normalizeDate",
	},
	readNameScript: {
		file: "getnamescript.html",
		implementation: path.join(__dirname, "../src/api/standards/names.ts"),
		function: "readNameScript",
	},
	readNameSegments: {
		file: "getnamesegments.html",
		implementation: path.join(__dirname, "../src/api/standards/names.ts"),
		function: "readNameSegments",
	},
};

function extractQueryParamsFromDoc(htmlFile) {
	const htmlPath = path.join(__dirname, "../api-docs-cache", htmlFile);

	if (!fs.existsSync(htmlPath)) {
		return { error: "Documentation file not found" };
	}

	const html = fs.readFileSync(htmlPath, "utf-8");
	const dom = new JSDOM(html);
	const document = dom.window.document;

	const params = [];
	const inputs = document.querySelectorAll('input[id^="query-"]');

	inputs.forEach((input) => {
		const id = input.id;
		const match = id.match(/query-[^_]+_(.+)/);
		if (match) {
			const paramName = match[1];
			const isRequired = input.hasAttribute("required");
			const label = document.querySelector(`label[for="${id}"]`);
			const type = input.getAttribute("type") || "string";

			params.push({
				name: paramName,
				required: isRequired,
				type: type,
			});
		}
	});

	return params;
}

function extractQueryParamsFromImplementation(implFile, functionName) {
	if (!fs.existsSync(implFile)) {
		return { error: "Implementation file not found" };
	}

	const content = fs.readFileSync(implFile, "utf-8");

	// Find the function
	const funcRegex = new RegExp(
		`export async function ${functionName}[^{]+{([^}]+URLSearchParams[^}]+)}`,
		"s"
	);
	const match = content.match(funcRegex);

	if (!match) {
		return { error: "Function not found or no URLSearchParams used" };
	}

	const funcBody = match[1];

	// Extract params from URLSearchParams
	const params = [];

	// Pattern 1: new URLSearchParams({ key: value, ... })
	const objectPattern = /new URLSearchParams\(\s*\{([^}]+)\}\s*\)/g;
	const objectMatch = objectPattern.exec(funcBody);
	if (objectMatch) {
		const paramsStr = objectMatch[1];
		const paramMatches = paramsStr.matchAll(/(\w+):\s*[^,}]+/g);
		for (const pm of paramMatches) {
			params.push(pm[1]);
		}
	}

	// Pattern 2: params.append('key', value)
	const appendPattern = /params\.append\(\s*['"](\w+)['"]/g;
	let appendMatch;
	while ((appendMatch = appendPattern.exec(funcBody)) !== null) {
		if (!params.includes(appendMatch[1])) {
			params.push(appendMatch[1]);
		}
	}

	// Pattern 3: params.set('key', value)
	const setPattern = /params\.set\(\s*['"](\w+)['"]/g;
	let setMatch;
	while ((setMatch = setPattern.exec(funcBody)) !== null) {
		if (!params.includes(setMatch[1])) {
			params.push(setMatch[1]);
		}
	}

	return params;
}

console.log("🔍 Validating Query Parameters\n");
console.log("=".repeat(80));

let totalChecked = 0;
let totalErrors = 0;

for (const [name, config] of Object.entries(IMPLEMENTATIONS)) {
	totalChecked++;

	console.log(`\n📝 ${name}`);
	console.log("-".repeat(80));

	const docParams = extractQueryParamsFromDoc(config.file);
	const implParams = extractQueryParamsFromImplementation(
		config.implementation,
		config.function
	);

	if (docParams.error) {
		console.log(`❌ Documentation: ${docParams.error}`);
		totalErrors++;
		continue;
	}

	if (implParams.error) {
		console.log(`❌ Implementation: ${implParams.error}`);
		totalErrors++;
		continue;
	}

	console.log(`📄 Documentation params (${config.file}):`);
	docParams.forEach((p) => {
		console.log(
			`   - ${p.name} (${p.type})${p.required ? " [REQUIRED]" : ""}`
		);
	});

	console.log(`💻 Implementation params:`);
	implParams.forEach((p) => {
		console.log(`   - ${p}`);
	});

	// Compare
	const docParamNames = docParams.map((p) => p.name);
	const missingInImpl = docParamNames.filter((p) => !implParams.includes(p));
	const extraInImpl = implParams.filter((p) => !docParamNames.includes(p));

	if (missingInImpl.length > 0 || extraInImpl.length > 0) {
		console.log(`\n⚠️  MISMATCH DETECTED:`);
		if (missingInImpl.length > 0) {
			console.log(
				`   Missing in implementation: ${missingInImpl.join(", ")}`
			);
		}
		if (extraInImpl.length > 0) {
			console.log(
				`   Extra in implementation: ${extraInImpl.join(", ")}`
			);
		}
		totalErrors++;
	} else {
		console.log(`\n✅ Parameters match!`);
	}
}

console.log("\n" + "=".repeat(80));
console.log(`\n📊 Summary:`);
console.log(`   Total checked: ${totalChecked}`);
console.log(`   Errors found: ${totalErrors}`);
console.log(
	`   Success rate: ${(((totalChecked - totalErrors) / totalChecked) * 100).toFixed(1)}%\n`
);

process.exit(totalErrors > 0 ? 1 : 0);
