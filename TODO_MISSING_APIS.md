# FamilySearch SDK - Missing API Implementations (TODO)

**Generated:** 2026-01-20  
**Current Coverage:** 120/204 endpoints (59%)  
**Missing:** 78 endpoints  
**Uncertain (HEAD requests, etc.):** 6 endpoints

---

## 📊 Coverage by Category

| Category | Total | Implemented | Missing | Coverage |
|----------|-------|-------------|---------|----------|
| **Genealogies (User Trees)** | 12 | 0 | 12 | 0% ❌ |
| **Tree Persons** | 48 | 33 | 15 | 69% |
| **Relationships** | 48 | 29 | 19 | 60% |
| **Sources** | 19 | 8 | 11 | 42% |
| **Discussions** | 10 | 7 | 3 | 70% |
| **Places (Standards)** | 13 | 10 | 3 | 77% |
| **User/Agent** | 8 | 6 | 2 | 75% |
| **Vocabularies** | 6 | 4 | 2 | 67% |
| **Trees** | 4 | 2 | 2 | 50% |
| **Authentication** | 2 | 0 | 2 | 0% ⚠️ |
| **Other** | 34 | 21 | 13 | 62% |

---

## 🔴 CRITICAL MISSING (High Priority)

### 1. Genealogies API (User Trees) - **0% Coverage** ❌

**Status:** All genealogies endpoints appear to be implemented but **not detected** by coverage checker.

**Likely Cause:** Function naming mismatch (e.g., `getGenealogyPerson` vs `readgenealogiesperson`)

**Action Required:**
- Verify that genealogies functions exist in `src/api/genealogies/`
- Check function exports in `src/api/genealogies/index.ts`
- Update coverage checker's name mapping in `scripts/check-coverage.cjs`

**Missing Endpoints:**
- ✅ (Verify) `readGenealogyPerson` → `getGenealogyPerson()`
- ✅ (Verify) `updateGenealogyPerson` → `updateGenealogyPerson()`
- ✅ (Verify) `deleteGenealogyPerson` → `deleteGenealogyPerson()`
- ✅ (Verify) `readGenealogyPersons` → `getGenealogyPersons()`
- ✅ (Verify) `createGenealogyPerson` → `createGenealogyPerson()`
- ✅ (Verify) `deleteGenealogiesConclusion` → `deleteGenealogyConclusion()`
- ✅ (Verify) `restoreGenealogyPerson` → `restoreGenealogyPerson()`
- ✅ (Verify) `readGenealogiesBulkMatch` → `getGenealogyBulkMatch()`
- ✅ (Verify) `readGenealogyPersonMatches` → `getGenealogyPersonMatches()`
- ✅ (Verify) `readGenealogyTree` → `getGenealogyTree()`
- ✅ (Verify) `updateGenealogyTree` → `updateGenealogyTree()`
- ✅ (Verify) `deleteGenealogyTree` → `deleteGenealogyTree()`
- ✅ (Verify) `readGenealogyTrees` → `getGenealogyTrees()`
- ✅ (Verify) `createGenealogyTree` → `createGenealogyTree()`

**Next Step:** Run manual check to verify these exist and update coverage checker.

---

### 2. Authentication Endpoints - **Not Implemented**

**Status:** Handled in main app (`src/utils/familysearch-manual-auth.ts`), not in SDK package.

**Decision Required:**
- ❓ Should OAuth flow be in SDK or remain in main app?
- If SDK: Implement `getAuthorizationPage()` and `getAccessToken()`
- If main app: Document this exception in coverage report

**Missing:**
- ❌ `getAuthorizationPage` - OAuth authorization URL generation
- ❌ `getAccessToken` - Token exchange from authorization code

---

## 🟡 MEDIUM PRIORITY (Good to Have)

### 3. Tree Persons - 15 Missing (69% coverage)

**High Value:**
- ❌ `readPersonChildren` → Should be part of `getPersonFamilies()`
- ❌ `readTreePersonMatches` → Important for record hints
- ❌ `readPersonNotAMatches` → Not-a-match declarations
- ❌ `updatePersonNotAMatches` → Create not-a-match
- ❌ `deletePersonNotAMatches` → Remove all not-a-matches
- ❌ `deletePersonNotAMatch` → Remove single not-a-match
- ❌ `searchTreePersons` → General person search (different from `searchPersons`?)

**Low Priority:**
- ⚠️ `allowPersonMerge` → Already have `canMergePersons()`?
- ⚠️ `performPersonMatchesByExample` → Implicit in search?
- ⚠️ `deleteTreePersonReference` → Undocumented/rare
- ⚠️ `deletePersonDiscussionReference` → Discussion management
- ⚠️ `createPersonMemory` → Memory attachment
- ⚠️ `deletePersonMemoriesPersonaReference` → Memory persona management
- ⚠️ `deletePersonSourceReference` → Should be `detachSourceFromPerson()`?
- ⚠️ `readResearchTreePersons` → Undocumented feature

