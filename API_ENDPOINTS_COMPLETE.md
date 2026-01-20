# FamilySearch API - Complete Endpoint Inventory

## Based on Official Sidebar Analysis (2026-01-18)

This document lists **ALL** available FamilySearch API endpoints from the official documentation sidebar.

---

## 🔐 Authentication Endpoints

### Identity
- ✅ **Get Authorization Page** - `GET` - OAuth authorization
- ✅ **Request an OAuth 2.0 Access Token** - `POST` - Token exchange

**SDK Status:** ✅ OAuth utilities implemented

---

## 👥 Family Tree Endpoints

### Persons (20+ endpoints)

#### Read Operations (Currently Implemented)
- ✅ **Read Current User Tree Person** - `GET /platform/tree/current-person`
- ✅ **Read Persons List** - `GET /platform/tree/persons` (bulk read)
- ✅ **Read Person** - `GET /platform/tree/persons/{pid}`
- ❌ **Read Person Headers** - `HEAD /platform/tree/persons/{pid}`
- ✅ **Read Children** - `GET /platform/tree/persons/{pid}/children`
- ❌ **Read Families** - `GET /platform/tree/persons/{pid}/families`
- ❌ **Read Parents** - `GET /platform/tree/persons/{pid}/parents`
- ❌ **Read Spouses** - `GET /platform/tree/persons/{pid}/spouses`

#### Write Operations (NOT Implemented)
- ❌ **Create Person** - `POST /platform/tree/persons`
- ❌ **Update Person** - `POST /platform/tree/persons/{pid}`
- ❌ **Delete Person** - `DELETE /platform/tree/persons/{pid}`
- ❌ **Restore Person** - `POST /platform/tree/persons/{pid}/restore`

#### Conclusion Management (NOT Implemented)
- ❌ **Delete Conclusion** - `DELETE /platform/tree/persons/{pid}/conclusions/{cid}`
- ❌ **Delete Tree Person Reference** - `DELETE /platform/tree/persons/{pid}/references/{refid}`

#### Person Merge Operations (NOT Implemented)
- ❌ **Read Person Merge** - `GET /platform/tree/persons/{pid}/merge`
- ❌ **Merge Person** - `POST /platform/tree/persons/{pid}/merge`
- ❌ **Allow Person Merge** - `OPTIONS /platform/tree/persons/{pid}/merge`

#### Person-Related Resources
- ✅ **Get Person Memory Descriptions** - `GET /platform/tree/persons/{pid}/memories` (implemented as `getPersonMemories`)
- ❌ **Create Person Memory** - `POST /platform/tree/persons/{pid}/memories`
- ❌ **Delete Memory Persona Reference** - `DELETE /platform/tree/persons/{pid}/memories/{mid}/personas/{personaid}`
- ❌ **Delete Discussion Reference** - `DELETE /platform/tree/persons/{pid}/discussions/{did}`

---

### Pedigrees (2 endpoints)
- ✅ **Read Ancestry** - `GET /platform/tree/ancestry`
- ✅ **Read Descendancy** - `GET /platform/tree/descendancy`

**SDK Status:** ✅ Both implemented

---

### Change History (7 endpoints)

#### Person Change History
- ✅ **Read Person Change History** - `GET /platform/tree/persons/{pid}/changes` (implemented)
- ❌ **Read Person Change History Headers** - `HEAD /platform/tree/persons/{pid}/changes`

#### Relationship Change History
- ❌ **Read Child and Parents Change History** - `GET /platform/tree/child-and-parents-relationships/{caprid}/changes`
- ❌ **Read Child and Parents Change History Headers** - `HEAD /platform/tree/child-and-parents-relationships/{caprid}/changes`
- ❌ **Read Couple Relationship Change History** - `GET /platform/tree/couple-relationships/{crid}/changes`
- ❌ **Read Couple Relationship Change History Headers** - `HEAD /platform/tree/couple-relationships/{crid}/changes`

#### Restore Operations
- ❌ **Restore Change** - `POST /platform/tree/changes/{changeId}/restore`

**SDK Status:** ⚠️ Only person change history implemented (1/7)

---

### Relationships: Child and Parents (11 endpoints)

#### Read Operations
- ✅ **Read Child and Parents Relationship** - `GET /platform/tree/child-and-parents-relationships/{caprid}` (implemented)
- ❌ **Read Child and Parents Relationship Headers** - `HEAD /platform/tree/child-and-parents-relationships/{caprid}`

