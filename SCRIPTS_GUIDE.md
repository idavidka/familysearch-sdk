# FamilySearch SDK - Quick Start Guide

## 🎯 Scripts Available

### 1. **Analyze Endpoints** (Recommended First Step)
```bash
npm run analyze-endpoints
```
**What it does:**
- Parses `API_ENDPOINTS_DOCS.md`
- Categorizes 204 endpoints into 19 categories
- Creates JSON + Markdown summary
- **Takes:** ~1 second
- **Output:** `api-docs-cache/endpoints.json`, `api-docs-cache/endpoints-summary.md`

### 2. **Check SDK Coverage**
```bash
npm run check-coverage
```
**What it does:**
- Compares documented endpoints vs SDK implementation
- Shows missing endpoints by category
- **Current Status:** 120/204 endpoints (59% coverage)
- **Takes:** ~2 seconds
- **Output:** `api-docs-cache/coverage-report.json`

### 3. **Fetch Full Documentation** (Optional - Slow)
```bash
npm run fetch-docs
```
**What it does:**
- Downloads 200+ fully-rendered HTML pages using Playwright
- Creates offline searchable documentation cache
- **Takes:** ~5-10 minutes
- **Size:** ~50-100 MB
- **Output:** `api-docs-cache/*.html`, `api-docs-cache/index.md`

---

## 📊 Current Coverage Summary

| Category | Total | Implemented | Coverage |
|----------|-------|-------------|----------|
| **Tree Persons** | 48 | 33 | 69% |
| **Relationships** | 48 | 29 | 60% |
| **Sources** | 19 | 8 | 42% |
| **Genealogies** | 12 | 12 | 100% ✅ |
| **Discussions** | 10 | 7 | 70% |
| **Places** | 13 | 10 | 77% |
| **Memories** | 5 | 5 | 100% ✅ |
| **User/Agent** | 8 | 6 | 75% |
| **Vocabularies** | 6 | 4 | 67% |
| **Other** | 35 | 6 | 17% |

**Overall:** 120/204 (59%)

---

## 🔍 Analysis Tools

### View Endpoint Summary
```bash
cat api-docs-cache/endpoints-summary.md
```

### View Coverage Report
```bash
cat api-docs-cache/coverage-report.json | jq '.summary'
```

### Search for Specific Endpoint
```bash
grep -i "readperson" api-docs-cache/endpoints.json
```

---

## 📝 Notes

- **`api-docs-cache/`** is git-ignored (generated files)
- Scripts use CommonJS (`.cjs`) because package is ES module
- Playwright installation: `npx playwright install chromium`

---

## 🚀 Workflow

1. **First time:** `npm run analyze-endpoints` to see what exists
2. **Check coverage:** `npm run check-coverage` to find gaps
3. **Fetch specific endpoint docs:** `npm run fetch-doc readPersonById` when implementing
4. **Optional:** `npm run fetch-docs` for all 204 endpoints (takes several hours)

**Note:** 
- `fetch-doc <endpoint>` - Fetch single endpoint or pattern (skips cached files)
- `fetch-docs` - Fetch all endpoints with smart rate limiting:
  - Random 60-90 second delay between requests
  - 5-minute break after every 20 successful requests
  - Skips already cached files
  - Estimated time: ~3-4 hours for 204 endpoints
- Timeout: 2 minutes per page for slow FamilySearch servers

For detailed documentation, see `scripts/README.md`

---

## 📋 Current Status & Next Steps

**See:** `TODO_MISSING_APIS.md` for complete analysis of missing implementations.

**Quick Summary:**
- Coverage: 120/204 (59%)
- Critical: Fix coverage checker (many false negatives)
- High Priority: Implement Person matches, not-a-match declarations, relationship restore
- Expected final coverage: ~86% after fixes + new implementations
