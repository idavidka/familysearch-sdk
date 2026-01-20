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
	// Check if specific endpoint requested
	const specificEndpoint = process.argv[2];

	log("FamilySearch API Documentation Fetcher", "green");
	log("========================================");
	if (specificEndpoint) {
		log(`Fetching specific endpoint: ${specificEndpoint}`, "yellow");
	}
	console.log("");

	// Create docs directory
	if (!fs.existsSync(DOCS_DIR)) {
		fs.mkdirSync(DOCS_DIR, { recursive: true });
	}

	// Initialize log file
	fs.appendFileSync(
		LOG_FILE,
		`${new Date().toISOString()}: Starting fetch${specificEndpoint ? ` (${specificEndpoint})` : ""}\n`,
	);

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
	
	// Filter for specific endpoint if requested
	let filteredUrls = urls;
	if (specificEndpoint) {
		filteredUrls = urls.filter((url) => {
			const endpoint = url
				.replace(/.*\/reference\//, "")
				.replace(/.*\/docs\//, "")
				.replace(/[\/\?#].*$/, "");
			return endpoint.toLowerCase().includes(specificEndpoint.toLowerCase());
		});
		
		if (filteredUrls.length === 0) {
			log(`ERROR: No URLs found matching "${specificEndpoint}"`, "red");
			log(`Available endpoints can be found in ${URLS_FILE}`, "yellow");
			process.exit(1);
		}
		
		log(`Found ${filteredUrls.length} matching URL(s)`, "yellow");
	} else {
		log(`Found ${urls.length} unique URLs to fetch`, "yellow");
	}
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
	let skipped = 0;

	// Fetch each URL
	for (const url of filteredUrls) {
		current++;

		// Extract endpoint name from URL
		const endpoint = url
			.replace(/.*\/reference\//, "")
			.replace(/.*\/docs\//, "")
			.replace(/[\/\?#].*$/, "");

		const filename = path.join(DOCS_DIR, `${endpoint}.html`);

		// Check if file already exists
		if (fs.existsSync(filename)) {
			skipped++;
			log(`[${current}/${filteredUrls.length}] Skipping: ${endpoint} (already cached)`, "yellow");
			logToFile(`SKIPPED - ${url} - file exists`);
			continue;
		}

		log(`[${current}/${filteredUrls.length}] Fetching: ${endpoint}`);

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

			// Be nice to the server - random delay between 1-1.5 minutes
			const delayMs = Math.floor(Math.random() * 30000) + 60000; // 60-90 seconds
			log(`  ⏱️  Waiting ${Math.round(delayMs / 1000)}s before next request...`, "yellow");
			await page.waitForTimeout(delayMs);

			// Every 20 successful fetches, take a longer break
			if (success % 20 === 0 && success > 0) {
				log(`  💤 20 requests completed - taking 5 minute break...`, "yellow");
				await page.waitForTimeout(300000); // 5 minutes
			}
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
	console.log(`  Total URLs:     ${filteredUrls.length}`);
	console.log(`  Successful:     ${success}`);
	console.log(`  Failed:         ${failed}`);
	console.log(`  Skipped:        ${skipped}`);
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