#### Write Operations (NOT Implemented)
- ❌ **Update Child and Parents Relationship** - `POST /platform/tree/child-and-parents-relationships/{caprid}`
- ❌ **Delete Child and Parents Relationship** - `DELETE /platform/tree/child-and-parents-relationships/{caprid}`
- ❌ **Restore Child and Parents Relationship** - `POST /platform/tree/child-and-parents-relationships/{caprid}/restore`

#### Conclusion Management (NOT Implemented)
- ❌ **Delete Child and Parents Relationship Conclusion** - `DELETE /platform/tree/child-and-parents-relationships/{caprid}/conclusions/{cid}`

#### Parent Management (NOT Implemented)
- ❌ **Delete Parent from Child and Parents Relationship** - `DELETE /platform/tree/child-and-parents-relationships/{caprid}/parents/{parentId}`
- ❌ **Set Parent Order** - `POST /platform/tree/child-and-parents-relationships/{caprid}/parents/order`

#### Preferred Parent (NOT Implemented)
- ❌ **Read Preferred Parent Relationship** - `GET /platform/tree/persons/{pid}/preferred-parent-relationship`
- ❌ **Update Preferred Parent Relationship** - `PUT /platform/tree/persons/{pid}/preferred-parent-relationship`
- ❌ **Delete Preferred Parent Relationship** - `DELETE /platform/tree/persons/{pid}/preferred-parent-relationship`

**SDK Status:** ⚠️ Only read implemented (1/11)

---

### Relationships: Couple (10 endpoints)

#### Read Operations
- ✅ **Read Couple Relationship** - `GET /platform/tree/couple-relationships/{crid}` (implemented)
- ❌ **Read Couple Relationship Headers** - `HEAD /platform/tree/couple-relationships/{crid}`

#### Write Operations (NOT Implemented)
- ❌ **Update Couple Relationship** - `POST /platform/tree/couple-relationships/{crid}`
- ❌ **Delete Couple Relationship** - `DELETE /platform/tree/couple-relationships/{crid}`
- ❌ **Restore Couple Relationship** - `POST /platform/tree/couple-relationships/{crid}/restore`

#### Conclusion Management (NOT Implemented)
- ❌ **Delete Couple Relationship Conclusion** - `DELETE /platform/tree/couple-relationships/{crid}/conclusions/{cid}`

#### Spouse Order (NOT Implemented)
- ❌ **Set Couple Relationship Spouses Order** - `POST /platform/tree/couple-relationships/{crid}/spouses/order`

#### Preferred Spouse (NOT Implemented)
- ❌ **Read Preferred Spouse Relationship** - `GET /platform/tree/persons/{pid}/preferred-spouse-relationship`
- ❌ **Set Preferred Spouse Relationship** - `PUT /platform/tree/persons/{pid}/preferred-spouse-relationship`
- ❌ **Delete Preferred Spouse Relationship** - `DELETE /platform/tree/persons/{pid}/preferred-spouse-relationship`

**SDK Status:** ⚠️ Only read implemented (1/10)

---

### Relationships (General) (2 endpoints)
- ❌ **Find Relationship** - `GET /platform/tree/persons/{pid}/relationships/{pid2}` - Calculate relationship path
- ❌ **Create Relationship** - `POST /platform/tree/relationships` - Create any type of relationship

**SDK Status:** ❌ None implemented (0/2)

---

### Notes (15 endpoints)

#### Child and Parents Relationship Notes (NOT Implemented)
- ❌ **Read Child and Parents Relationship Note** - `GET /platform/tree/child-and-parents-relationships/{caprid}/notes/{nid}`
- ❌ **Update Child and Parents Relationship Note** - `POST /platform/tree/child-and-parents-relationships/{caprid}/notes/{nid}`
- ❌ **Delete Child and Parents Relationship Note** - `DELETE /platform/tree/child-and-parents-relationships/{caprid}/notes/{nid}`
- ❌ **Read Child and Parents Relationship Notes** - `GET /platform/tree/child-and-parents-relationships/{caprid}/notes`
- ❌ **Create Child and Parents Relationship Note** - `POST /platform/tree/child-and-parents-relationships/{caprid}/notes`