---

### 4. Relationships - 19 Missing (60% coverage)

**High Value:**
- ❌ `createRelationshipGedcomx` → Create relationship from GEDCOM-X format
- ❌ `searchForParentPlaces` → Place search (misclassified as relationship?)
- ❌ `setParentOrder` → Already have `setParentOrder()`?
- ❌ `setSpouseOrder` → Already have `setSpouseOrder()`?

**Medium Priority:**
- ⚠️ `restoreChildAndParentsRelationship` → Restore deleted relationship
- ⚠️ `restoreCoupleRelationship` → Restore deleted couple relationship
- ⚠️ `updateGenealogiesRelationship` → Genealogies API (see section 1)
- ⚠️ `deleteGenealogiesRelationship` → Genealogies API (see section 1)

**Low Priority (Source attachments - might be implemented):**
- ⚠️ `deleteChildAndParentsRelationshipSourceReference` → Check if `detachSourceFromChildAndParentsRelationship()` exists
- ⚠️ `getChildAndParentsRelationshipSourceReferences` → Might be implicit in relationship read
- ⚠️ `createChildAndParentsRelationshipSourceReference` → Check if `attachSourceToChildAndParentsRelationship()` exists
- ⚠️ `getChildAndParentsRelationshipSources` → Implicit?
- ⚠️ `deleteCoupleRelationshipSourceReference` → Check `detachSourceFromCoupleRelationship()`
- ⚠️ `readCoupleRelationshipSourceReferences` → Implicit?
- ⚠️ `createCoupleRelationshipSourceReference` → Check `attachSourceToCoupleRelationship()`
- ⚠️ `readCoupleRelationshipSources` → Implicit?

**Duplicate/Misnamed:**
- ⚠️ `readChildAndParentRelationship` → Duplicate of `getChildAndParentsRelationship()`?
- ⚠️ `readChildAndParentRelationshipNote` → Duplicate of `getChildAndParentsRelationshipNote()`?
- ⚠️ `deleteChildAndParentsRelationshipParent` → Part of update operation?
- ⚠️ `updateChildAndParentsRelationshipParentsOrder` → Duplicate of `setParentOrder()`?
- ⚠️ `updateCoupleRelationshipSpousesOrder` → Duplicate of `setSpouseOrder()`?

---

### 5. Sources - 11 Missing (42% coverage)

**High Value:**
- ❌ `getSourceDescriptionChanges` → Change history for sources
- ❌ `readUserSourceDescriptions` → User's source descriptions
- ❌ `deleteSourceDescriptionsFromCollections` → Already have `removeSourcesFromCollection()`?
- ❌ `readUserDefinedCollectionSourceDescriptions` → Already have `getCollectionSourceDescriptions()`?
- ❌ `updateSourceDescriptionsToCollection` → Already have `addSourcesToCollection()`?

**Genealogies Sources (see section 1):**
- ⚠️ `readGenealogySourceDescription`
- ⚠️ `updateGenealogySourceDescription`
- ⚠️ `deleteGenealogySourceDescription`
- ⚠️ `createGenealogySourceDescription`

**Low Priority:**
- ⚠️ `readSourceReferences` → Generic, might be covered by specific implementations
- ⚠️ `readSourceDescriptionHead` → HEAD request (rarely needed)

---

### 6. Discussions - 3 Missing (70% coverage)

- ❌ `updateComments` → Add comment to discussion (already have `addDiscussionComment()`?)
- ❌ `deleteComment` → Delete discussion comment (already have `deleteDiscussionComment()`?)
- ❌ `createMemoryComments` → Memory comments (duplicate of `createMemoryComment()`?)

---

### 7. Trees - 2 Missing (50% coverage)

- ❌ `deleteTree` → Delete user tree (already have `deleteGenealogyTree()`?)
- ❌ `createTree` → Create user tree (already have `createGenealogyTree()`?)

**Note:** These might be duplicates of Genealogies API endpoints.

---

### 8. User/Agent - 2 Missing (75% coverage)

- ❌ `readCurrentTree` → Get current active user tree
- ❌ `setCurrentTree` → Set current active user tree

---

## 🟢 LOW PRIORITY (Nice to Have)

### 9. Places (Standards) - 3 Missing (77% coverage)

- ⚠️ `readPlaceAttributes` → Place attributes (advanced feature)
- ⚠️ `readPlaceDescriptionWithRelated` → Place with related places
- ⚠️ `readPlaceDescriptionsGroup` → Grouped place descriptions

**Assessment:** Most apps don't need these advanced place features.

---

### 10. Vocabularies - 2 Missing (67% coverage)

- ⚠️ `readVocabConceptsSearch` → Already have `searchVocabConcepts()`?
- ⚠️ `readVocabConceptV2` → Already have `getVocabularyConcept()`?

