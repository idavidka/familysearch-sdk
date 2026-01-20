#!/usr/bin/env node

/**
 * FamilySearch API Documentation Fetcher (JavaScript-rendered pages)
 *
 * Uses Playwright to fetch and save fully rendered documentation pages
 * that are loaded via JavaScript.
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

// Configuration
const DOCS_DIR = "api-docs-cache";
const URLS_FILE = "API_ENDPOINTS_DOCS.md";
const LOG_FILE = path.join(DOCS_DIR, "fetch.log");

// Colors for console output
const colors = {
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	reset: "\x1b[0m",
};

const log = (message, color = "reset") => {
	console.log(`${colors[color]}${message}${colors.reset}`);
};

const logToFile = (message) => {
	const timestamp = new Date().toISOString();
	fs.appendFileSync(LOG_FILE, `${timestamp}: ${message}\n`);
};

async function main() {
	log("FamilySearch API Documentation Fetcher", "green");
	log("========================================");
	console.log("");

	// Create docs directory
	if (!fs.existsSync(DOCS_DIR)) {
		fs.mkdirSync(DOCS_DIR, { recursive: true });
	}

	// Initialize log file
	fs.writeFileSync(LOG_FILE, `${new Date().toISOString()}: Starting fetch\n`);

	// Read and extract URLs
	if (!fs.existsSync(URLS_FILE)) {
		log(`ERROR: ${URLS_FILE} not found!`, "red");
		process.exit(1);
	}

	const content = fs.readFileSync(URLS_FILE, "utf-8");
	const urlMatches = content.match(
		/https:\/\/developers\.familysearch\.org[^\s"']*/g
	);

	if (!urlMatches) {
		log("ERROR: No URLs found in file!", "red");
		process.exit(1);
	}

	const urls = [...new Set(urlMatches)]; // Remove duplicates
	log(`Found ${urls.length} unique URLs to fetch`, "yellow");
	console.log("");

	// Launch browser
	log("Launching headless browser...", "yellow");
	const browser = await chromium.launch({
		headless: true,
	});

	const context = await browser.newContext({
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	});

	const page = await context.newPage();

	// Counters
	let current = 0;
	let success = 0;
	let failed = 0;

	// Fetch each URL
	for (const url of urls) {
		current++;

		// Extract endpoint name from URL
		const endpoint = url
			.replace(/.*\/reference\//, "")
			.replace(/.*\/docs\//, "")
			.replace(/[\/\?#].*$/, "");

		const filename = path.join(DOCS_DIR, `${endpoint}.html`);

		log(`[${current}/${urls.length}] Fetching: ${endpoint}`);

		try {
			// Navigate to page
			await page.goto(url, {
				waitUntil: "networkidle",
				timeout: 120000, // 2 minutes - FamilySearch docs can be slow to load
			});

			// Wait for content to load (adjust selector based on FamilySearch docs structure)
			await page.waitForSelector("body", { timeout: 120000 });

			// Optional: Wait a bit more for JavaScript to fully render
			await page.waitForTimeout(2000);

			// Get the full HTML content
			const html = await page.content();

			// Save to file
			fs.writeFileSync(filename, html, "utf-8");

			success++;
			log(`  ✓ Saved to ${filename}`, "green");
			logToFile(`SUCCESS - ${url}`);

			// Be nice to the server
			await page.waitForTimeout(500);
		} catch (error) {
			failed++;
			log(`  ✗ Failed to fetch ${url}`, "red");
			log(`    Error: ${error.message}`, "red");
			logToFile(`FAILED - ${url} - ${error.message}`);
		}
	}

	await browser.close();

	console.log("");
	log("========================================", "green");
	log("Fetch Complete!", "green");
	console.log(`  Total URLs:     ${urls.length}`);
	console.log(`  Successful:     ${success}`);
	console.log(`  Failed:         ${failed}`);
	console.log(`  Cache location: ${DOCS_DIR}/`);
	console.log(`  Log file:       ${LOG_FILE}`);
	console.log("");

	// Create index file
	const indexFile = path.join(DOCS_DIR, "index.md");
	let indexContent = "# FamilySearch API Documentation Cache\n\n";
	indexContent += `**Generated:** ${new Date().toISOString()}\n`;
	indexContent += `**Total Files:** ${success}\n\n`;
	indexContent += "## Cached Endpoints\n\n";

	const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".html"));
	files.sort();

	for (const file of files) {
		const name = file.replace(".html", "");
		indexContent += `- [${name}](${file})\n`;
	}

	fs.writeFileSync(indexFile, indexContent, "utf-8");
	log(`Index created: ${indexFile}`, "green");
}

main().catch((error) => {
	log(`FATAL ERROR: ${error.message}`, "red");
	console.error(error);
	process.exit(1);
});