#### Couple Relationship Notes (NOT Implemented)
- ❌ **Read Couple Relationship Note** - `GET /platform/tree/couple-relationships/{crid}/notes/{nid}`
- ❌ **Update Couple Relationship Note** - `POST /platform/tree/couple-relationships/{crid}/notes/{nid}`
- ❌ **Delete Couple Relationship Note** - `DELETE /platform/tree/couple-relationships/{crid}/notes/{nid}`
- ❌ **Read Couple Relationship Notes** - `GET /platform/tree/couple-relationships/{crid}/notes`
- ❌ **Create Couple Relationship Note** - `POST /platform/tree/couple-relationships/{crid}/notes`

#### Person Notes (Partially Implemented)
- ✅ **Read Person Notes** - `GET /platform/tree/persons/{pid}/notes` (implemented as `getPersonNotes`)
- ❌ **Read Person Note** - `GET /platform/tree/persons/{pid}/notes/{nid}`
- ❌ **Create Person Note** - `POST /platform/tree/persons/{pid}/notes`
- ❌ **Update Person Note** - `POST /platform/tree/persons/{pid}/notes/{nid}`
- ❌ **Delete Person Note** - `DELETE /platform/tree/persons/{pid}/notes/{nid}`

**SDK Status:** ⚠️ Only person notes read implemented (1/15)

---

### Sources (17 endpoints)

#### Child and Parents Source References (NOT Implemented)
- ❌ **Read Child and Parents Source References** - `GET /platform/tree/child-and-parents-relationships/{caprid}/source-references`
- ❌ **Create Child and Parents Source Reference** - `POST /platform/tree/child-and-parents-relationships/{caprid}/source-references`
- ❌ **Delete Child and Parents Source Reference** - `DELETE /platform/tree/child-and-parents-relationships/{caprid}/source-references/{srid}`
- ❌ **Read Child and Parents Relationship Sources** - `GET /platform/tree/child-and-parents-relationships/{caprid}/sources`

#### Couple Source References (NOT Implemented)
- ❌ **Read Couple Relationship Source References** - `GET /platform/tree/couple-relationships/{crid}/source-references`
- ❌ **Create Couple Relationship Source Reference** - `POST /platform/tree/couple-relationships/{crid}/source-references`
- ❌ **Delete Couple Relationship Source Reference** - `DELETE /platform/tree/couple-relationships/{crid}/source-references/{srid}`
- ❌ **Read Couple Relationship Sources** - `GET /platform/tree/couple-relationships/{crid}/sources`

#### Person Source References (Partially Implemented)
- ✅ **Read Person Sources** - `GET /platform/tree/persons/{pid}/sources` (implemented as `getPersonSources`)
- ❌ **Delete Person Source Reference** - `DELETE /platform/tree/persons/{pid}/source-references/{srid}`

#### General Source References (NOT Implemented)
- ❌ **Read Source References** - `GET /platform/tree/source-references` - Bulk read

#### Source Descriptions (Partially Implemented)
- ✅ **Read Source Description** - `GET /platform/sources/descriptions/{sdid}` (implemented)
- ❌ **Update Source Description** - `POST /platform/sources/descriptions/{sdid}`
- ❌ **Delete Source Description** - `DELETE /platform/sources/descriptions/{sdid}`
- ❌ **Read Source Description Headers** - `HEAD /platform/sources/descriptions/{sdid}`
- ❌ **Create Source Description** - `POST /platform/sources/descriptions`
- ❌ **Get Source Description Changes** - `POST /platform/sources/descriptions/{sdid}/changes` - Compare versions

**SDK Status:** ⚠️ Only read operations implemented (2/17)

---

### Matches (8 endpoints)

#### Person Matches (Partially Implemented)
- ✅ **Read Person Matches by ID** - `GET /platform/tree/persons/{pid}/matches` (implemented as `getTreePersonMatches`)
- ❌ **Read Person Matches by ID Headers** - `HEAD /platform/tree/persons/{pid}/matches`
- ✅ **Read Person Matches by Example** - `POST /platform/tree/persons/{pid}/matches` - Match by person data (implemented as `matchPerson`)
- ❌ **Update Match Resolution** - `POST /platform/tree/persons/{pid}/matches/{mid}` - Accept/reject/dismiss

#### Not-a-Match Declarations (NOT Implemented)
- ❌ **Read Not-a-Match Declarations** - `GET /platform/tree/persons/{pid}/not-a-matches`
- ❌ **Update Not-a-Match Declaration** - `POST /platform/tree/persons/{pid}/not-a-matches`
- ❌ **Delete Not-a-Match Declarations** - `DELETE /platform/tree/persons/{pid}/not-a-matches` - Bulk delete
- ❌ **Delete Not-a-Match Declaration** - `DELETE /platform/tree/persons/{pid}/not-a-matches/{mid}` - Single delete

