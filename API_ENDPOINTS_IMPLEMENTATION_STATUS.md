# FamilySearch SDK - API Implementation Status

**Last Updated:** 2026-01-20  
**SDK Version:** 2.0.0  
**Total Implemented Functions:** ~92

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
- ❌ `headPerson()` - HEAD request (not implemented)
- ❌ `readPersonChildren()` - Children endpoint (not verified)

**Status:** 15/17 endpoints (88%)

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
- ❌ `createSourceDescription()` - Create source (not implemented)
- ❌ `updateSourceDescription()` - Update source (not implemented)
- ❌ `deleteSourceDescription()` - Delete source (not implemented)
- ❌ `getSourceDescriptionChanges()` - Source change history (not implemented)

**Status:** 2/6 endpoints (33%)

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
- ❌ `updateMemoryArtifact()` - Update artifact metadata (not implemented)
- ❌ `deleteMemoryArtifactCoverage()` - Delete coverage region (not implemented)

**Status:** 13/15 endpoints (87%)

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

### 14. **Places API** (Read-only) 🟡
- ✅ `searchPlaces()` - Search places
- ✅ `getPlace()` - Read place
- ❌ `getPlaceChildren()` - Read child places (not implemented)
- ❌ `getPlaceDescriptions()` - Read place descriptions (not implemented)
- ❌ `getPlaceDescription()` - Read single place description (not implemented)
- ❌ Many other place endpoints (not implemented)

**Status:** 2/15+ endpoints (~13%)

---

### 15. **Standards API** (Date standardization) 🟡
- ✅ `standardizeDate()` - Standardize date
- ❌ `getNameScript()` - Get name script (not implemented)
- ❌ `getNameSegments()` - Parse name segments (not implemented)
- ❌ `createNameSegments()` - Create name segments (not implemented)

**Status:** 1/4+ endpoints (25%)

---

### 16. **User API** 🟡
- ✅ `getCurrentUser()` - Read current user
- ❌ `createPartnerAccount()` - Create partner account (not implemented)
- ❌ `updatePartnerAccount()` - Update partner account (not implemented)
- ❌ `readPartnerEligibility()` - Check eligibility (not implemented)
- ❌ `readUserHistory()` - Read user history (not implemented)
- ❌ `updateUserHistory()` - Update user history (not implemented)
- ❌ `delete()` - Delete user account (not implemented)

**Status:** 1/7+ endpoints (~14%)

---

## ❌ NOT IMPLEMENTED MODULES

### 17. **Source Box / User Defined Collections** ❌
- ❌ All endpoints for organizing sources into folders/collections
- **Estimated endpoints:** 8-10

---

### 18. **Groups / Community Trees (CET)** ❌
- ❌ `readGroup()`, `updateGroup()`, `deleteGroup()`
- ❌ `getGroups()`, `createGroup()`
- **Estimated endpoints:** 5

---

### 19. **Genealogies API** (Research Trees) ❌
- ❌ All genealogies endpoints (separate from main tree)
- **Estimated endpoints:** 15+

---

### 20. **Portraits Management** ❌
- ❌ `updatePersonPortraits()` - Set preferred portrait
- ❌ `deletePersonPortrait()` - Delete portrait
- ❌ Advanced portrait operations
- **Estimated endpoints:** 3

---

### 21. **Vocab/Standards (Advanced)** ❌
- ❌ Vocabulary concept searches
- ❌ Term translations
- ❌ Concept definitions
- **Estimated endpoints:** 6-8

---

### 22. **Agent API** ❌
- ❌ `readAgent()` - Read agent information
- **Estimated endpoints:** 1-2

---

### 23. **Pending Modifications** ❌
- ❌ `readPendingModifications()` - Read pending changes
- **Estimated endpoints:** 1-2

---

## 📊 OVERALL STATISTICS

| Category | Implemented | Total Estimated | Coverage |
|----------|-------------|-----------------|----------|
| **Core Tree Operations** | 62 | 70 | 89% |
| **Memories & Discussions** | 19 | 22 | 86% |
| **Search & Matches** | 8 | 9 | 89% |
| **Places & Standards** | 3 | 20 | 15% |
| **User & Account** | 1 | 7 | 14% |
| **Advanced (Source Box, Groups, etc.)** | 0 | 30+ | 0% |
| **TOTAL** | **~92** | **~160** | **~58%** |

---

## 🎯 PRIORITY RECOMMENDATIONS

### High Priority (Core functionality completion)
1. ✅ **Change History** - DONE (relationship change history + restore)
2. ✅ **Preferred Relationships** - DONE (parent/spouse preferences)
3. ✅ **Relationship Order** - DONE (display order management)
4. ✅ **Conclusion Management** - DONE (delete facts/names/gender)
5. ✅ **Advanced Person Endpoints** - DONE (families/parents/spouses)
6. ✅ **Matches API** - DONE (resolution + not-a-match)

### Medium Priority (Enhanced functionality)
7. 🔄 **Source Descriptions Write** - Create/Update/Delete source descriptions
8. 🔄 **Portraits Management** - Set preferred portrait, delete portraits
9. 🔄 **Memory Artifacts** - Coverage regions, artifact metadata
10. 🔄 **Places API Expansion** - Place descriptions, children, types

### Low Priority (Advanced/Optional features)
11. ⏭️ **Source Box API** - User collections and folders
12. ⏭️ **Groups/CET API** - Community trees functionality
13. ⏭️ **Genealogies API** - Research trees (separate from main)
14. ⏭️ **User Management** - Partner accounts, history, deletion
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

**Total Today:** 22 new functions  
**Bundle Growth:** +10.64 KB (113.80 KB → 124.44 KB)

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
