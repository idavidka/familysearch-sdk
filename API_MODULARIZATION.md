# FamilySearch SDK Modularization

## Overview

The FamilySearch SDK has been reorganized into a **modular architecture** that mirrors the official [FamilySearch API documentation structure](https://developers.familysearch.org/main/reference). This improves code maintainability, readability, and enables parallel development of different API groups.

## Structure

```
packages/familysearch-sdk/src/
├── api/                    # NEW: Modular API endpoints
│   ├── tree/              # Family Tree API
│   │   ├── persons.ts     # Persons CRUD
│   │   ├── relationships.ts # Relationships CRUD
│   │   ├── pedigrees.ts   # Ancestry/Descendancy
│   │   ├── search.ts      # Person search
│   │   ├── matches.ts     # Record matches
│   │   ├── sources.ts     # Source descriptions
│   │   └── index.ts       # Tree API exports
│   ├── memories/          # Memories API
│   │   └── index.ts       # Photos, documents, stories
│   ├── standards/         # Standards APIs
│   │   ├── places.ts      # Place search/standardization
│   │   ├── dates.ts       # Date normalization
│   │   ├── names.ts       # Name script detection
│   │   ├── vocabularies.ts # Controlled vocabularies
│   │   └── index.ts       # Standards API exports
│   ├── user/              # User API
│   │   └── index.ts       # Current user profile
│   └── index.ts           # All API exports
├── client.ts              # EXISTING: Main SDK client (to be refactored)
├── types/                 # EXISTING: Type definitions
├── index.ts               # UPDATED: Package entry point
└── ...                    # Other modules (auth, places, tree, utils)
```

## API Modules

### 1. Tree API (`api/tree/`)

Handles all Family Tree operations:

- **Persons** (`persons.ts`): 12 functions
  - `getPerson()`, `getPersonWithDetails()`
  - `createPerson()`, `updatePerson()`, `deletePerson()`, `restorePerson()`
  - `getPersonNotes()`, `getPersonMemories()`, `getPersonSources()`
  - `getPersonDiscussions()`, `getPersonPortraits()`, `getPersonChangeHistory()`

- **Relationships** (`relationships.ts`): 8 functions
  - Couple relationships: `getCoupleRelationship()`, `createCoupleRelationship()`, `updateCoupleRelationship()`, `deleteCoupleRelationship()`
  - Child-parent relationships: `getChildAndParentsRelationship()`, `createChildAndParentsRelationship()`, `updateChildAndParentsRelationship()`, `deleteChildAndParentsRelationship()`

- **Pedigrees** (`pedigrees.ts`): 2 functions
  - `getAncestry()`, `getDescendancy()`

- **Search** (`search.ts`): 1 function
  - `searchPersons()`

- **Matches** (`matches.ts`): 2 functions
  - `getPersonMatches()`, `getPersonNonMatches()`

- **Sources** (`sources.ts`): 2 functions
  - `getSourceDescriptions()`, `getSourceDescription()`

### 2. Memories API (`api/memories/`)

Handles photos, documents, stories, and comments:

- `getMemoryWithComments()`
- `getUserMemories()`

### 3. Standards API (`api/standards/`)

Handles standardization and normalization:

- **Places** (`places.ts`): 2 functions
  - `searchPlaces()`, `getPlaceDetails()`

- **Dates** (`dates.ts`): 1 function
  - `normalizeDate()`

- **Names** (`names.ts`): 2 functions
  - `getNameScript()`, `getNameSegments()`

- **Vocabularies** (`vocabularies.ts`): 3 functions
  - `getVocabularies()`, `getVocabularyConcepts()`, `getVocabularyConcept()`

### 4. User API (`api/user/`)

Handles user profile:

- `getCurrentUser()`

## Usage

### Importing modular functions

```typescript
import { FamilySearchSDK } from 'familysearch-sdk';
import * as TreeAPI from 'familysearch-sdk/api/tree';
import * as MemoriesAPI from 'familysearch-sdk/api/memories';
import * as StandardsAPI from 'familysearch-sdk/api/standards';
import * as UserAPI from 'familysearch-sdk/api/user';

// Create SDK instance
const sdk = new FamilySearchSDK({
  environment: 'production',
  accessToken: 'your-token'
});

// Use modular functions
const person = await TreeAPI.getPerson(sdk, 'KWQS-BBQ');
const ancestry = await TreeAPI.getAncestry(sdk, 'KWQS-BBQ', 4);
const places = await StandardsAPI.searchPlaces(sdk, 'London, England');
const user = await UserAPI.getCurrentUser(sdk);
```

### Importing specific functions

```typescript
import { FamilySearchSDK } from 'familysearch-sdk';
import { 
  getPerson, 
  getAncestry, 
  createPerson 
} from 'familysearch-sdk/api/tree';

const sdk = new FamilySearchSDK({ /* config */ });

const person = await getPerson(sdk, 'KWQS-BBQ');
const ancestry = await getAncestry(sdk, 'KWQS-BBQ', 4);
```

### Namespace imports

```typescript
import { TreeAPI, StandardsAPI } from 'familysearch-sdk';

// TreeAPI.getPerson(...)
// StandardsAPI.searchPlaces(...)
```

## Function Signature Pattern

All modular functions follow this pattern:

```typescript
export async function functionName(
  sdk: FamilySearchSDK,  // SDK instance always first parameter
  ...args               // API-specific parameters
): Promise<ResponseType | null> {
  try {
    const response = await sdk.get<ResponseType>(endpoint);
    return response.data || null;
  } catch (error) {
    sdk["logger"].error("Error message", error);
    return null; // or throw error for write operations
  }
}
```

## Benefits

1. **Better Code Organization**
   - Logical grouping by FamilySearch API structure
   - Easier to find and maintain related functions
   - Reduced file size (was ~1700 lines, now split into focused modules)

2. **Improved Developer Experience**
   - IntelliSense/autocomplete works better with smaller modules
   - Clear separation of concerns
   - Easier to understand what each module does

3. **Parallel Development**
   - Team members can work on different API groups simultaneously
   - Less merge conflicts

4. **Tree-Shaking**
   - Bundlers can eliminate unused code more effectively
   - Smaller bundle sizes for applications

5. **Documentation**
   - Each module has focused JSDoc documentation
   - Links to official FamilySearch API docs

## Migration Path

The existing `client.ts` will continue to work for backward compatibility. Future work:

1. **Phase 1**: ✅ Create modular API structure (DONE)
2. **Phase 2**: Update `client.ts` methods to delegate to modular functions
3. **Phase 3**: Add deprecation warnings to `client.ts` methods
4. **Phase 4**: Eventually remove old methods (breaking change, major version bump)

## Type System

All types remain in `src/types/index.ts`. New types added:

- `PedigreeResponse` - Ancestry/descendancy results
- `PersonSearchResult` - Person search results
- `MatchesResponse` - Record matches/non-matches

## Next Steps

1. Continue implementing missing API endpoints (Notes, Discussions, etc.)
2. Refactor `client.ts` to use modular functions internally
3. Add comprehensive tests for each module
4. Update documentation with more examples
5. Create migration guide for existing users

## References

- [FamilySearch API Documentation](https://developers.familysearch.org/main/reference)
- [API Coverage Analysis](./API_COVERAGE_ANALYSIS.md)
- [Phase 1 Implementation Plan](./API_COVERAGE_ANALYSIS.md#phase-1-core-write-operations-crud)