**SDK Status:** ⚠️ Basic read and match implemented (2/8)

---

### Portraits (4 endpoints)
- ✅ **Read Person Portraits** - `GET /platform/tree/persons/{pid}/portraits` (implemented as `getPersonPortraits`)
- ❌ **Read Person Portrait** - `GET /platform/tree/persons/{pid}/portraits/{pid2}`
- ❌ **Update Person Portraits** - `POST /platform/tree/persons/{pid}/portraits`
- ❌ **Delete Person Portrait** - `DELETE /platform/tree/persons/{pid}/portraits/{pid2}`

**SDK Status:** ⚠️ Only list read implemented (1/4)

---

### Search (1 endpoint)
- ✅ **Search Tree Persons** - `GET /platform/tree/search` (implemented as `searchPersons`)

**SDK Status:** ✅ Implemented

---

### Discussions (7 endpoints)

#### Discussion Management (NOT Implemented)
- ❌ **Create Discussion** - `POST /platform/discussions`
- ❌ **Read Discussion** - `GET /platform/discussions/{did}`
- ❌ **Update Discussion** - `POST /platform/discussions/{did}`
- ❌ **Read Discussion Headers** - `HEAD /platform/discussions/{did}`

#### Comments (Partially Implemented)
- ❌ **Read Comments** - `GET /platform/discussions/{did}/comments`
- ❌ **Update Comments** - `POST /platform/discussions/{did}/comments` - Add comment
- ❌ **Delete Comment** - `DELETE /platform/discussions/{did}/comments/{cid}`

**Note:** SDK has `getPersonDiscussions` which reads discussion references on a person, but not the actual Discussion API.

**SDK Status:** ⚠️ Only person discussion references (1/7)

---

### Source Box (11 endpoints)

#### User Source Folders (NOT Implemented)
- ❌ **Read User Source Folders** - `GET /platform/users/current/source-folders`
- ❌ **Read User Source Descriptions** - `GET /platform/users/current/source-descriptions`
- ❌ **Read Source Folders** - `GET /platform/sources/folders`
- ❌ **Create Source Folder** - `POST /platform/sources/folders`
- ❌ **Read Current User Source Descriptions** - `GET /platform/sources/descriptions`

#### User Defined Collections (NOT Implemented)
- ❌ **Read User Defined Collection** - `GET /platform/sources/collections/{cid}`
- ❌ **Update User Defined Collection** - `POST /platform/sources/collections/{cid}`
- ❌ **Delete User Defined Collection** - `DELETE /platform/sources/collections/{cid}`
- ❌ **Read User Defined Collection Descriptions** - `GET /platform/sources/collections/{cid}/source-descriptions`
- ❌ **Update Source Descriptions To Collection** - `POST /platform/sources/collections/{cid}/source-descriptions`
- ❌ **Delete Source Descriptions From Collections** - `DELETE /platform/sources/source-descriptions/{sdid}/collections`

**SDK Status:** ❌ None implemented (0/11)

---

## 🌳 CET Endpoints (Community/Editable Trees)

### Groups (5 endpoints) - NOT Implemented
- ❌ **Read Group** - `GET /platform/groups/{gid}`
- ❌ **Update Group** - `POST /platform/groups/{gid}`
- ❌ **Delete Group** - `DELETE /platform/groups/{gid}`
- ❌ **Read User's Groups** - `GET /platform/groups`
- ❌ **Create Group** - `POST /platform/groups`

**SDK Status:** ❌ None implemented (0/5)

---

### Trees (CET) (8 endpoints) - NOT Implemented
- ❌ **Read CET Tree Person Ids** - `GET /platform/tree/trees/{tid}/persons`
- ❌ **Read Tree Matches** - `GET /platform/tree/trees/{tid}/matches`
- ❌ **Read Tree** - `GET /platform/tree/trees/{tid}`
- ❌ **Update Tree** - `POST /platform/tree/trees/{tid}`
- ❌ **Delete Tree** - `DELETE /platform/tree/trees/{tid}`
- ❌ **Read Current Tree Id** - `GET /platform/tree/trees/current`
- ❌ **Set Current Tree Id** - `POST /platform/tree/trees/current`
- ❌ **Create Tree** - `POST /platform/tree/trees`

