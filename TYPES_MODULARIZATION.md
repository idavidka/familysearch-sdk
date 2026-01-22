# Types Modularization Summary

## Overview

This document describes the modularization of type definitions in the FamilySearch SDK, similar to the API modularization approach.

## Structure

Types have been split from a single `types/index.ts` file (1375 lines) into logical modules:

```
src/types/
├── index.ts           # Main entry point (re-exports all)
├── core.ts            # Core SDK types (105 lines)
├── user.ts            # User API types (28 lines)
├── oauth.ts           # OAuth types (50 lines)
├── tree.ts            # Tree/Person/Relationship types (742 lines)
├── memories.ts        # Memories API types (105 lines)
├── places.ts          # Places API types (103 lines)
└── standards.ts       # Standards API types (95 lines)
```

## Module Descriptions

### 1. `core.ts` - Core SDK Types
**Purpose**: Fundamental SDK configuration and API infrastructure

**Key Types**:
- `FamilySearchEnvironment` - Environment selection (production, beta, integration)
- `EnvironmentConfig` - Environment-specific configuration
- `FamilySearchSDKConfig` - SDK initialization options
- `RateLimiterConfig` - Rate limiting configuration
- `SDKLogger` - Logger interface
- `FamilySearchApiResponse<T>` - Generic API response wrapper
- `FamilySearchApiError` - API error with context
- `ProgressCallback` - Progress tracking for long operations

**Usage**:
```typescript
import { FamilySearchSDKConfig, SDKLogger } from '@treeviz/familysearch-sdk/types/core';
```

### 2. `user.ts` - User API Types
**Purpose**: User authentication and profile types

**Key Types**:
- `FamilySearchUser` - User information and profile data

**Usage**:
```typescript
import { FamilySearchUser } from '@treeviz/familysearch-sdk/types/user';
```

### 3. `oauth.ts` - OAuth Types
**Purpose**: OAuth authentication flow types

**Key Types**:
- `OAuthTokenResponse` - OAuth token response
- `OAuthEndpoints` - Environment-specific OAuth endpoints
- `OAuthConfig` - OAuth configuration
- `OAuthStateValidation` - OAuth state validation result

**Usage**:
```typescript
import { OAuthConfig, OAuthTokenResponse } from '@treeviz/familysearch-sdk/types/oauth';
```

### 4. `tree.ts` - Tree API Types (Largest Module)
**Purpose**: Person, relationship, pedigree, and tree operations

**Key Type Categories**:

#### Person Types:
- `FamilySearchPerson` - Basic person data
- `PersonData` - Full person data from API
- `PersonDisplay` - Display information
- `PersonFact` - Facts/events
- `PersonInput` - Create/update input
- `EnhancedPerson` - Person with additional details
- `CreatePersonResponse`, `UpdatePersonResponse`, `DeletePersonResponse`

#### Relationship Types:
- `Relationship` - Couple relationships
- `ChildAndParentsRelationship` - Parent-child relationships
- `RelationshipDetails` - Detailed relationship info
- `CreateCoupleRelationshipInput`, `CreateChildAndParentsRelationshipInput`
- `CreateRelationshipResponse`, `UpdateRelationshipResponse`

#### Pedigree Types:
- `PedigreeData` - Ancestry data
- `PedigreeResponse` - Ancestry/descendancy response
- `EnhancedPedigreeData` - Enhanced pedigree with details
- `PersonWithRelationships` - Person with related data

#### Notes Types:
- `PersonNotesResponse` - Person notes response
- `NoteInput`, `Note`, `NoteResponse` - Note CRUD types

#### Source Types:
- `SourceDescription`, `SourceReference` - Source metadata
- `PersonSourcesResponse` - Person sources
- `SourceDescriptionDetail`, `SourceDescriptionsResponse` - Detailed sources
- `AttachSourceInput`, `AttachSourceResponse` - Source attachment

#### Search & Match Types:
- `PersonSearchResponse`, `PersonSearchResult` - Search results
- `TreePersonMatchEntry` - Match entry
- `TreePersonMatchesResponse` - Matches response
- `PersonMatchInput`, `PersonMatchOptions` - Match input/options
- `MatchesResponse` - General matches response

#### Merge Types:
- `PersonMergeAnalysis` - Merge analysis
- `PersonMergeInput`, `PersonMergeResponse` - Merge operations

#### Discussion Types:
- `Discussion`, `DiscussionComment` - Discussions
- `PersonDiscussionsResponse` - Person discussions

#### Portrait Types:
- `PersonPortrait`, `PersonPortraitsResponse` - Profile photos

#### Change History Types:
- `ChangeEntry`, `PersonChangeHistoryResponse` - Change tracking

**Usage**:
```typescript
import { 
  FamilySearchPerson, 
  Relationship, 
  PersonInput,
  NoteInput
} from '@treeviz/familysearch-sdk/types/tree';
```

