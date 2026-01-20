# Quick Setup for Tomorrow's Work Session

## 🎯 Goal
Increase SDK coverage from 59% to ~86% by fixing coverage checker and implementing missing high-priority APIs.

---

## 📋 Pre-Session Checklist

### 1. Environment Ready
```bash
cd /Users/davidimre/Develop/treeviz/gedcom-visualiser/packages/familysearch-sdk
node --version  # Should be v20.x
npm --version   # Should be v10.x
```

### 2. Dependencies Installed
```bash
npm list playwright  # Should show playwright installed
npx playwright install chromium  # If not already done
```

### 3. Review Documentation
- [ ] Read `TODO_MISSING_APIS.md` (main task list)
- [ ] Skim `api-docs-cache/endpoints-summary.md` (API reference)
- [ ] Check `api-docs-cache/coverage-report.json` (current status)

---

## 🔧 Phase 1: Fix Coverage Checker (1 hour)

### Problem
Coverage checker has naming mismatches causing false negatives.

**Example:**
- API: `readGenealogyPerson`
- SDK: `getGenealogyPerson()`
- Checker expects: `getGenealogiesperson()` (lowercase)
- Result: ❌ False negative

### Task
Edit `scripts/check-coverage.cjs`:

```javascript
// Around line 25-60: Add comprehensive mapping
const endpointToFunction = (endpoint) => {
  const name = endpoint.toLowerCase();
  
  // Exact mappings (add more as needed)
  const mappings = {
    // Current user / Agent
    'readcurrenttreeperson': 'getCurrentUser',
    'readcurrentuser': 'getCurrentUser',
    'readagent': 'getAgent',
    
    // Genealogies (most critical)
    'readgenealogiesperson': 'getGenealogyPerson',
    'updategenealogiesperson': 'updateGenealogyPerson',
    'deletegenealogiesperson': 'deleteGenealogyPerson',
    'readgenealogiespersons': 'getGenealogyPersons',
    'creategenealogiesperson': 'createGenealogyPerson',
    'deletegenealogiesconclusion': 'deleteGenealogyConclusion',
    'restoregenealogiesperson': 'restoreGenealogyPerson',
    'readgenealogiesbulkmatch': 'getGenealogyBulkMatch',
    'readgenealogiespersonmatches': 'getGenealogyPersonMatches',
    'readgenealogiesnote': 'getGenealogyNote',
    'readgenealogiestree': 'getGenealogyTree',
    'updategenealogiestree': 'updateGenealogyTree',
    'deletegenealogiestree': 'deleteGenealogyTree',
    'readgenealogiestrees': 'getGenealogyTrees',
    'creategenealogiestree': 'createGenealogyTree',
    'readgenealogiessourcedescription': 'getGenealogySourceDescription',
    'updategenealogiessourcedescription': 'updateGenealogySourceDescription',
    'deletegenealogiessourcedescription': 'deleteGenealogySourceDescription',
    'creategenealogiessourcedescription': 'createGenealogySourceDescription',
    'updategenealogiesrelationship': 'updateGenealogyRelationship',
    'deletegenealogiesrelationship': 'deleteGenealogyRelationship',
    
    // Vocabularies
    'readvocabconceptssearch': 'searchVocabConcepts',
    'readvocabconceptv2': 'getVocabularyConcept',
    
    // Places
    'readplaces': 'searchPlaces',
    'readplace': 'getPlaceDetails',
    'searchforparentplaces': 'searchParentPlaces',
    
    // Standardization
    'standardizedate': 'normalizeDate',
    
    // Sources
    'readsourcereferences': 'getPersonSources',
    
    // Person matches
    'readtreepersonmatches': 'getPersonMatches',
    'readpersonnotamatches': 'getNotAMatchDeclarations',
    'updatepersonnotamatches': 'createNotAMatchDeclaration',
    'deletepersonnotamatches': 'deleteAllNotAMatchDeclarations',
    'deletepersonnotamatch': 'deleteNotAMatchDeclaration',
    
    // Discussions
    'updatecomments': 'addDiscussionComment',
    'deletecomment': 'deleteDiscussionComment',
    
    // Memories
    'creatememorycomments': 'createMemoryComment',
    
    // Source attachments
    'deletechildandparentsrelationshipsourcereference': 'detachSourceFromChildAndParentsRelationship',
    'createchildandparentsrelationshipsourcereference': 'attachSourceToChildAndParentsRelationship',
    'deletecouplerelationshipsourcereference': 'detachSourceFromCoupleRelationship',
    'createcouplerelationshipsourcereference': 'attachSourceToCoupleRelationship',
    'deletepersonsourcereference': 'detachSourceFromPerson',
    
    // Order management
    'updatechildandparentsrelationshipparentsorder': 'setParentOrder',
    'updatecouplerelationshipspousesorder': 'setSpouseOrder',
    
    // Tree management
    'deletetree': 'deleteGenealogyTree',
    'createtree': 'createGenealogyTree',
    'updatetree': 'updateGenealogyTree',
    
    // Search
    'searchtreepersons': 'searchPersons',
  };
  
  if (mappings[name]) return mappings[name];
  
  // ... rest of function
};
```