**SDK Status:** ❌ None implemented (0/8)

---

### Change History (CET) (1 endpoint) - NOT Implemented
- ❌ **Read Tree Changes** - `GET /platform/tree/trees/{tid}/changes`

**SDK Status:** ❌ None implemented (0/1)

---

## 📸 Memories Endpoints

### Memories (6 endpoints)
- ❌ **Create Memory** - `POST /platform/memories` - Upload photo/document/story
- ✅ **Read Memory** - `GET /platform/memories/{mid}` (implemented as `getMemory`)
- ❌ **Read Memories** - `GET /platform/memories` - Bulk read
- ✅ **Read User Memories** - `GET /platform/memories` with user filter (implemented as `getUserMemories`)
- ❌ **Update Memory** - `POST /platform/memories/{mid}`
- ❌ **Delete Memory** - `DELETE /platform/memories/{mid}`

**SDK Status:** ⚠️ Only read operations (2/6)

---

### Artifacts (2 endpoints) - NOT Implemented
- ❌ **Update Memory Artifact** - `POST /platform/memories/{mid}/artifact` - Upload/replace file
- ❌ **Delete Memory Artifact Coverage** - `DELETE /platform/memories/{mid}/artifact/coverage/{cid}` - Remove coverage region

**SDK Status:** ❌ None implemented (0/2)

---

### Personas (5 endpoints)
- ❌ **Create Memory Persona** - `POST /platform/memories/{mid}/personas`
- ✅ **Read Memory Persona** - `GET /platform/memories/{mid}/personas/{personaid}` (implemented as `getMemoryPersona`)
- ✅ **Read Memory Personas** - `GET /platform/memories/{mid}/personas` (implemented as `getMemoryPersonas`)
- ❌ **Update Memory Persona** - `POST /platform/memories/{mid}/personas/{personaid}`
- ❌ **Delete Memory Persona** - `DELETE /platform/memories/{mid}/personas/{personaid}`

**SDK Status:** ⚠️ Only read operations (2/5)

---

### Comments (Memories) (3 endpoints)
- ❌ **Create Memory Comments** - `POST /platform/memories/{mid}/comments`
- ✅ **Read Memory Comments** - `GET /platform/memories/{mid}/comments` (implemented as `getMemoryComments`)
- ❌ **Delete Memory Comment** - `DELETE /platform/memories/{mid}/comments/{cid}`

**SDK Status:** ⚠️ Only read implemented (1/3)

---

## 🏛️ Standards Endpoints

### Dates (1 endpoint)
- ✅ **Standardize Date** - `GET /platform/dates` (implemented as `standardizeDate`)

**SDK Status:** ✅ Fully implemented (1/1)

---

### Places (14 endpoints)

#### Place Search and Read (Partially Implemented)
- ✅ **Places Search** - `GET /platform/places` (implemented as `searchPlaces`)
- ✅ **Read Place** - `GET /platform/places/{pid}` (implemented as `getPlace`)
- ❌ **Read Place Children** - `GET /platform/places/{pid}/children`
- ❌ **Parent Places** - `GET /platform/places/parent` - Search for parent places
- ❌ **Check If Place IsChild** - `GET /platform/places/{pid}/children/{childId}`

#### Place Descriptions (NOT Implemented)
- ❌ **Read Place Descriptions** - `GET /platform/places/{pid}/descriptions`
- ❌ **Read Place Description** - `GET /platform/places/descriptions/{pdid}`
- ❌ **Read Place Description With Related** - `GET /platform/places/descriptions/{pdid}/related`
- ❌ **Read Place Descriptions Group** - `GET /platform/places/descriptions` - Bulk read
- ❌ **Read Place Description Attributes** - `GET /platform/places/descriptions/{pdid}/attributes`

#### Place Types (NOT Implemented)
- ❌ **Read Place Types** - `GET /platform/places/types`
- ❌ **Read Place Type** - `GET /platform/places/types/{ptid}`
- ❌ **Read Place Type Groups** - `GET /platform/places/type-groups`
- ❌ **Read Place Type Group** - `GET /platform/places/type-groups/{tgid}`

**SDK Status:** ⚠️ Only basic search/read (2/14)

---

### Names (3 endpoints)
- ✅ **Get Name Script** - `GET /platform/names` (implemented as `getNameScript`) - Detect writing system
- ✅ **Segment a Name** - `GET /platform/names/segments` (implemented as `segmentName`) - Parse name into parts
- ❌ **Compose Full Name** - `POST /platform/names/segments` - Create full name from parts

