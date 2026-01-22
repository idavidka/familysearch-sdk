# Query Parameter Validation Report

## Critical Issue Discovered

During coverage analysis, a systematic issue was discovered: **multiple API implementations use incorrect query parameter names** that don't match the official FamilySearch API documentation.

## Validation Results

**Total implementations checked**: 6  
**✅ Correct**: 1 (16.7%)  
**⚠️ Partially correct**: 1 (16.7%)  
**❌ Critical errors**: 4 (66.7%)  

**SUCCESS RATE: 16.7%**

---

## Detailed Findings

### 1. ✅ normalizeDate - CORRECT
- **File**: `src/api/standards/dates.ts`
- **API Doc**: `standardizedate.html`
- **Parameters**: 
  - ✅ `date` (required)
- **Status**: Fully correct implementation

---

### 2. ⚠️ searchPlaces - PARTIALLY CORRECT
- **File**: `src/api/standards/places.ts:35-60`
- **API Doc**: `readplaces.html`
- **Documentation Parameters**:
  - `q` (required) - Search query
  - `count` (optional) - Number of results
  - `start` (optional) - Pagination offset
  
- **Implementation Parameters**:
  ```typescript
  const params = new URLSearchParams({
    q: query,           // ✅ Correct
    count: count.toString(), // ✅ Correct
  });
  ```
  
- **Issue**: Missing `start` parameter for pagination
- **Severity**: Medium - Basic search works, but pagination is not supported
- **Fix Required**: Add optional `start` parameter to function signature

---

### 3. ❌ searchParentPlaces - CRITICAL ERROR
- **File**: `src/api/standards/places.ts:312-350`
- **API Doc**: `searchforparentplaces.html`
- **API URL**: `/platform/places/parents` (NOT `/parent-search`)

- **Documentation Parameters**:
  - `value` (string, **required**) - The search value (place name)
  - `pids` (string, optional) - Comma-separated list of parent place IDs to filter results
  
- **Current Implementation**:
  ```typescript
  const params = new URLSearchParams({ place: placeId }); // ❌ Wrong param name
  if (query) {
    params.append('q', query); // ❌ Wrong param name
  }
  ```
  
