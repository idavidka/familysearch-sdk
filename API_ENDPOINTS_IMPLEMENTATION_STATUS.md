# FamilySearch SDK - API Implementation Status

**Last Updated:** 2026-01-20  
**SDK Version:** 2.0.0  
**Total Implemented Functions:** ~124

---

## ✅ FULLY IMPLEMENTED MODULES (100% Coverage)

### 1. **Persons API** (Core CRUD + Advanced) ✅
- ✅ `getPerson()` - Read person
- ✅ `getPersonWithDetails()` - Read person with relationships
- ✅ `createPerson()` - Create person
- ✅ `updatePerson()` - Update person
- ✅ `deletePerson()` - Delete person
- ✅ `restorePerson()` - Restore deleted person
- ✅ `getPersonChangeHistory()` - Person change history
- ✅ `getPersonFamilies()` - All family relationships
- ✅ `getPersonParents()` - Direct parents
- ✅ `getPersonSpouses()` - All spouses
- ✅ `getPersonNotes()` - Person notes
- ✅ `getPersonMemories()` - Person memories
- ✅ `getPersonSources()` - Person sources
- ✅ `getPersonDiscussions()` - Person discussions
- ✅ `getPersonPortraits()` - Person portraits
- ✅ `updatePersonPortraits()` - Set preferred portrait
- ✅ `deletePersonPortrait()` - Remove portrait
- ❌ `headPerson()` - HEAD request (not implemented)
- ❌ `readPersonChildren()` - Children endpoint (not verified)

**Status:** 17/19 endpoints (89%)

---

### 2. **Relationships API** (Couple + Child-Parents) ✅
- ✅ `getCoupleRelationship()` - Read couple relationship
- ✅ `createCoupleRelationship()` - Create couple relationship
- ✅ `updateCoupleRelationship()` - Update couple relationship
- ✅ `deleteCoupleRelationship()` - Delete couple relationship
- ✅ `getChildAndParentsRelationship()` - Read child-parent relationship
- ✅ `createChildAndParentsRelationship()` - Create child-parent relationship
- ✅ `updateChildAndParentsRelationship()` - Update child-parent relationship
- ✅ `deleteChildAndParentsRelationship()` - Delete child-parent relationship
- ✅ `getCoupleRelationshipChangeHistory()` - Couple change history
- ✅ `getChildAndParentsRelationshipChangeHistory()` - Child-parent change history
- ✅ `restoreChange()` - Restore from change history
- ✅ `setParentOrder()` - Set parent display order
- ✅ `setSpouseOrder()` - Set spouse display order
- ❌ `headCoupleRelationship()` - HEAD request (not implemented)
- ❌ `headChildAndParentsRelationship()` - HEAD request (not implemented)
- ❌ `restoreCoupleRelationship()` - Restore relationship (not verified)
- ❌ `restoreChildAndParentsRelationship()` - Restore relationship (not verified)

**Status:** 13/17 endpoints (76%)

---

### 3. **Preferred Relationships API** ✅
- ✅ `getPreferredParentRelationship()` - Read preferred parent
- ✅ `setPreferredParentRelationship()` - Set preferred parent
- ✅ `deletePreferredParentRelationship()` - Delete preferred parent
- ✅ `getPreferredSpouseRelationship()` - Read preferred spouse
- ✅ `setPreferredSpouseRelationship()` - Set preferred spouse
- ✅ `deletePreferredSpouseRelationship()` - Delete preferred spouse

**Status:** 6/6 endpoints (100%)

---

### 4. **Conclusions API** ✅
- ✅ `deletePersonConclusion()` - Delete person fact/name/gender
- ✅ `deleteCoupleRelationshipConclusion()` - Delete couple fact
- ✅ `deleteChildAndParentsRelationshipConclusion()` - Delete child-parent fact

**Status:** 3/3 endpoints (100%)

---