**SDK Status:** ⚠️ Read operations implemented (2/3)

---

### Vocabularies (6 endpoints)
- ✅ **Search Controlled Vocabulary Terms** - `GET /platform/vocabularies/{vid}/concepts` (implemented as `getVocabularyTerms`)
- ✅ **Read Controlled Vocabulary Term** - `GET /platform/vocabularies/{vid}/concepts/{cid}` (implemented as `getVocabularyConcept`)
- ❌ **Read Controlled Vocabulary Term Translation** - `GET /platform/vocabularies/{vid}/concepts/{cid}/translations/{lang}`
- ❌ **Read Vocabulary Concept V2** - `GET /platform/vocabularies/concepts/{cid}`
- ❌ **Read Vocabulary Concept Definition** - `GET /platform/vocabularies/concepts/{cid}/definition`
- ✅ **Read Controlled Vocabulary List** - `GET /platform/vocabularies` (implemented as `getVocabularies`)

**SDK Status:** ⚠️ Basic operations implemented (3/6)

---

## 👤 User Endpoints

### Agent (1 endpoint) - NOT Implemented
- ❌ **Read Agent** - `GET /platform/agents/{aid}` - Get contributor/user info

**SDK Status:** ❌ None implemented (0/1)

---

### Users (7 endpoints)
- ✅ **Read Current User** - `GET /platform/users/current` (implemented as `getCurrentUser`)
- ❌ **Create Partner Account** - `GET /platform/users/partner-account` - DEPRECATED
- ❌ **Update Partner Account** - `POST /platform/users/partner-account` - DEPRECATED
- ❌ **Read Partner Eligibility** - `GET /platform/users/partner-eligibility`
- ❌ **Read User History** - `GET /platform/users/current/history`
- ❌ **Update User History** - `POST /platform/users/current/history`
- ❌ **Delete User History Entry** - `DELETE /platform/users/current/history/{eid}`

**SDK Status:** ⚠️ Only current user read (1/7)

---

## 🔧 Utilities Endpoints

### Utilities (1 endpoint) - NOT Implemented
- ❌ **Read Pending Modifications** - `GET /platform/tree/persons/{pid}/pending-modifications` - View pending merges

**SDK Status:** ❌ None implemented (0/1)

---

## 🧬 Genealogies Endpoints (Separate API Structure)

### Person (Genealogies) (7 endpoints) - NOT Implemented
- ❌ **Read Genealogies Person** - `GET /platform/genealogies/{gid}/persons/{pid}`
- ❌ **Update Genealogies Person** - `POST /platform/genealogies/{gid}/persons/{pid}`
- ❌ **Delete Genealogies Person** - `DELETE /platform/genealogies/{gid}/persons/{pid}`
- ❌ **Read Genealogies Persons** - `GET /platform/genealogies/{gid}/persons`
- ❌ **Create Genealogies Person** - `POST /platform/genealogies/{gid}/persons`
- ❌ **Delete Conclusion** - `DELETE /platform/genealogies/{gid}/persons/{pid}/conclusions/{cid}`
- ❌ **Restore Person** - `POST /platform/genealogies/{gid}/persons/{pid}/restore`

**SDK Status:** ❌ None implemented (0/7)

---

### Relationships (Genealogies) (2 endpoints) - NOT Implemented
- ❌ **Update Relationship** - `POST /platform/genealogies/{gid}/relationships/{rid}`
- ❌ **Delete Relationship** - `DELETE /platform/genealogies/{gid}/relationships/{rid}`

**SDK Status:** ❌ None implemented (0/2)

---

### Sources (Genealogies) (4 endpoints) - NOT Implemented
- ❌ **Read Source Description** - `GET /platform/genealogies/{gid}/sources/descriptions/{sdid}`
- ❌ **Update Source Description** - `POST /platform/genealogies/{gid}/sources/descriptions/{sdid}`
- ❌ **Delete Source Description** - `DELETE /platform/genealogies/{gid}/sources/descriptions/{sdid}`
- ❌ **Create Source Description** - `POST /platform/genealogies/{gid}/sources/descriptions`

**SDK Status:** ❌ None implemented (0/4)

---

### Matches (Genealogies) (2 endpoints) - NOT Implemented
- ❌ **Read Genealogies Bulk Matches** - `GET /platform/genealogies/{gid}/matches`
- ❌ **Read Genealogies Person Matches** - `GET /platform/genealogies/{gid}/persons/{pid}/matches`

