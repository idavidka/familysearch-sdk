# FamilySearch SDK - API Coverage Analysis

**Generated:** 2026-01-20  
**SDK Version:** Current (based on code inspection)  
**Reference:** FamilySearch API Documentation (https://developers.familysearch.org/main/reference/api-reference-guide)

---

## 📊 Executive Summary

| Metric | Value | Percentage |
|--------|-------|------------|
| **Total API Endpoints** | ~200 | 100% |
| **Implemented (Full)** | 27 | 13.5% |
| **Implemented (Partial)** | 0 | 0% |
| **Not Implemented** | 173 | 86.5% |

---

## ✅ Currently Implemented Endpoints (27)

### 🔐 Authentication (2/2) - 100% Coverage
- ✅ **OAuth Authorization** - Manual implementation (not using SDK methods directly)
- ✅ **OAuth Token Exchange** - Manual implementation

**SDK Implementation:** OAuth utilities in `src/auth/oauth.ts`

---

### 👤 Users API (1/7) - 14% Coverage

#### Implemented:
- ✅ **Read Current User** - `getCurrentUser()` - `GET /platform/users/current`

#### Not Implemented:
- ❌ Read Partner Eligibility
- ❌ Read User History
- ❌ Update User History
- ❌ Delete User History Entry
- ❌ Create Partner Account (DEPRECATED)
- ❌ Update Partner Account (DEPRECATED)

---

### 👥 Persons API (8/20+) - ~40% Coverage

#### Implemented:
- ✅ **Get Person** - `getPerson(personId)` - `GET /platform/tree/persons/{pid}`
- ✅ **Get Person with Details** - `getPersonWithDetails(personId, options)` - `GET /platform/tree/persons/{pid}?sourceDescriptions=true`
- ✅ **Get Person Notes** - `getPersonNotes(personId)` - `GET /platform/tree/persons/{pid}/notes`
- ✅ **Get Person Memories** - `getPersonMemories(personId)` - `GET /platform/tree/persons/{pid}/memories`
- ✅ **Get Person Sources** - `getPersonSources(personId)` - `GET /platform/tree/persons/{pid}/sources`
- ✅ **Get Person Portraits** - `getPersonPortraits(personId)` - `GET /platform/tree/persons/{pid}/portraits`
- ✅ **Get Person Change History** - `getPersonChangeHistory(personId)` - `GET /platform/tree/persons/{pid}/changes`
- ✅ **Read Current User Tree Person** - Via `getCurrentUser()` then fetch person

#### Not Implemented:
- ❌ **Read Person Headers** - `HEAD /platform/tree/persons/{pid}`
- ❌ **Read Persons List** (bulk) - `GET /platform/tree/persons?pids=X,Y,Z`
- ❌ **Read Children** - `GET /platform/tree/persons/{pid}/children`
- ❌ **Read Families** - `GET /platform/tree/persons/{pid}/families`
- ❌ **Read Parents** - `GET /platform/tree/persons/{pid}/parents`
- ❌ **Read Spouses** - `GET /platform/tree/persons/{pid}/spouses`
- ❌ **Create Person** - `POST /platform/tree/persons`
- ❌ **Update Person** - `POST /platform/tree/persons/{pid}`
- ❌ **Delete Person** - `DELETE /platform/tree/persons/{pid}`
- ❌ **Restore Person** - `POST /platform/tree/persons/{pid}/restore`
- ❌ **Delete Conclusion** - `DELETE /platform/tree/persons/{pid}/conclusions/{cid}`
- ❌ **Delete Tree Person Reference** - `DELETE /platform/tree/persons/{pid}/references/{refid}`

**Note:** `fetchMultiplePersons()` exists but is a simple wrapper, not a full implementation.

---

### 🌳 Pedigrees API (2/2) - 100% Coverage

#### Implemented:
- ✅ **Read Ancestry** - `getAncestry(personId, generations)` - `GET /platform/tree/ancestry`
- ✅ **Read Descendancy** - `getDescendancy(personId, generations)` - `GET /platform/tree/descendancy`

**SDK Implementation:** `src/tree/pedigree.ts` with enhanced `fetchPedigree()` wrapper

---

### 🔗 Relationships API

#### Couple Relationships (1/10) - 10% Coverage
- ✅ **Read Couple Relationship** - `getCoupleRelationship(relationshipId)` - `GET /platform/tree/couple-relationships/{crid}`

**Not Implemented:**
- ❌ Read Couple Relationship Headers
- ❌ Update Couple Relationship
- ❌ Delete Couple Relationship
- ❌ Restore Couple Relationship
- ❌ Delete Couple Relationship Conclusion
- ❌ Set Couple Relationship Spouses Order
- ❌ Read Preferred Spouse Relationship
- ❌ Set Preferred Spouse Relationship
- ❌ Delete Preferred Spouse Relationship

#### Child and Parents Relationships (1/11) - ~9% Coverage
- ✅ **Read Child and Parents Relationship** - `getChildAndParentsRelationship(relationshipId)` - `GET /platform/tree/child-and-parents-relationships/{caprid}`

**Not Implemented:**
- ❌ Read Child and Parents Relationship Headers
- ❌ Update Child and Parents Relationship
- ❌ Delete Child and Parents Relationship
- ❌ Restore Child and Parents Relationship
- ❌ Delete Child and Parents Relationship Conclusion
- ❌ Delete Parent from Child and Parents Relationship
- ❌ Set Parent Order
- ❌ Read Preferred Parent Relationship
- ❌ Update Preferred Parent Relationship
- ❌ Delete Preferred Parent Relationship

#### General Relationships (0/2) - 0% Coverage
- ❌ **Find Relationship** - `GET /platform/tree/persons/{pid}/relationships/{pid2}` (Calculate relationship path)
- ❌ **Create Relationship** - `POST /platform/tree/relationships`

---

### 🔍 Search API (1/1) - 100% Coverage

#### Implemented:
- ✅ **Search Tree Persons** - `searchPersons(query, options)` - `GET /platform/tree/search`
- ✅ **Search Person by Data** - `searchPersonByData(person, options)` - Helper wrapper for GEDCOM data

---

### 🎯 Matches API (2/8) - 25% Coverage

#### Implemented:
- ✅ **Read Person Matches by ID** - `getTreePersonMatches(personId, options)` - `GET /platform/tree/persons/{pid}/matches`
- ✅ **Match Person from GEDCOM** - `matchPerson(person, options)` - `POST /platform/tree/persons/{pid}/matches`

**Not Implemented:**
- ❌ Read Person Matches by ID Headers
- ❌ Update Match Resolution (accept/reject/dismiss)
- ❌ Read Not-a-Match Declarations
- ❌ Update Not-a-Match Declaration
- ❌ Delete Not-a-Match Declarations (bulk)
- ❌ Delete Not-a-Match Declaration (single)

---

### 💬 Discussions API (1/7) - ~14% Coverage

#### Implemented:
- ✅ **Get Person Discussion References** - `getPersonDiscussions(personId)` - `GET /platform/tree/persons/{pid}/discussion-references`

**Not Implemented:**
- ❌ Create Discussion
- ❌ Read Discussion
- ❌ Update Discussion
- ❌ Read Discussion Headers
- ❌ Read Comments
- ❌ Update Comments (add comment)
- ❌ Delete Comment

**Note:** SDK only fetches discussion references on persons, not actual Discussion API.

---

### 📝 Notes API (1/15) - ~7% Coverage

#### Implemented:
- ✅ **Read Person Notes** - `getPersonNotes(personId)` - `GET /platform/tree/persons/{pid}/notes`

**Not Implemented:**
- ❌ Read Person Note (single)
- ❌ Create Person Note
- ❌ Update Person Note
- ❌ Delete Person Note
- ❌ Read Child and Parents Relationship Note
- ❌ Update Child and Parents Relationship Note
- ❌ Delete Child and Parents Relationship Note
- ❌ Read Child and Parents Relationship Notes
- ❌ Create Child and Parents Relationship Note
- ❌ Read Couple Relationship Note
- ❌ Update Couple Relationship Note
- ❌ Delete Couple Relationship Note
- ❌ Read Couple Relationship Notes
- ❌ Create Couple Relationship Note

---

### 📚 Sources API (2/17) - ~12% Coverage

#### Implemented:
- ✅ **Get Person Sources** - `getPersonSources(personId)` - `GET /platform/tree/persons/{pid}/sources`
- ✅ **Get Source Description** - `getSourceDescription(sourceId)` - `GET /platform/sources/descriptions/{sdid}`

**Not Implemented:**
- ❌ Delete Person Source Reference
- ❌ Read Source References (bulk)
- ❌ Read Child and Parents Source References
- ❌ Create Child and Parents Source Reference
- ❌ Delete Child and Parents Source Reference
- ❌ Read Child and Parents Relationship Sources
- ❌ Read Couple Relationship Source References
- ❌ Create Couple Relationship Source Reference
- ❌ Delete Couple Relationship Source Reference
- ❌ Read Couple Relationship Sources
- ❌ Update Source Description
- ❌ Delete Source Description
- ❌ Read Source Description Headers
- ❌ Create Source Description
- ❌ Get Source Description Changes

---

### 📸 Memories API (3/6) - 50% Coverage

#### Implemented:
- ✅ **Get Memory** - `getMemory(memoryId)` - `GET /platform/memories/{mid}`
- ✅ **Get User Memories** - `getUserMemories(options)` - `GET /platform/memories`
- ✅ **Get Memory Comments** - `getMemoryComments(memoryId)` - `GET /platform/memories/{mid}/comments`

**Not Implemented:**
- ❌ Create Memory (upload photo/document/story)
- ❌ Update Memory
- ❌ Delete Memory

---

### 🎭 Memory Personas API (2/5) - 40% Coverage

#### Implemented:
- ✅ **Get Memory Personas** - `getMemoryPersonas(memoryId)` - `GET /platform/memories/{mid}/personas`
- ✅ **Get Memory Persona** - `getMemoryPersona(memoryId, personaId)` - `GET /platform/memories/{mid}/personas/{personaId}`

**Not Implemented:**
- ❌ Create Memory Persona
- ❌ Update Memory Persona
- ❌ Delete Memory Persona

---

### 📷 Artifacts API (0/2) - 0% Coverage

**Not Implemented:**
- ❌ Update Memory Artifact (upload/replace file)
- ❌ Delete Memory Artifact Coverage

---

### 🗂️ Source Box API (0/11) - 0% Coverage

**Not Implemented:**
- ❌ Read User Source Folders
- ❌ Read User Source Descriptions
- ❌ Read Source Folders
- ❌ Create Source Folder
- ❌ Read Current User Source Descriptions
- ❌ Read User Defined Collection
- ❌ Update User Defined Collection
- ❌ Delete User Defined Collection
- ❌ Read User Defined Collection Descriptions
- ❌ Update Source Descriptions To Collection
- ❌ Delete Source Descriptions From Collections

---

### 🏛️ Standards APIs

#### Places API (2/14) - ~14% Coverage
- ✅ **Search Places** - `searchPlaces(name, options)` - `GET /platform/places/search`
- ✅ **Get Place** - `getPlace(placeId)` - `GET /platform/places/{pid}`

**Not Implemented:**
- ❌ Read Place Children
- ❌ Parent Places (search)
- ❌ Check If Place IsChild
- ❌ Read Place Descriptions
- ❌ Read Place Description
- ❌ Read Place Description With Related
- ❌ Read Place Descriptions Group (bulk)
- ❌ Read Place Description Attributes
- ❌ Read Place Types
- ❌ Read Place Type
- ❌ Read Place Type Groups
- ❌ Read Place Type Group

#### Dates API (1/1) - 100% Coverage
- ✅ **Standardize Date** - `standardizeDate(date)` - `GET /platform/dates`

#### Names API (2/3) - ~67% Coverage
- ✅ **Get Name Script** - `getNameScript(name)` - `GET /platform/names`
- ✅ **Segment a Name** - `segmentName(name, lang)` - `GET /platform/names/segments`

**Not Implemented:**
- ❌ Compose Full Name - `POST /platform/names/segments`

#### Vocabularies API (3/6) - 50% Coverage
- ✅ **Read Controlled Vocabulary List** - `getVocabularies()` - `GET /platform/vocabularies`
- ✅ **Search Controlled Vocabulary Terms** - `getVocabularyTerms(vocabularyId, query, options)` - `GET /platform/vocabularies/{vid}/concepts`
- ✅ **Read Controlled Vocabulary Term** - `getVocabularyConcept(vocabularyId, conceptId)` - `GET /platform/vocabularies/{vid}/concepts/{cid}`

**Not Implemented:**
- ❌ Read Controlled Vocabulary Term Translation
- ❌ Read Vocabulary Concept V2
- ❌ Read Vocabulary Concept Definition

---

### 📜 Change History API (1/7) - ~14% Coverage

#### Implemented:
- ✅ **Read Person Change History** - `getPersonChangeHistory(personId)` - `GET /platform/tree/persons/{pid}/changes`

**Not Implemented:**
- ❌ Read Person Change History Headers
- ❌ Read Child and Parents Change History
- ❌ Read Child and Parents Change History Headers
- ❌ Read Couple Relationship Change History
- ❌ Read Couple Relationship Change History Headers
- ❌ Restore Change

---

### 🌲 Community Trees (CET) API (0/14) - 0% Coverage

#### Groups (0/5)
- ❌ Read Group
- ❌ Update Group
- ❌ Delete Group
- ❌ Read User's Groups
- ❌ Create Group

#### Trees (0/8)
- ❌ Read CET Tree Person Ids
- ❌ Read Tree Matches
- ❌ Read Tree
- ❌ Update Tree
- ❌ Delete Tree
- ❌ Read Current Tree Id
- ❌ Set Current Tree Id
- ❌ Create Tree

#### CET Change History (0/1)
- ❌ Read Tree Changes

---

### 🧬 Genealogies API (0/21) - 0% Coverage

**Note:** This is a separate API structure for genealogy management.

#### Person (0/7)
- ❌ Read Genealogies Person
- ❌ Update Genealogies Person
- ❌ Delete Genealogies Person
- ❌ Read Genealogies Persons
- ❌ Create Genealogies Person
- ❌ Delete Conclusion
- ❌ Restore Person

#### Relationships (0/2)
- ❌ Update Relationship
- ❌ Delete Relationship

#### Sources (0/4)
- ❌ Read Source Description
- ❌ Update Source Description
- ❌ Delete Source Description
- ❌ Create Source Description

#### Matches (0/2)
- ❌ Read Genealogies Bulk Matches
- ❌ Read Genealogies Person Matches

#### Notes (0/1)
- ❌ Read Genealogies Note

#### Trees (0/5)
- ❌ Read Tree
- ❌ Update Tree
- ❌ Delete Tree
- ❌ Read Genealogies Trees
- ❌ Create Genealogies Tree

---

### 🔧 Utilities API (0/1) - 0% Coverage

**Not Implemented:**
- ❌ Read Pending Modifications

---

### 👨‍💼 Agent API (0/1) - 0% Coverage

**Not Implemented:**
- ❌ Read Agent (contributor/user info)

---

## 🎯 Priority Implementation Roadmap

### Phase 1: Core Write Operations (HIGH Priority) 🔴
**Impact:** Transform SDK from read-only to full-featured  
**Endpoints:** ~50  
**Effort:** 4-6 weeks

#### Person CRUD
- ❌ Create Person - `POST /platform/tree/persons`
- ❌ Update Person - `POST /platform/tree/persons/{pid}`
- ❌ Delete Person - `DELETE /platform/tree/persons/{pid}`
- ❌ Restore Person - `POST /platform/tree/persons/{pid}/restore`

#### Relationship CRUD
- ❌ Create Relationship - `POST /platform/tree/relationships`
- ❌ Update Couple Relationship - `POST /platform/tree/couple-relationships/{crid}`
- ❌ Update Child and Parents Relationship - `POST /platform/tree/child-and-parents-relationships/{caprid}`
- ❌ Delete Couple Relationship
- ❌ Delete Child and Parents Relationship

#### Conclusion Management
- ❌ Delete Person Conclusion
- ❌ Delete Relationship Conclusion
- ❌ Add/Update Facts (birth, death, marriage, etc.)

#### Person Merge
- ❌ Read Person Merge Analysis
- ❌ Execute Person Merge
- ❌ Allow Person Merge (OPTIONS)

---

### Phase 2: Collaboration & Sources (MEDIUM Priority) 🟡
**Impact:** Enable collaborative genealogy features  
**Endpoints:** ~40  
**Effort:** 3-4 weeks

#### Notes Management
- ❌ Create Person Note
- ❌ Update Person Note
- ❌ Delete Person Note
- ❌ Create Relationship Notes (both types)
- ❌ Update/Delete Relationship Notes

#### Source Attachments
- ❌ Create Source Reference (attach source to person/relationship)
- ❌ Delete Source Reference
- ❌ Create Source Description
- ❌ Update Source Description
- ❌ Delete Source Description

#### Discussions
- ❌ Create Discussion
- ❌ Read Discussion
- ❌ Update Discussion
- ❌ Add Comment
- ❌ Delete Comment

#### Source Box
- ❌ Read User Source Folders
- ❌ Create Source Folder
- ❌ Manage User Defined Collections

---

### Phase 3: Memories & Matches (MEDIUM Priority) 🟡
**Impact:** Complete media management and match handling  
**Endpoints:** ~20  
**Effort:** 2-3 weeks

#### Memories Upload
- ❌ Create Memory (upload photo/document/story)
- ❌ Update Memory
- ❌ Delete Memory
- ❌ Update Memory Artifact (file upload/replace)

#### Memory Personas
- ❌ Create Memory Persona (tag person in photo)
- ❌ Update Memory Persona
- ❌ Delete Memory Persona

#### Matches Management
- ❌ Update Match Resolution (accept/reject/dismiss)
- ❌ Not-a-Match Declarations (create/delete)

#### Portrait Management
- ❌ Update Person Portraits (set preferred)
- ❌ Delete Person Portrait

---

### Phase 4: Standards & Utilities (LOW Priority) 🟢
**Impact:** Data quality and validation tools  
**Endpoints:** ~20  
**Effort:** 2-3 weeks

#### Places Details
- ❌ Read Place Children
- ❌ Read Place Descriptions
- ❌ Read Place Types
- ❌ Read Place Type Groups

#### Names Processing
- ❌ Compose Full Name from parts

#### Vocabularies
- ❌ Read Vocabulary Term Translation
- ❌ Read Vocabulary Concept Definition

#### Utilities
- ❌ Read Pending Modifications

---

### Phase 5: CET & Advanced (LOW Priority) 🟢
**Impact:** Advanced collaboration features  
**Endpoints:** ~14  
**Effort:** 2-3 weeks

#### Groups Management
- ❌ Create/Read/Update/Delete Groups
- ❌ Read User's Groups

#### CET Trees
- ❌ Create/Read/Update/Delete CET Trees
- ❌ Set Current Tree Id
- ❌ Read Tree Matches
- ❌ Read Tree Changes

---

### Phase 6: Genealogies API (OPTIONAL) 🔵
**Impact:** Separate genealogy structure support  
**Endpoints:** ~21  
**Effort:** 3-4 weeks

#### Full Genealogies API Implementation
- ❌ Person operations (CRUD)
- ❌ Relationships (CRUD)
- ❌ Sources (CRUD)
- ❌ Matches (read)
- ❌ Notes (read)
- ❌ Trees (CRUD)

---

## 🔍 Notable Gaps & Considerations

### Critical Missing Features

1. **No Write Operations** ❌
   - SDK is currently **read-only**
   - Cannot create, update, or delete persons/relationships
   - Cannot attach sources or add notes
   - Cannot upload memories

2. **No Person Merge Support** ❌
   - Cannot read merge analysis
   - Cannot execute merges
   - Critical for deduplication workflows

3. **Limited Relationship Management** ⚠️
   - Can read relationships but not modify
   - Cannot set preferred relationships
   - Cannot manage parent/spouse order

4. **No Source Management** ❌
   - Can read sources but not attach/detach
   - Cannot create source descriptions
   - No Source Box (user library) support

5. **Limited Collaboration** ⚠️
   - Can read notes but not create/edit
   - Can read discussions but not participate
   - No commenting on persons/relationships

6. **No Memories Upload** ❌
   - Can read memories but not upload
   - Cannot manage personas (photo tagging)
   - Cannot replace artifact files

7. **No CET Support** ❌
   - No Community Trees functionality
   - No Groups management
   - No private research trees

8. **No Genealogies API** ❌
   - Entire separate API structure not implemented

---

## 💡 Recommendations

### Immediate Actions (1-2 weeks)

1. **Implement Person CRUD**
   - `createPerson()` - Most requested feature
   - `updatePerson()` - Essential for data editing
   - `deletePerson()` - Required for cleanup

2. **Implement Basic Source Management**
   - `attachSource()` - Attach existing source to person
   - `detachSource()` - Remove source reference
   - `createSourceDescription()` - Create new source

3. **Implement Notes CRUD**
   - `createPersonNote()` - Add notes to persons
   - `updatePersonNote()` - Edit existing notes
   - `deletePersonNote()` - Remove notes

### Short-term Goals (1-2 months)

1. **Complete Relationship Management**
   - Create/update/delete relationships
   - Set preferred relationships
   - Manage parent/spouse order

2. **Implement Discussion Support**
   - Create discussions
   - Add comments
   - Delete comments

3. **Add Memory Upload**
   - Create memories (upload files)
   - Manage personas (photo tagging)
   - Update artifacts

### Long-term Vision (3-6 months)

1. **Full CET Support**
   - Groups management
   - Private research trees
   - Tree matching

2. **Genealogies API**
   - Separate genealogy structure
   - Full CRUD operations

3. **Advanced Features**
   - Person merge operations
   - Source Box management
   - Pending modifications tracking

---

## 📝 SDK Strengths

### What Works Well ✅

1. **OAuth Implementation**
   - Complete OAuth v3 support
   - Secure token management

2. **Person Read Operations**
   - Comprehensive person data fetching
   - Enhanced pedigree with details
   - Good relationship traversal

3. **Search Functionality**
   - Full person search support
   - GEDCOM data matching
   - Record matching

4. **Standards APIs**
   - Date standardization
   - Name script detection
   - Place search

5. **Type Safety**
   - Comprehensive TypeScript types
   - Well-documented interfaces
   - Error handling with typed errors

6. **Developer Experience**
   - Clear method naming
   - Good JSDoc documentation
   - Helper utilities (GEDCOM converter, pedigree fetcher)

---

## 🚨 Breaking Changes to Avoid

When implementing missing endpoints, ensure:

1. **Backward Compatibility**
   - Don't modify existing method signatures
   - Add optional parameters only
   - Keep return types consistent

2. **Error Handling**
   - Maintain existing error types
   - Add new error types for write operations
   - Keep error messages clear

3. **Rate Limiting**
   - Existing rate limiter works well
   - Don't change retry behavior
   - Keep 429 handling automatic

4. **Authentication**
   - Keep OAuth flow unchanged
   - Don't modify token management
   - Maintain environment configs

---

## 📚 Resources

- **FamilySearch API Docs:** https://developers.familysearch.org/
- **SDK Repository:** (link to repo)
- **Issue Tracker:** (link to issues)
- **API Reference Guide:** https://developers.familysearch.org/main/reference/api-reference-guide

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-20  
**Author:** GitHub Copilot  
**Status:** ✅ Complete Analysis
