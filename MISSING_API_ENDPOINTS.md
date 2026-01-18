# FamilySearch SDK - Missing API Endpoints

## Overview

This document tracks the FamilySearch API v3 endpoints that are **NOT yet implemented** in the `@treeviz/familysearch-sdk` package.

Reference: [FamilySearch API Reference Guide](https://developers.familysearch.org/main/reference/api-reference-guide)

---

## ✅ Currently Implemented APIs

### Identity
- ✅ OAuth v3 authentication utilities

### Users
- ✅ Get current user (`getCurrentUser`)

### Persons (Tree API)
- ✅ Read person (`getPerson`)
- ✅ Read person with details (`getPersonWithDetails`)
- ✅ Read person notes (`getPersonNotes`)
- ✅ Read person memories (`getPersonMemories`)
- ✅ Read person sources (`getPersonSources`)
- ✅ Read person matches (`getTreePersonMatches`)
- ✅ Read person discussions (`getPersonDiscussions`)
- ✅ Read person portraits (`getPersonPortraits`)
- ✅ Read person change history (`getPersonChangeHistory`)

### Pedigrees
- ✅ Read ancestry (`getAncestry`)
- ✅ Read descendancy (`getDescendancy`)

### Relationships
- ✅ Read couple relationship (`getCoupleRelationship`)
- ✅ Read child-and-parents relationship (`getChildAndParentsRelationship`)

### Search
- ✅ Search persons (`searchPersons`)

### Places
- ✅ Search places (`searchPlaces`)
- ✅ Get place by ID (`getPlace`)

### Sources
- ✅ Get source description (`getSourceDescription`)
- ✅ Search source descriptions (`searchSourceDescriptions`)

### Memories
- ✅ Get memory (`getMemory`)
- ✅ Get user memories (`getUserMemories`)
- ✅ Get memory comments (`getMemoryComments`)

### Utilities
- ✅ GEDCOM export (`exportGEDCOM`)
- ✅ Rate limiting with automatic retry
- ✅ Enhanced error handling

---

## ❌ Missing API Endpoints

### 1. **Persons (Tree API) - Write Operations**

#### Priority: HIGH
Missing endpoints for **modifying** person data:

- [ ] **Create person** - `POST /platform/tree/persons`
- [ ] **Update person** - `POST /platform/tree/persons/{pid}`
- [ ] **Delete person** - `DELETE /platform/tree/persons/{pid}`
- [ ] **Create person conclusion** - Add name, gender, fact
- [ ] **Update person conclusion** - Update name, gender, fact
- [ ] **Delete person conclusion** - Remove name, gender, fact
- [ ] **Restore person** - Restore deleted person

**Use Cases:**
- Allow users to create new person records in FamilySearch Tree
- Enable editing of person details (names, dates, places)
- Support merging and unmerging persons

---

### 2. **Relationships - Write Operations**

#### Priority: HIGH
Missing endpoints for **creating/updating** relationships:

- [ ] **Create couple relationship** - `POST /platform/tree/couple-relationships`
- [ ] **Update couple relationship** - `POST /platform/tree/couple-relationships/{crid}`
- [ ] **Delete couple relationship** - `DELETE /platform/tree/couple-relationships/{crid}`
- [ ] **Create child-and-parents relationship** - `POST /platform/tree/child-and-parents-relationships`
- [ ] **Update child-and-parents relationship** - `POST /platform/tree/child-and-parents-relationships/{caprid}`
- [ ] **Delete child-and-parents relationship** - `DELETE /platform/tree/child-and-parents-relationships/{caprid}`
- [ ] **Create relationship conclusion** - Add marriage facts
- [ ] **Update relationship conclusion** - Update marriage facts
- [ ] **Delete relationship conclusion** - Remove marriage facts

**Use Cases:**
- Allow users to add marriages/divorces
- Enable adding children to families
- Support editing relationship facts (marriage date/place)

---

### 3. **Notes - Write Operations**

#### Priority: MEDIUM
Missing endpoints for **managing** notes:

- [ ] **Create person note** - `POST /platform/tree/persons/{pid}/notes`
- [ ] **Update person note** - `POST /platform/tree/persons/{pid}/notes/{nid}`
- [ ] **Delete person note** - `DELETE /platform/tree/persons/{pid}/notes/{nid}`
- [ ] **Create relationship note** - For couple/child-and-parents relationships
- [ ] **Update relationship note**
- [ ] **Delete relationship note**

**Use Cases:**
- Allow users to add research notes
- Enable collaborative research documentation
- Support note editing and deletion

---

### 4. **Sources - Write Operations**

#### Priority: MEDIUM
Missing endpoints for **managing** source attachments:

- [ ] **Create source reference** - Attach source to person/relationship
- [ ] **Update source reference** - Update source attachment
- [ ] **Delete source reference** - Remove source attachment
- [ ] **Create source description** - Upload new source
- [ ] **Update source description** - Edit source metadata
- [ ] **Delete source description** - Remove source

**Use Cases:**
- Allow users to attach sources to persons
- Enable source upload and management
- Support citation editing

---

### 5. **Discussions - Write Operations**

#### Priority: MEDIUM
Missing endpoints for **managing** discussions:

- [ ] **Create discussion** - `POST /platform/discussions`
- [ ] **Update discussion** - `POST /platform/discussions/{did}`
- [ ] **Delete discussion** - `DELETE /platform/discussions/{did}`
- [ ] **Create discussion comment** - Add comment to discussion
- [ ] **Update discussion comment** - Edit comment
- [ ] **Delete discussion comment** - Remove comment

**Use Cases:**
- Allow users to start discussions about persons
- Enable collaborative genealogy research
- Support commenting on research questions

---

### 6. **Memories - Write Operations**

#### Priority: LOW
Missing endpoints for **uploading/managing** memories:

- [ ] **Upload memory** - `POST /platform/memories/artifacts`
- [ ] **Update memory** - `POST /platform/memories/{mid}`
- [ ] **Delete memory** - `DELETE /platform/memories/{mid}`
- [ ] **Create memory persona** - Link person to memory
- [ ] **Update memory persona** - Update person link
- [ ] **Delete memory persona** - Remove person link
- [ ] **Create memory comment** - `POST /platform/memories/{mid}/comments`
- [ ] **Update memory comment** - Edit comment
- [ ] **Delete memory comment** - Remove comment

**Use Cases:**
- Allow users to upload photos/documents
- Enable memory tagging and annotation
- Support memory commenting

---

### 7. **Source Box**

#### Priority: LOW
Missing endpoints for **user source folders**:

- [ ] **Read user source folders** - `GET /platform/users/current/source-folders`
- [ ] **Create source folder** - Create user source collection
- [ ] **Update source folder** - Rename/organize sources
- [ ] **Delete source folder** - Remove source collection
- [ ] **Add source to folder** - Organize user sources
- [ ] **Remove source from folder**

**Use Cases:**
- Allow users to organize their sources
- Enable source collection management
- Support personal source library

---

### 8. **Matches - Advanced Operations**

#### Priority: LOW
Missing endpoints for **managing** record hints:

- [ ] **Accept match** - Accept record hint
- [ ] **Reject match** - Reject record hint
- [ ] **Dismiss match** - Dismiss record hint
- [ ] **Bulk match operations** - Process multiple matches

**Use Cases:**
- Allow users to accept/reject record hints
- Enable automated hint processing
- Support bulk operations

---

### 9. **Change History - Advanced Features**

#### Priority: LOW
Missing endpoints for **detailed change tracking**:

- [ ] **Read tree changes** - Global tree change feed
- [ ] **Read relationship change history** - Changes to relationships
- [ ] **Restore person version** - Rollback to previous version

**Use Cases:**
- View global tree activity
- Track relationship modifications
- Restore accidentally deleted data

---

### 10. **Portraits - Write Operations**

#### Priority: LOW
Missing endpoints for **managing** person portraits:

- [ ] **Set preferred portrait** - Choose main photo
- [ ] **Remove portrait** - Unlink photo from person

**Use Cases:**
- Allow users to set profile pictures
- Enable portrait management

---

### 11. **Groups**

#### Priority: LOW
Missing endpoints for **user groups**:

- [ ] **Read group** - Get group information
- [ ] **Create group** - Create user group
- [ ] **Update group** - Edit group details
- [ ] **Delete group** - Remove group
- [ ] **Add group member** - Invite users
- [ ] **Remove group member** - Remove users

**Use Cases:**
- Enable collaborative research groups
- Support family group management

---

### 12. **Dates & Names Utilities**

#### Priority: LOW
Missing utility endpoints:

- [ ] **Standardize date** - `GET /platform/dates`
- [ ] **Get name script** - Determine name writing system
- [ ] **Get date format** - Date formatting information

**Use Cases:**
- Validate and format dates
- Support international names
- Enable date normalization

---

### 13. **Vocabularies**

#### Priority: LOW
Missing vocabulary endpoints:

- [ ] **Read vocabulary concepts** - Get controlled vocabulary terms
- [ ] **Search vocabulary** - Search for vocabulary terms

**Use Cases:**
- Access standardized place/event types
- Enable controlled vocabulary lookups
- Support data standardization

---

### 14. **Pending Modifications**

#### Priority: LOW
Missing utility endpoint:

- [ ] **Read pending modifications** - `GET /platform/tree/persons/{pid}/pending-modifications`

**Use Cases:**
- View pending merge requests
- Track ongoing changes

---

### 15. **Agent API**

#### Priority: LOW
Missing agent management:

- [ ] **Read agent** - Get user/contributor information

**Use Cases:**
- Retrieve contributor information
- Support attribution tracking

---

## 🎯 Recommended Implementation Priority

### Phase 1: Write Operations (HIGH Priority)
**Goal:** Enable full CRUD operations for basic genealogy work

1. **Person CRUD** (Create, Update, Delete)
2. **Relationship CRUD** (Create, Update, Delete)
3. **Person/Relationship Conclusions** (Add/Update/Delete facts)

**Estimated Effort:** 2-3 weeks
**Value:** Enables app to function as a full FamilySearch client

---

### Phase 2: Collaboration Features (MEDIUM Priority)
**Goal:** Support research collaboration

1. **Notes Management** (Create, Update, Delete)
2. **Sources Management** (Attach, Detach, Upload)
3. **Discussions** (Create, Comment, Manage)

**Estimated Effort:** 2-3 weeks
**Value:** Enables collaborative genealogy research

---

### Phase 3: Advanced Features (LOW Priority)
**Goal:** Complete API coverage

1. **Memories Upload** (Photos, Documents, Stories)
2. **Source Box** (Personal source library)
3. **Matches Management** (Accept/Reject hints)
4. **Utilities** (Date standardization, Vocabularies)

**Estimated Effort:** 2-4 weeks
**Value:** Feature parity with FamilySearch.org

---

## 📝 Implementation Notes

### Authentication Considerations
- All write operations require OAuth authentication
- Some operations may require specific scopes
- Need to handle authorization errors gracefully

### Rate Limiting
- Write operations may have stricter rate limits
- Need to implement exponential backoff
- Consider queueing system for bulk operations

### Data Validation
- FamilySearch has strict validation rules
- Need comprehensive input validation
- Error messages should be user-friendly

### Testing Strategy
- Use Integration environment for testing
- Create comprehensive test suite
- Mock API responses for unit tests
- Integration tests against live API

### Documentation
- Add JSDoc comments for all methods
- Provide usage examples
- Document error handling
- Create migration guide for users

---

## 🔗 Useful Resources

- [FamilySearch API Reference](https://developers.familysearch.org/main/reference/api-reference-guide)
- [FamilySearch API Guides](https://developers.familysearch.org/main/docs)
- [GEDCOM X Specification](http://www.gedcomx.org/)
- [FamilySearch Developer Support](https://developers.familysearch.org/main/docs/developer-support)

---

## 📊 API Coverage Status

| Category | Read | Write | Coverage |
|----------|------|-------|----------|
| Identity | ✅ | N/A | 100% |
| Users | ✅ | ❌ | 50% |
| Persons | ✅ | ❌ | 50% |
| Pedigrees | ✅ | N/A | 100% |
| Relationships | ✅ | ❌ | 40% |
| Notes | ✅ | ❌ | 50% |
| Sources | ✅ | ❌ | 40% |
| Matches | ✅ | ❌ | 50% |
| Portraits | ✅ | ❌ | 60% |
| Search | ✅ | N/A | 100% |
| Discussions | ✅ | ❌ | 30% |
| Memories | ✅ | ❌ | 40% |
| Places | ✅ | ❌ | 80% |
| Source Box | ❌ | ❌ | 0% |
| Groups | ❌ | ❌ | 0% |
| Dates/Names | ❌ | N/A | 0% |
| Vocabularies | ❌ | N/A | 0% |
| Change History | ✅ | ❌ | 60% |
| Utilities | ⚠️ | N/A | 40% |

**Overall Coverage:** ~45% (Read-heavy, Write-light)

---

## ✍️ Contributing

If you'd like to implement any of these missing endpoints, please:

1. Create an issue referencing this document
2. Follow the existing SDK patterns (TypeScript, JSDoc, error handling)
3. Add comprehensive tests
4. Update this document when complete

---

**Last Updated:** 2026-01-18
**SDK Version:** 1.0.23
**Maintainer:** @idavidka