**SDK Status:** ❌ None implemented (0/2)

---

### Notes (Genealogies) (1 endpoint) - NOT Implemented
- ❌ **Read Genealogies Note** - `GET /platform/genealogies/{gid}/notes/{nid}`

**SDK Status:** ❌ None implemented (0/1)

---

### Trees (Genealogies) (5 endpoints) - NOT Implemented
- ❌ **Read Tree** - `GET /platform/genealogies/trees/{tid}`
- ❌ **Update Tree** - `POST /platform/genealogies/trees/{tid}`
- ❌ **Delete Tree** - `DELETE /platform/genealogies/trees/{tid}`
- ❌ **Read Genealogies Trees** - `GET /platform/genealogies/trees`
- ❌ **Create Genealogies Tree** - `POST /platform/genealogies/trees`

**SDK Status:** ❌ None implemented (0/5)

---

## 📊 Summary Statistics

### Total Endpoints by Category

| Category | Total | Implemented | Partial | Missing | Coverage |
|----------|-------|-------------|---------|---------|----------|
| **Authentication** | 2 | 2 | 0 | 0 | 100% |
| **Persons** | 20+ | 8 | 0 | 12+ | ~40% |
| **Pedigrees** | 2 | 2 | 0 | 0 | 100% |
| **Change History** | 7 | 1 | 0 | 6 | ~14% |
| **Relationships: Child-Parents** | 11 | 1 | 0 | 10 | ~9% |
| **Relationships: Couple** | 10 | 1 | 0 | 9 | ~10% |
| **Relationships (General)** | 2 | 0 | 0 | 2 | 0% |
| **Notes** | 15 | 1 | 0 | 14 | ~7% |
| **Sources** | 17 | 2 | 0 | 15 | ~12% |
| **Matches** | 8 | 2 | 0 | 6 | ~25% |
| **Portraits** | 4 | 1 | 0 | 3 | ~25% |
| **Search** | 1 | 1 | 0 | 0 | 100% |
| **Discussions** | 7 | 1 | 0 | 6 | ~14% |
| **Source Box** | 11 | 0 | 0 | 11 | 0% |
| **Groups (CET)** | 5 | 0 | 0 | 5 | 0% |
| **Trees (CET)** | 8 | 0 | 0 | 8 | 0% |
| **CET Change History** | 1 | 0 | 0 | 1 | 0% |
| **Memories** | 6 | 3 | 0 | 3 | 50% |
| **Artifacts** | 2 | 0 | 0 | 2 | 0% |
| **Personas** | 5 | 2 | 0 | 3 | 40% |
| **Memory Comments** | 3 | 1 | 0 | 2 | ~33% |
| **Dates** | 1 | 1 | 0 | 0 | 100% |
| **Places** | 14 | 2 | 0 | 12 | ~14% |
| **Names** | 3 | 2 | 0 | 1 | ~67% |
| **Vocabularies** | 6 | 3 | 0 | 3 | 50% |
| **Agent** | 1 | 0 | 0 | 1 | 0% |
| **Users** | 7 | 1 | 0 | 6 | ~14% |
| **Utilities** | 1 | 0 | 0 | 1 | 0% |
| **Genealogies: Person** | 7 | 0 | 0 | 7 | 0% |
| **Genealogies: Relationships** | 2 | 0 | 0 | 2 | 0% |
| **Genealogies: Sources** | 4 | 0 | 0 | 4 | 0% |
| **Genealogies: Matches** | 2 | 0 | 0 | 2 | 0% |
| **Genealogies: Notes** | 1 | 0 | 0 | 1 | 0% |
| **Genealogies: Trees** | 5 | 0 | 0 | 5 | 0% |
| **TOTAL** | **~200+** | **~30** | **0** | **~170** | **~15%** |

---

## 🎯 Key Findings

### What's Implemented (30 endpoints ~15%)
1. ✅ **OAuth Authentication** (2/2)
2. ✅ **Basic Person Read** (8 endpoints)
3. ✅ **Pedigrees** (2/2)
4. ✅ **Basic Relationship Read** (2 endpoints)
5. ✅ **Person Search** (1/1)
6. ✅ **Basic Places** (2 endpoints)
7. ✅ **Basic Sources Read** (2 endpoints)
8. ✅ **Basic Memories Read** (3 endpoints)
9. ✅ **Memory Personas** (2 endpoints)
10. ✅ **Date Standardization** (1 endpoint)
11. ✅ **Name Processing** (2 endpoints)
12. ✅ **Vocabularies** (3 endpoints)
13. ✅ **Person Matches** (2 endpoints)
14. ✅ **Miscellaneous** (notes, discussions refs, portraits, change history)