- **Issues**:
  1. ❌ URL is wrong: `/parent-search` should be `/parents`
  2. ❌ Uses `place` parameter (doesn't exist in API)
  3. ❌ Uses `q` instead of `value`
  4. ❌ Missing `pids` parameter
  5. ❌ Function signature is wrong (`placeId` should be `searchValue`)

- **Severity**: CRITICAL - Endpoint will not work at all
- **Impact**: This function is completely non-functional

---

### 4. ❌ readPlaceDescriptions - CRITICAL ERROR
- **File**: `src/api/standards/places.ts:120-160`
- **API Doc**: `readplacedescriptions.html`

- **Documentation Parameters**:
  - `pdids` (string, **required**) - Place description IDs (comma-separated or multiple params)
  
- **Current Implementation**:
  ```typescript
  const params = new URLSearchParams();
  placeIds.forEach(id => params.append('places', id)); // ❌ Wrong param name
  ```
  
- **Issue**: Uses `places` instead of `pdids`
- **Severity**: CRITICAL - Endpoint will not work
- **Fix Required**: Change `places` to `pdids`

---

### 5. ❌ readNameScript - CRITICAL ERROR
- **File**: `src/api/standards/names.ts:20-45`
- **API Doc**: `getnamescript.html`

- **Documentation Parameters**:
  - `text` (string, **required**) - The name text to analyze
  
- **Current Implementation**:
  ```typescript
  const params = new URLSearchParams({ name }); // ❌ Wrong param name
  ```
  
- **Issue**: Uses `name` instead of `text`
- **Severity**: CRITICAL - Endpoint will not work
- **Fix Required**: Change `name` to `text` and update function parameter name

---

### 6. ❌ readNameSegments - CRITICAL ERROR
- **File**: `src/api/standards/names.ts:47-75`
- **API Doc**: `getnamesegments.html`

- **Documentation Parameters**:
  - `fullName` (string, **required**) - The full name to segment
  - `locale` (string, optional) - Locale for name parsing rules
  - `lang` (string, optional) - Language for name parsing
  
- **Current Implementation**:
  ```typescript
  const params = new URLSearchParams({ name }); // ❌ Wrong and incomplete
  ```
  
- **Issues**:
  1. ❌ Uses `name` instead of `fullName`
  2. ❌ Missing `locale` parameter
  3. ❌ Missing `lang` parameter

- **Severity**: CRITICAL - Endpoint works partially but incorrectly
- **Fix Required**: Complete rewrite of parameter handling

---

## Root Cause Analysis

The errors suggest that **implementations were written based on assumptions or incomplete documentation** rather than the official API specification. This is a **systematic quality issue** that likely affects other endpoints as well.

### Potential Causes:
1. ❌ Not consulting official API documentation during implementation
2. ❌ Using intuitive parameter names instead of documented ones
3. ❌ No validation against API documentation
4. ❌ No integration tests with real API

---

## Recommended Action Plan

### Phase 1: Immediate Fixes (Priority: CRITICAL)
1. ✅ **Create validation script** - Done (`validate-query-params.cjs`)
2. 🔧 **Fix 4 critical errors**:
   - `searchParentPlaces` - Complete rewrite
   - `readPlaceDescriptions` - Parameter name fix
   - `readNameScript` - Parameter name fix
   - `readNameSegments` - Add missing parameters

### Phase 2: Review All Endpoints (Priority: HIGH)
3. 🔍 **Audit all other implementations** with query parameters
4. 🔍 **Check URL paths** against documentation (found 1 wrong URL already)
5. 🔍 **Verify HTTP methods** (GET/POST/DELETE/PUT)

### Phase 3: Prevention (Priority: HIGH)
6. 📝 **Create API doc reference checklist**
7. 🧪 **Add integration tests** for each endpoint
8. 🤖 **Automate validation** in CI/CD pipeline
9. 📚 **Document validation process** for future implementations

### Phase 4: Testing (Priority: MEDIUM)
10. 🧪 **Write unit tests** for each function
11. 🧪 **Test with real FamilySearch API** (if possible)
12. 📊 **Measure API success rates** in production

---

## Impact Assessment

### Current State:
- **Coverage**: 150/192 (78%) - but includes broken implementations
- **Functional Coverage**: Unknown - needs testing
- **Quality**: Low - 66.7% of checked endpoints are broken

### Risk:
- **High Risk**: Users cannot use 4 critical API functions
- **Reputation Risk**: SDK credibility is damaged
- **Migration Risk**: Fixing will be breaking changes

### Breaking Changes Required:
Yes - Function signatures must change:
- `searchParentPlaces(sdk, searchValue, parentIds?)` 
- `readPlaceDescriptions(sdk, descriptionIds)`
- `readNameScript(sdk, text)`
- `readNameSegments(sdk, fullName, locale?, lang?)`

---

## Next Steps

1. ✅ Document findings (this file)
2. 🔧 Create GitHub issue for tracking
3. 🔧 Fix critical errors in order:
   - readNameScript (simplest)
   - readPlaceDescriptions (simple)
   - readNameSegments (medium)
   - searchParentPlaces (complex - complete rewrite)
4. ⚠️ Update major version (breaking changes)
5. 📝 Update CHANGELOG with breaking changes
6. 🧪 Add tests before committing fixes
7. 🔍 Run full audit of all other endpoints

---

## Validation Script

Location: `scripts/validate-query-params.cjs`

Usage:
```bash
node scripts/validate-query-params.cjs
```

This script compares implementation query parameters against API documentation and reports mismatches.

---

## Related Files

- `src/api/standards/places.ts` - 3 functions affected
- `src/api/standards/names.ts` - 2 functions affected
- `src/api/standards/dates.ts` - 1 function correct ✅
- `api-docs-cache/*.html` - Official API documentation

---

**Report Date**: January 21, 2026  
**Discovered By**: Manual review during coverage analysis  
**Priority**: CRITICAL  
**Estimated Fix Time**: 4-6 hours for all critical fixes + testing  

---

## Conclusion

This is a **critical quality issue** that must be addressed before the SDK can be considered production-ready. The **16.7% success rate** in query parameter implementation indicates a systematic problem in the development process.

**Recommendation**: HALT new feature development and focus on:
1. Fixing these 4 critical errors
2. Auditing all other endpoints
3. Establishing quality processes

The current 78% coverage number is **misleading** because it counts non-functional implementations as "implemented".