### 5. `memories.ts` - Memories API Types
**Purpose**: Photos, documents, stories, and memory management

**Key Types**:
- `PersonMemoriesResponse` - Person memories
- `MemoryArtifact` - Memory artifact (photo/document/story)
- `MemoryComment` - Memory comments
- `MemoryWithCommentsResponse` - Memory with comments
- `UserMemoriesResponse` - User uploaded memories
- `MemoryPersona` - Person identified in memory
- `MemoryPersonasResponse` - Memory personas list

**Usage**:
```typescript
import { MemoryArtifact, MemoryComment } from '@treeviz/familysearch-sdk/types/memories';
```

### 6. `places.ts` - Places API Types
**Purpose**: Place search and standardization

**Key Types**:
- `FamilySearchPlace` - Place data
- `PlaceDescription` - Detailed place info
- `PlaceSearchResult` - Search result
- `PlaceSearchResponse` - Search API response
- `PlaceDetailsResponse` - Place details

**Usage**:
```typescript
import { FamilySearchPlace, PlaceSearchResult } from '@treeviz/familysearch-sdk/types/places';
```

### 7. `standards.ts` - Standards API Types
**Purpose**: Date/name normalization and vocabularies

**Key Type Categories**:

#### Names:
- `NameScriptResponse` - Script detection
- `NameSegment`, `NameSegmentsResponse` - Name segmentation

#### Dates:
- `StandardizedDate` - Standardized date
- `DateStandardizationResponse` - Date normalization

#### Vocabularies:
- `VocabularyMetadata` - Vocabulary metadata
- `VocabulariesResponse` - Vocabularies list
- `VocabularyConceptDetail` - Vocabulary concept
- `VocabularyConceptsResponse`, `VocabularyConceptResponse` - Concepts

**Usage**:
```typescript
import { 
  NameSegment, 
  StandardizedDate,
  VocabularyConceptDetail 
} from '@treeviz/familysearch-sdk/types/standards';
```

## Main Entry Point (`types/index.ts`)

The main `types/index.ts` file re-exports all types from modular files for backward compatibility:

```typescript
// Re-export all types from modular type files
export * from "./core";
export * from "./user";
export * from "./oauth";
export * from "./tree";
export * from "./memories";
export * from "./places";
export * from "./standards";
```

## Backward Compatibility

All types remain importable from the main entry point:

```typescript
// ✅ Still works (backward compatible)
import { FamilySearchPerson, FamilySearchPlace } from '@treeviz/familysearch-sdk';

// ✅ Also works (new modular approach)
import { FamilySearchPerson } from '@treeviz/familysearch-sdk/types/tree';
import { FamilySearchPlace } from '@treeviz/familysearch-sdk/types/places';
```

## Benefits

1. **Better Organization**: Types grouped by API functionality
2. **Smaller Import Sizes**: Import only needed type modules
3. **Easier Navigation**: Find types by API area
4. **Maintainability**: Easier to update related types together
5. **Documentation**: Clear separation of concerns
6. **Scalability**: Easy to add new type modules

## File Size Comparison

| Module | Lines | Purpose |
|--------|-------|---------|
| `core.ts` | 105 | Core SDK infrastructure |
| `user.ts` | 28 | User profile |
| `oauth.ts` | 50 | Authentication |
| `tree.ts` | 742 | Tree operations (largest) |
| `memories.ts` | 105 | Memories management |
| `places.ts` | 103 | Place search |
| `standards.ts` | 95 | Normalization |
| **Total** | **1,228** | All types (down from 1,375) |

## Migration Notes

### For SDK Users

No migration needed! All imports continue to work:

```typescript
// Before (still works)
import { FamilySearchPerson } from '@treeviz/familysearch-sdk';

// After (optional, more specific)
import { FamilySearchPerson } from '@treeviz/familysearch-sdk/types/tree';
```

### For SDK Developers

When adding new types:

1. **Identify the API category** (tree, memories, places, etc.)
2. **Add types to the appropriate module** (e.g., `types/tree.ts`)
3. **Main index will auto-export** (via `export * from "./tree"`)

Example:
```typescript
// Add to types/tree.ts
export interface NewPersonFeature {
  id: string;
  data: string;
}

// Automatically available from main index
import { NewPersonFeature } from '@treeviz/familysearch-sdk';
```

## Next Steps

1. ✅ **Types modularized** (7 modules created)
2. ✅ **Backward compatibility maintained**
3. 🔄 **Update documentation** to show modular imports
4. 🔄 **Add examples** using modular type imports
5. 🔄 **Consider deprecation warnings** for old large imports (future)

## Related Documentation

- [API Modularization](./API_MODULARIZATION.md) - API function organization
- [API Coverage Analysis](./API_COVERAGE_ANALYSIS.md) - API implementation status
- [Phase 1 Implementation Summary](./PHASE1_IMPLEMENTATION_SUMMARY.md) - Current progress