### Verify Fix
```bash
npm run check-coverage
# Should now show ~75% coverage instead of 59%
```

---

## 🔍 Phase 2: Verify Existing Functions (30 min)

### Check Genealogies Implementation
```bash
grep -r "export.*function" src/api/genealogies/ | grep -i person
grep -r "export.*function" src/api/genealogies/ | grep -i tree
grep -r "export.*function" src/api/genealogies/ | grep -i source
```

**Expected:** All genealogies functions should be found.

### Check Source Attachments
```bash
grep -r "attachSource" src/api/tree/
grep -r "detachSource" src/api/tree/
```

**Expected:** Should find attachment functions for persons, relationships.

### Check Exports
```bash
cat src/api/genealogies/index.ts
cat src/api/tree/index.ts
```

**If functions exist but aren't exported:** Add to respective `index.ts` files.

---

## 🚀 Phase 3: Implement Missing High-Priority APIs (4-6 hours)

### 3A. Person Not-A-Match Management (1 hour)

**File:** `src/api/tree/matches.ts`

**Implement:**
```typescript
/**
 * Get not-a-match declarations for a person
 */
export async function getNotAMatchDeclarations(
  sdk: FamilySearchSDK,
  personId: string
): Promise<NotAMatchDeclarationsResponse> {
  // GET /platform/tree/persons/{personId}/not-a-matches
}

/**
 * Create a not-a-match declaration
 */
export async function createNotAMatchDeclaration(
  sdk: FamilySearchSDK,
  personId: string,
  notAMatchPersonId: string
): Promise<void> {
  // PUT /platform/tree/persons/{personId}/not-a-matches/{notAMatchPersonId}
}

/**
 * Delete a single not-a-match declaration
 */
export async function deleteNotAMatchDeclaration(
  sdk: FamilySearchSDK,
  personId: string,
  notAMatchPersonId: string
): Promise<void> {
  // DELETE /platform/tree/persons/{personId}/not-a-matches/{notAMatchPersonId}
}

/**
 * Delete all not-a-match declarations for a person
 */
export async function deleteAllNotAMatchDeclarations(
  sdk: FamilySearchSDK,
  personId: string
): Promise<void> {
  // DELETE /platform/tree/persons/{personId}/not-a-matches
}
```

**Add Types:** `src/types/matches.ts`
```typescript
export interface NotAMatchDeclaration {
  id: string;
  person: PersonReference;
  notAMatch: PersonReference;
  created: string;
}

export interface NotAMatchDeclarationsResponse {
  persons: FamilySearchPerson[];
  notAMatches: NotAMatchDeclaration[];
}
```

**Export:** Add to `src/api/tree/index.ts`

---

### 3B. Tree Person Matches (1 hour)

**File:** `src/api/tree/matches.ts` (add to existing file)

**Implement:**
```typescript
/**
 * Get record hints (matches) for a tree person
 */
export async function getTreePersonMatches(
  sdk: FamilySearchSDK,
  personId: string,
  options?: TreePersonMatchesOptions
): Promise<TreePersonMatchesResponse> {
  // GET /platform/tree/persons/{personId}/matches
}
```

**Note:** Type `TreePersonMatchesResponse` already exists in types.

---

### 3C. Relationship Restore (1 hour)

**File:** `src/api/tree/relationships.ts`

**Implement:**
```typescript
/**
 * Restore a deleted child-and-parents relationship
 */
export async function restoreChildAndParentsRelationship(
  sdk: FamilySearchSDK,
  relationshipId: string
): Promise<ChildAndParentsRelationship> {
  // POST /platform/tree/child-and-parents-relationships/{relationshipId}/restore
}

/**
 * Restore a deleted couple relationship
 */
export async function restoreCoupleRelationship(
  sdk: FamilySearchSDK,
  relationshipId: string
): Promise<CoupleRelationship> {
  // POST /platform/tree/couple-relationships/{relationshipId}/restore
}
```

---

### 3D. Source Change History (30 min)

**File:** `src/api/tree/sources.ts`

