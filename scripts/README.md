# API Documentation Scripts

This directory contains scripts to analyze and fetch FamilySearch API documentation.

## Quick Start

### 1. Analyze Endpoints (Fast - No Network Required)

```bash
npm run analyze-endpoints
```

This creates:
- `api-docs-cache/endpoints.json` - Structured JSON with all endpoints
- `api-docs-cache/endpoints-summary.md` - Human-readable summary by category

**Output:**
- 204 unique API endpoints
- Categorized into 19 groups (Persons, Relationships, Sources, etc.)
- HTTP methods detected (GET, POST, PUT, DELETE)
- No network requests - parses `API_ENDPOINTS_DOCS.md`

### 2. Fetch Full Documentation (Slow - Downloads 200+ Pages)

```bash
npm run fetch-docs
```

This downloads fully-rendered HTML pages using Playwright headless browser.

**⚠️ Warning:** Takes 5-10 minutes and downloads ~50-100 MB

## Why Two Scripts?

### `analyze-endpoints.cjs` (Recommended for Coverage Analysis)

**Pros:**
- ✅ Instant - runs in ~1 second
- ✅ No network required
- ✅ Creates structured JSON for programmatic analysis
- ✅ Categorizes endpoints automatically
- ✅ Detects HTTP methods

**Cons:**
- ❌ Doesn't fetch actual documentation content
- ❌ Can't extract parameter details, response schemas, etc.

**Use when:**
- Checking which endpoints exist
- Comparing SDK coverage vs API endpoints
- Quick reference of available APIs

### `fetch-api-docs.cjs` (For Deep Analysis)

**Pros:**
- ✅ Full HTML content with descriptions, parameters, examples
- ✅ Works with JavaScript-rendered pages (uses Playwright)
- ✅ Creates offline searchable documentation cache

**Cons:**
- ❌ Slow (5-10 minutes for 200+ pages)
- ❌ Requires Playwright and Chromium (~200 MB download)
- ❌ Network-dependent

**Use when:**
- Need full API documentation details
- Want offline access to FamilySearch docs
- Analyzing parameter schemas, response formats

## Why?

The FamilySearch API documentation at `developers.familysearch.org` is rendered client-side with JavaScript. This makes it difficult to:
- Read offline
- Search across all endpoints
- Analyze coverage systematically

This script downloads fully-rendered HTML pages to the `api-docs-cache/` directory (git-ignored).

## Prerequisites

```bash
npm install --save-dev playwright
npx playwright install chromium
```

## Usage

### Using npm script

```bash
npm run fetch-docs
```

### Direct execution

```bash
node scripts/fetch-api-docs.cjs
```

## How It Works

1. **Reads URLs** from `API_ENDPOINTS_DOCS.md`
2. **Launches headless Chromium** using Playwright
3. **Navigates** to each URL and waits for JavaScript to render content
4. **Extracts** fully-rendered HTML
5. **Saves** to `api-docs-cache/{endpoint}.html`
6. **Creates index** at `api-docs-cache/index.md` with links to all cached pages

## Output Structure

```
api-docs-cache/
├── index.md                    # Index with links to all endpoints
├── fetch.log                   # Detailed log of fetch operations
├── api-reference-guide.html    # Main API reference
├── readperson.html            # Person read endpoint
├── updateperson.html          # Person update endpoint
├── createrelationship.html    # Relationship create endpoint
└── ...                        # 200+ other endpoints
```

## Configuration

Edit `scripts/fetch-api-docs.js` to customize:

- **Timeout**: Change `timeout: 30000` (30 seconds)
- **Wait strategy**: Modify `waitUntil: 'networkidle'`
- **Delay between requests**: Adjust `await page.waitForTimeout(500)`
- **User agent**: Update `userAgent` in browser context

## Viewing Cached Docs

1. **Open index**: `open api-docs-cache/index.md` (or view in VS Code)
2. **Browse files**: Click links in index or open HTML files directly
3. **Search**: Use `grep` or VS Code search across all HTML files

## Troubleshooting

### "Playwright not found"

```bash
npm install --save-dev playwright
npx playwright install chromium
```

### "Page timed out"

Increase timeout in `fetch-api-docs.js`:

```javascript
await page.goto(url, {
  waitUntil: 'networkidle',
  timeout: 60000, // Increase to 60 seconds
});
```

### "Too many failures"

The script continues on errors. Check `api-docs-cache/fetch.log` for details:

```bash
cat api-docs-cache/fetch.log | grep FAILED
```

## Performance

- **Total endpoints**: ~204 unique URLs
- **Time**: ~5-10 minutes (with 0.5s delay between requests)
- **Disk space**: ~50-100 MB (full HTML with embedded resources)

## Notes

- **Rate limiting**: Script includes 500ms delay between requests to be respectful
- **Headless mode**: Browser runs in background, no UI
- **Network idle**: Waits for network activity to finish before capturing HTML
- **Git ignored**: `api-docs-cache/` is in `.gitignore` - not committed to repo