### Major Gaps (170+ endpoints missing ~85%)

#### Priority 1: Core CRUD Operations (~50 endpoints)
- ❌ **Person Write** (Create, Update, Delete, Restore)
- ❌ **Relationship Write** (Create, Update, Delete for both types)
- ❌ **Conclusion Management** (Add/Update/Delete facts on persons/relationships)
- ❌ **Person Merge** (Read merge analysis, execute merge)

#### Priority 2: Collaboration Features (~40 endpoints)
- ❌ **Notes Management** (Create, Update, Delete on persons/relationships)
- ❌ **Source Management** (Attach, Detach sources)
- ❌ **Discussions** (Create, Update, Delete discussions and comments)
- ❌ **Source Box** (User source library management)

#### Priority 3: Advanced Features (~30 endpoints)
- ❌ **Memories Upload** (Upload artifacts, manage personas)
- ❌ **Matches Management** (Accept/reject/dismiss, not-a-match declarations)
- ❌ **Portrait Management** (Set preferred, manage portraits)
- ❌ **Change History Advanced** (Relationship history, restore operations)

#### Priority 4: Utilities & Standards (~20 endpoints)
- ❌ **Date Standardization** (Parse and format dates)
- ❌ **Name Processing** (Script detection, segmentation)
- ❌ **Vocabularies** (Access controlled vocabularies)
- ❌ **Place Details** (Types, descriptions, hierarchy)

#### Priority 5: Community Trees (CET) (~14 endpoints)
- ❌ **Groups** (Collaboration groups)
- ❌ **CET Trees** (Private research trees)
- ❌ **CET Operations** (All CRUD on CET-specific data)

#### Priority 6: Genealogies API (~21 endpoints)
- ❌ **Entire Genealogies structure** (Separate API for genealogy management)

---

## 🚀 Recommended Implementation Roadmap

### Phase 1: Core Write Operations (HIGH Priority)
**Endpoints:** ~50 | **Effort:** 4-6 weeks | **Value:** Transform to full-featured SDK

1. Person CRUD (Create, Update, Delete, Restore)
2. Relationship CRUD (both types)
3. Conclusion Management (facts on persons/relationships)
4. Person Merge operations

### Phase 2: Collaboration & Sources (MEDIUM Priority)
**Endpoints:** ~40 | **Effort:** 3-4 weeks | **Value:** Enable collaborative genealogy

1. Notes Management (all types)
2. Source Attachments (create/delete references)
3. Discussions (full CRUD)
4. Source Box (user source management)

### Phase 3: Memories & Matches (MEDIUM Priority)
**Endpoints:** ~20 | **Effort:** 2-3 weeks | **Value:** Complete media management

1. Memories Upload & Management
2. Memory Personas
3. Matches Management (accept/reject/dismiss)
4. Portrait Management

### Phase 4: Standards & Utilities (LOW Priority)
**Endpoints:** ~20 | **Effort:** 2-3 weeks | **Value:** Data quality tools

1. Date Standardization
2. Name Processing
3. Place Details (types, descriptions)
4. Vocabularies

### Phase 5: CET & Advanced (LOW Priority)
**Endpoints:** ~14 | **Effort:** 2-3 weeks | **Value:** Advanced collaboration

1. Groups Management
2. CET Trees (private trees)
3. Advanced Change History

### Phase 6: Genealogies API (OPTIONAL)
**Endpoints:** ~21 | **Effort:** 3-4 weeks | **Value:** Separate genealogy structure

1. Genealogies Person operations
2. Genealogies Relationships
3. Genealogies Sources
4. Genealogies Trees

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-20  
**Total Endpoints Tracked:** ~200  
**Current SDK Coverage:** ~15% (30/200)

---

## 📚 Additional Resources

For detailed analysis and implementation recommendations, see:
- **[API Coverage Analysis](./API_COVERAGE_ANALYSIS.md)** - Full English analysis with implementation roadmap
- **[API Coverage Analysis (Hungarian)](./API_COVERAGE_ANALYSIS_HU.md)** - Hungarian summary and recommendations
