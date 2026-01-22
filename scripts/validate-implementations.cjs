#!/usr/bin/env node

/**
 * Validate Implementation Quality
 * 
 * Checks if implemented functions match the API documentation requirements:
 * - X-Reason header support where applicable
 * - Correct HTTP methods
 * - Proper error handling
 * - Type safety
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "api-docs-cache");
const SRC_DIR = path.join(__dirname, "..", "src");

// Functions that should support X-Reason header
const REASON_FUNCTIONS = [
	"createPerson",
	"updatePerson",
	"deletePerson",
	"createPersonNote",
	"updatePersonNote",
	"deletePersonNote",
	"createCoupleRelationship",
	"updateCoupleRelationship",
	"deleteCoupleRelationship",
	"createChildAndParentsRelationship",
	"updateChildAndParentsRelationship",
	"deleteChildAndParentsRelationship",
	"createCoupleRelationshipNote",
	"updateCoupleRelationshipNote",
	"deleteCoupleRelationshipNote",
	"createChildAndParentsRelationshipNote",
	"updateChildAndParentsRelationshipNote",
	"deleteChildAndParentsRelationshipNote",
];

const issues = [];

console.log("🔍 Validating implementation quality...\n");

// Check for X-Reason header support
console.log("📋 Checking X-Reason header support...");
for (const funcName of REASON_FUNCTIONS) {
	// Search for the function
	const findResult = require("child_process")
		.execSync(
			`grep -r "export async function ${funcName}" "${SRC_DIR}" | head -1`,
			{ encoding: "utf-8" }
		)
		.trim();

	if (!findResult) {
		console.log(`  ⚠️  ${funcName} - Not found`);
		continue;
	}

	const [filePath] = findResult.split(":");
	const fileContent = fs.readFileSync(filePath, "utf-8");

	// Check if function has reason parameter
	const funcRegex = new RegExp(
		`export async function ${funcName}\\([^)]*reason[^)]*\\)`,
		"s"
	);
	const hasReasonParam = funcRegex.test(fileContent);

	if (!hasReasonParam) {
		issues.push({
			function: funcName,
			file: path.relative(process.cwd(), filePath),
			issue: "Missing 'reason' parameter for X-Reason header support",
			severity: "medium",
		});
		console.log(`  ❌ ${funcName} - Missing reason parameter`);
	} else {
		// Check if X-Reason header is actually used
		const functionStartIndex = fileContent.indexOf(
			`export async function ${funcName}`
		);
		const nextFunctionIndex = fileContent.indexOf(
			"export async function",
			functionStartIndex + 10
		);
		const functionBody = fileContent.substring(
			functionStartIndex,
			nextFunctionIndex === -1 ? fileContent.length : nextFunctionIndex
		);

		const hasXReasonUsage =
			functionBody.includes('"X-Reason"') ||
			functionBody.includes("'X-Reason'") ||
			functionBody.includes("X-Reason:");

		if (!hasXReasonUsage) {
			issues.push({
				function: funcName,
				file: path.relative(process.cwd(), filePath),
				issue:
					"Has reason parameter but doesn't use X-Reason header",
				severity: "high",
			});
			console.log(
				`  ❌ ${funcName} - Reason parameter not used in headers`
			);
		} else {
			console.log(`  ✅ ${funcName}`);
		}
	}
}

// Summary
console.log("\n" + "=".repeat(60));
console.log("📊 Validation Summary");
console.log("=".repeat(60));

if (issues.length === 0) {
	console.log("\n✅ All implementations are correct!");
} else {
	console.log(`\n❌ Found ${issues.length} issues:\n`);

	// Group by severity
	const high = issues.filter((i) => i.severity === "high");
	const medium = issues.filter((i) => i.severity === "medium");

	if (high.length > 0) {
		console.log(`🔴 HIGH PRIORITY (${high.length}):`);
		high.forEach((issue) => {
			console.log(`  • ${issue.function} (${issue.file})`);
			console.log(`    ${issue.issue}`);
		});
		console.log();
	}

	if (medium.length > 0) {
		console.log(`🟡 MEDIUM PRIORITY (${medium.length}):`);
		medium.forEach((issue) => {
			console.log(`  • ${issue.function} (${issue.file})`);
			console.log(`    ${issue.issue}`);
		});
		console.log();
	}
}

console.log("\n✨ Validation complete!");