### 5. **Notes API** (Person + Relationships) ✅
- ✅ `getPersonNotes()` - Read all person notes
- ✅ `getPersonNote()` - Read single person note
- ✅ `createPersonNote()` - Create person note
- ✅ `updatePersonNote()` - Update person note
- ✅ `deletePersonNote()` - Delete person note
- ✅ `getCoupleRelationshipNotes()` - Read couple notes
- ✅ `getCoupleRelationshipNote()` - Read single couple note
- ✅ `createCoupleRelationshipNote()` - Create couple note
- ✅ `updateCoupleRelationshipNote()` - Update couple note
- ✅ `deleteCoupleRelationshipNote()` - Delete couple note
- ✅ `getChildAndParentsRelationshipNotes()` - Read child-parent notes
- ✅ `getChildAndParentsRelationshipNote()` - Read single child-parent note
- ✅ `createChildAndParentsRelationshipNote()` - Create child-parent note
- ✅ `updateChildAndParentsRelationshipNote()` - Update child-parent note
- ✅ `deleteChildAndParentsRelationshipNote()` - Delete child-parent note

**Status:** 15/15 endpoints (100%)

---

### 6. **Source Attachments API** ✅
- ✅ `attachSourceToPerson()` - Attach source to person
- ✅ `detachSourceFromPerson()` - Detach source from person
- ✅ `attachSourceToCoupleRelationship()` - Attach source to couple
- ✅ `detachSourceFromCoupleRelationship()` - Detach source from couple
- ✅ `attachSourceToChildAndParentsRelationship()` - Attach source to child-parent
- ✅ `detachSourceFromChildAndParentsRelationship()` - Detach source from child-parent

**Status:** 6/6 endpoints (100%)

---

### 7. **Source Descriptions API** ✅
- ✅ `getSourceDescriptions()` - Read source descriptions
- ✅ `getSourceDescription()` - Read single source description
- ✅ `createSourceDescription()` - Create source
- ✅ `updateSourceDescription()` - Update source
- ✅ `deleteSourceDescription()` - Delete source
- ❌ `getSourceDescriptionChanges()` - Source change history (not implemented)

**Status:** 5/6 endpoints (83%)

---

### 8. **Person Merges API** ✅
- ✅ `getPersonMergeAnalysis()` - Analyze merge compatibility
- ✅ `canMergePersons()` - Check if merge allowed
- ✅ `mergePerson()` - Execute merge

**Status:** 3/3 endpoints (100%)

---

### 9. **Pedigrees API** ✅
- ✅ `getAncestry()` - Read ancestry pedigree
- ✅ `getDescendancy()` - Read descendancy pedigree

**Status:** 2/2 endpoints (100%)

---

### 10. **Search API** ✅
- ✅ `searchPersons()` - Search for persons

**Status:** 1/1 endpoints (100%)

---

### 11. **Matches API** ✅
- ✅ `getPersonMatches()` - Read person matches
- ✅ `getPersonNonMatches()` - Read non-matches (deprecated?)
- ✅ `updateMatchResolution()` - Accept/reject/dismiss match
- ✅ `getNotAMatchDeclarations()` - Read not-a-match declarations
- ✅ `createNotAMatchDeclaration()` - Create not-a-match declaration
- ✅ `deleteNotAMatchDeclaration()` - Delete single declaration
- ✅ `deleteAllNotAMatchDeclarations()` - Bulk delete declarations
- ❌ `headPersonMatches()` - HEAD request (not implemented)

**Status:** 7/8 endpoints (88%)

---

### 12. **Memories API** ✅
- ✅ `getMemories()` - Read memories
- ✅ `getMemory()` - Read single memory
- ✅ `createMemory()` - Create memory
- ✅ `updateMemory()` - Update memory
- ✅ `deleteMemory()` - Delete memory
- ✅ `getMemoryPersonas()` - Read memory personas
- ✅ `getMemoryPersona()` - Read single persona
- ✅ `createMemoryPersona()` - Create persona (tag person)
- ✅ `updateMemoryPersona()` - Update persona
- ✅ `deleteMemoryPersona()` - Delete persona
- ✅ `getMemoryComments()` - Read memory comments
- ✅ `createMemoryComment()` - Create comment
- ✅ `deleteMemoryComment()` - Delete comment
- ✅ `updateMemoryArtifact()` - Update artifact metadata
- ✅ `deleteMemoryArtifactCoverage()` - Delete coverage region