**Assessment:** Likely naming mismatches, verify implementation exists.

---

### 11. Other/Miscellaneous

- ⚠️ `api-reference-guide` → Not an API endpoint (documentation page)
- ⚠️ `json-schema` → Not an API endpoint (schema definition)
- ⚠️ `readTreeMatches` → Tree-level matches (advanced feature)
- ⚠️ `readGenealogyNote` → Note reading (covered by other note endpoints?)

---

## 🔧 Action Plan for Tomorrow

### Step 1: Fix Coverage Checker (1 hour)

The coverage checker has naming issues. Many functions exist but aren't detected.

**Tasks:**
1. Update `scripts/check-coverage.cjs` with better name mapping
2. Add special cases for:
   - `read*` → `get*()`
   - `create*` → `create*()`
   - `update*` → `update*()`
   - `delete*` → `delete*()`
3. Handle duplicates (genealogies vs trees)
4. Re-run coverage check

**Expected Result:** Coverage should jump from 59% to ~75%

---

### Step 2: Verify Existing Implementations (30 min)

Check if these are actually implemented but just not exported:

```bash
# Search for function definitions
grep -r "export.*function.*Genealogy" src/api/genealogies/
grep -r "export.*function.*sourceRef" src/api/tree/
grep -r "export.*function.*NotAMatch" src/api/tree/
```

**If found:** Add to exports in respective `index.ts` files

---

### Step 3: Implement High-Priority Missing APIs (4-6 hours)

**Priority order:**

1. **Person Not-A-Match Management** (1 hour)
   - `getNotAMatchDeclarations()`
   - `createNotAMatchDeclaration()`
   - `deleteNotAMatchDeclaration()`
   - `deleteAllNotAMatchDeclarations()`

2. **Tree Person Matches** (1 hour)
   - `getTreePersonMatches()` (record hints)
   - `updateMatchResolution()` (accept/reject hints)

3. **Relationship Restore** (1 hour)
   - `restoreChildAndParentsRelationship()`
   - `restoreCoupleRelationship()`

4. **Source Change History** (30 min)
   - `getSourceDescriptionChanges()`

5. **Current Tree Management** (30 min)
   - `getCurrentTree()`
   - `setCurrentTree()`

6. **GEDCOM-X Relationship Creation** (1 hour)
   - `createRelationshipGedcomx()`

---

### Step 4: Documentation & Testing (2 hours)

1. Add JSDoc comments to new functions
2. Create usage examples
3. Add unit tests for new implementations
4. Update README with new features

---

### Step 5: Fetch Full Documentation (Optional - 10 min setup, runs overnight)

The `fetch-docs` script now has 2-minute timeout. Can run overnight:

```bash
npm run fetch-docs > fetch-docs.log 2>&1 &
```

**Why fetch docs:**
- Get detailed parameter schemas
- Understand response formats
- Find undocumented edge cases
- Create comprehensive type definitions

**Output:** ~204 HTML files in `api-docs-cache/` (50-100 MB)

---

## 📝 Coverage Checker Issues to Fix

### Naming Convention Mapping Issues

The coverage checker uses simple pattern matching that fails for:

1. **Past tense vs present:** `read` → `get`
2. **Pluralization:** `readPersons` vs `getPerson`
3. **Compound names:** `readChildAndParentRelationship` (missing 's' in `Parents`)
4. **Category mismatches:** `searchForParentPlaces` classified as "Relationships" instead of "Places"

**Solution:** Update `endpointToFunction()` in `scripts/check-coverage.cjs` with comprehensive mapping table.

---

## 🎯 Expected Final Coverage

After fixing coverage checker + implementing high-priority APIs:

- **Before:** 120/204 (59%)
- **After fixes:** ~155/204 (76%)
- **After new implementations:** ~175/204 (86%)

**Remaining 15% will be:**
- HEAD requests (not needed)
- Undocumented/deprecated endpoints
- Genealogies vs Trees API overlap
- Authentication (in main app, not SDK)

---

## 📚 Resources

- **Coverage Report:** `api-docs-cache/coverage-report.json`
- **Endpoint Summary:** `api-docs-cache/endpoints-summary.md`
- **Endpoint List:** `api-docs-cache/endpoints.json`
- **Scripts:** `scripts/README.md`

---

## 🚀 Quick Commands for Tomorrow

```bash
# Re-run coverage check
npm run check-coverage

# Verify genealogies functions exist
grep -r "export.*function" src/api/genealogies/

# Find not-a-match implementations
grep -r "NotAMatch" src/api/

# Check source attachment functions
grep -r "attachSource" src/api/

# Fetch full docs (optional, runs in background)
npm run fetch-docs > fetch-docs.log 2>&1 &
```

---

**Last Updated:** 2026-01-20 22:50 CET  
**Next Session:** Fix coverage checker, verify existing implementations, implement high-priority APIs