**Implement:**
```typescript
/**
 * Get change history for a source description
 */
export async function getSourceDescriptionChanges(
  sdk: FamilySearchSDK,
  sourceDescriptionId: string
): Promise<ChangeHistoryResponse> {
  // GET /platform/sources/{sourceDescriptionId}/changes
}
```

---

### 3E. Current Tree Management (30 min)

**File:** `src/api/user/index.ts`

**Implement:**
```typescript
/**
 * Get the current active tree for the user
 */
export async function getCurrentTree(
  sdk: FamilySearchSDK
): Promise<TreeResponse> {
  // GET /platform/tree/current-tree
}

/**
 * Set the current active tree for the user
 */
export async function setCurrentTree(
  sdk: FamilySearchSDK,
  treeId: string
): Promise<void> {
  // PUT /platform/tree/current-tree
}
```

---

### 3F. GEDCOM-X Relationship Creation (1 hour)

**File:** `src/api/tree/relationships.ts`

**Implement:**
```typescript
/**
 * Create a relationship from GEDCOM-X format
 */
export async function createRelationshipGedcomx(
  sdk: FamilySearchSDK,
  gedcomxData: GedcomxRelationship
): Promise<RelationshipResponse> {
  // POST /platform/tree/relationships
  // Content-Type: application/x-gedcomx-v1+json
}
```

---

## ✅ Phase 4: Testing & Documentation (2 hours)

### 4A. Add JSDoc Comments
All new functions need:
- Description
- `@param` for each parameter
- `@returns` for return type
- `@example` usage example
- `@see` link to FamilySearch docs

### 4B. Update Exports
Add to `src/api/index.ts`:
```typescript
// Matches
export {
  getNotAMatchDeclarations,
  createNotAMatchDeclaration,
  deleteNotAMatchDeclaration,
  deleteAllNotAMatchDeclarations,
  getTreePersonMatches,
} from './tree/matches';

// Relationships
export {
  restoreChildAndParentsRelationship,
  restoreCoupleRelationship,
  createRelationshipGedcomx,
} from './tree/relationships';

// Sources
export {
  getSourceDescriptionChanges,
} from './tree/sources';

// User/Tree
export {
  getCurrentTree,
  setCurrentTree,
} from './user/index';
```

### 4C. Update Type Exports
Add to `src/types/index.ts`:
```typescript
export type {
  NotAMatchDeclaration,
  NotAMatchDeclarationsResponse,
} from './matches';

export type {
  GedcomxRelationship,
} from './relationships';

export type {
  TreeResponse,
} from './tree';
```

### 4D. Re-run Coverage Check
```bash
npm run check-coverage
# Should now show ~86% coverage
```

---

## 📦 Optional: Fetch Full Docs (Background Task)

Can run overnight or in background:

```bash
# Run in background
npm run fetch-docs > fetch-docs.log 2>&1 &

# Check progress
tail -f fetch-docs.log

# Check if still running
ps aux | grep fetch-api-docs

# Count downloaded files
ls -1 api-docs-cache/*.html | wc -l
```

**Expected:** ~204 HTML files, 50-100 MB, takes 10-20 minutes.

---

## 📊 Success Metrics

By end of session:

- ✅ Coverage checker accuracy: 90%+
- ✅ SDK coverage: 86%+ (175/204 endpoints)
- ✅ All high-priority APIs implemented
- ✅ Tests passing
- ✅ Documentation complete

---

## 🔄 If Time Remains

### Bonus Tasks (Priority Order)

1. **Implement Medium Priority** (1-2 hours each)
   - Person children relationship helpers
   - Advanced place APIs
   - Memory persona management

2. **Create Usage Examples** (30 min)
   - Add `examples/` directory
   - Create real-world usage scenarios

3. **Improve Type Definitions** (1 hour)
   - Add missing optional fields
   - Create discriminated unions for responses
   - Add stricter validation types

---

## 🐛 Common Issues & Solutions

### Issue: "Function not found" in coverage check
**Solution:** Update mapping in `scripts/check-coverage.cjs`

### Issue: "Type not exported"
**Solution:** Add to `src/types/index.ts` and `src/api/index.ts`

### Issue: "Build fails with type errors"
**Solution:** Run `npm run lint` to see TypeScript errors

### Issue: "Playwright timeout"
**Solution:** Already increased to 2 minutes, should be sufficient

---

## 📝 Notes

- Branch: `feat/comprehensive-fs-sdk`
- Playwright installed: ✅
- Chromium downloaded: ✅
- Scripts working: ✅
- Coverage baseline: 59% (120/204)

**Last Updated:** 2026-01-20 23:00 CET