**Status:** 15/15 endpoints (100%)

---

### 13. **Discussions API** ✅
- ✅ `getDiscussion()` - Read discussion
- ✅ `createDiscussion()` - Create discussion
- ✅ `updateDiscussion()` - Update discussion
- ✅ `getDiscussionComments()` - Read comments
- ✅ `addDiscussionComment()` - Add comment
- ✅ `deleteDiscussionComment()` - Delete comment
- ❌ `headDiscussion()` - HEAD request (not implemented)

**Status:** 6/7 endpoints (86%)

---

## 🟡 PARTIALLY IMPLEMENTED MODULES

### 14. **Places API** ✅
- ✅ `searchPlaces()` - Search places
- ✅ `getPlaceDetails()` - Read place details
- ✅ `getPlaceChildren()` - Read child places
- ✅ `getPlaceDescriptions()` - Read place descriptions
- ✅ `getPlaceDescription()` - Read single place description
- ✅ `getPlaceTypes()` - Get place type vocabulary
- ✅ `getPlaceType()` - Get single place type
- ✅ `getPlaceTypeGroups()` - Get place type groups
- ✅ `searchParentPlaces()` - Search for parent places
- ✅ `checkPlaceIsChild()` - Verify parent-child relationship
- ❌ `getPlaceAttributes()` - Read place attributes (not verified)
- ❌ `getPlaceDescriptionWithRelated()` - Read with related (not verified)
- ❌ `getPlaceDescriptionsGroup()` - Read descriptions group (not verified)

**Status:** 10/13 endpoints (77%)

---

### 15. **Standards API** (Date standardization) ✅
- ✅ `standardizeDate()` - Standardize date
- ✅ `getNameScript()` - Get name script
- ✅ `getNameSegments()` - Parse name segments
- ✅ `createNameSegments()` - Create name from segments

**Status:** 4/4 endpoints (100%)

---

### 16. **User API** ✅
- ✅ `getCurrentUser()` - Read current user
- ✅ `createPartnerAccount()` - Create partner account
- ✅ `updatePartnerAccount()` - Update partner account
- ✅ `checkPartnerEligibility()` - Check eligibility
- ✅ `getUserHistory()` - Read user history
- ✅ `updateUserHistory()` - Update user history
- ✅ `deleteUserAccount()` - Delete user account

**Status:** 7/7 endpoints (100%)

---

## 🟡 PARTIALLY IMPLEMENTED MODULES

### 17. **Source Box / User Defined Collections** ✅
- ✅ `getUserSourceFolders()` - Get user's source folders
- ✅ `getSourceFolders()` - Get source folder list
- ✅ `createSourceFolder()` - Create new folder
- ✅ `getUserDefinedCollection()` - Get collection details
- ✅ `updateUserDefinedCollection()` - Update collection
- ✅ `deleteUserDefinedCollection()` - Delete collection
- ✅ `getCollectionSourceDescriptions()` - Get sources in collection
- ✅ `addSourcesToCollection()` - Add sources to collection
- ✅ `removeSourcesFromCollection()` - Remove sources from collection

**Status:** 9/10 endpoints (90%)

---

## 🟡 PARTIALLY IMPLEMENTED MODULES

### 18. **Agent API** ✅
- ✅ `getAgent()` - Read agent (contributor/organization) information

**Status:** 1/1 endpoints (100%)

---

## ❌ NOT IMPLEMENTED MODULES

### 19. **Groups / Community Trees (CET)** ❌
- ❌ `readGroup()`, `updateGroup()`, `deleteGroup()`
- ❌ `getGroups()`, `createGroup()`
- **Estimated endpoints:** 5

---

### 19. **Genealogies API** (Research Trees) ❌
- ❌ All genealogies endpoints (separate from main tree)
- **Estimated endpoints:** 15+

---

### 20. **Vocab/Standards (Advanced)** ❌
- ❌ Vocabulary concept searches
- ❌ Term translations
- ❌ Concept definitions
- **Estimated endpoints:** 6-8

---

### 21. **Agent API** ❌
- ❌ `readAgent()` - Read agent information
- **Estimated endpoints:** 1-2

---

### 22. **Pending Modifications** ❌
- ❌ `readPendingModifications()` - Read pending changes
- **Estimated endpoints:** 1-2

---

## 📊 OVERALL STATISTICS

| Category | Implemented | Total Estimated | Coverage |
|----------|-------------|-----------------|----------|
| **Core Tree Operations** | 65 | 70 | 93% |
| **Memories & Discussions** | 19 | 22 | 86% |
| **Search & Matches** | 8 | 9 | 89% |
| **Places & Standards** | 3 | 20 | 15% |
| **User & Account** | 1 | 7 | 14% |
| **Advanced (Source Box, Groups, etc.)** | 0 | 30+ | 0% |
| **TOTAL** | **~95** | **~160** | **~59%** |

---

## 🎯 PRIORITY RECOMMENDATIONS

### High Priority (Core functionality completion)
1. ✅ **Change History** - DONE (relationship change history + restore)
2. ✅ **Preferred Relationships** - DONE (parent/spouse preferences)
3. ✅ **Relationship Order** - DONE (display order management)
4. ✅ **Conclusion Management** - DONE (delete facts/names/gender)
5. ✅ **Advanced Person Endpoints** - DONE (families/parents/spouses)
6. ✅ **Matches API** - DONE (resolution + not-a-match)
7. ✅ **Source Descriptions Write** - DONE (create/update/delete)

### Medium Priority (Enhanced functionality)
8. ✅ **Portraits Management** - DONE (set/delete preferred portrait)
9. ✅ **Memory Artifacts** - DONE (artifact metadata, coverage regions)
10. ✅ **Places API Expansion** - DONE (children, descriptions, types, parent search)

### Low Priority (Advanced/Optional features)
11. ✅ **Source Box API** - DONE (collections and folders management)
12. ✅ **User Management** - DONE (partner accounts, history, deletion)
13. ⏭️ **Groups/CET API** - Community trees functionality
14. ⏭️ **Genealogies API** - Research trees (separate from main)
15. ⏭️ **Vocab/Standards** - Advanced terminology lookups

---

## 📝 RECENT IMPLEMENTATIONS (Today - 2026-01-20)

### Session 1: Core API Expansion
- ✅ Change History API (3 functions)
- ✅ Preferred Relationships API (6 functions)
- ✅ Relationship Order Management (2 functions)
- ✅ Conclusion Management API (3 functions)
- ✅ Advanced Person Endpoints (3 functions)
- ✅ Matches API Completion (5 functions)

### Session 2: Source Management
- ✅ Source Descriptions Write Operations (3 functions)

### Session 3: Portrait Management
- ✅ Portraits Management API (2 functions)

### Session 4: Memory Artifacts
- ✅ Memory Artifacts API (2 functions)

### Session 5: Places API Expansion
- ✅ Places API Enhancement (8 functions)

### Session 6: Source Box API
- ✅ Source Box Collections Management (9 functions)

### Session 7: User Management API
- ✅ User Management (6 functions)

### Session 8: Standards Names API
- ✅ Standards Names Completion (1 function)

### Session 9: Agent API
- ✅ Agent API Implementation (1 function)

**Total Today:** 54 new functions  
**Bundle Growth:** +21.43 KB (113.80 KB → 135.23 KB)

---

## 🔗 API Documentation Reference

Based on: `API_ENDPOINTS_DOCS.md`  
FamilySearch API Reference: https://developers.familysearch.org/main/reference/api-reference-guide

---

## 📌 NOTES

- **HEAD endpoints** are intentionally skipped (low utility for SDK)
- **Restore endpoints** for relationships may already work via `restoreChange()`
- **OAuth/Auth** endpoints are implemented separately in `auth/` module
- Focus remains on **Tree API** as primary use case for genealogy applications
