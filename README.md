# @treeviz/familysearch-sdk

> Part of the [@treeviz](https://www.npmjs.com/org/treeviz) organization - A collection of tools for genealogy data processing and visualization.

A modern, TypeScript-first SDK for the FamilySearch API v3.

> **Note:** This package was previously published as `familysearch-sdk`. It has been moved to the `@treeviz` organization.

## ⚠️ Version 2.0.0 Breaking Changes

**Version 2.0.0 introduces a major architectural refactor** with breaking changes to the API surface. The SDK now uses a **modular architecture** where API methods are organized into dedicated modules instead of being exposed directly on the SDK instance.

### Migration Guide (v1.x → v2.0.0)

| Old API (v1.x) | New API (v2.0.0) | Module |
|----------------|------------------|--------|
| `sdk.readCurrentUser()` | `sdk.user.readCurrentUser()` | User API |
| `sdk.readPerson(id)` | `sdk.persons.readPerson(id)` | Persons API |
| `sdk.searchPersons(query)` | `sdk.search.searchPersons(query)` | Search API |
| `sdk.matchPerson(person)` | `sdk.matches.matchPerson(person)` | Matches API |
| `sdk.searchPersonByData(person)` | `sdk.search.searchPersonByData(person)` | Search API |
| `sdk.searchPlaces(query)` | `sdk.places.searchPlaces(query)` | Places API |
| `sdk.exportGEDCOM(personId)` | `sdk.persons.exportGEDCOM(personId)` | Persons API |
| `sdk.getPersonSources(id)` | `sdk.sources.readPersonSources(id)` | Sources API |
| `sdk.getPersonMemories(id)` | `sdk.persons.readPersonMemories(id)` | Persons API |
| `sdk.getPersonDiscussions(id)` | `sdk.discussions.readPersonDiscussions(id)` | Discussions API |
| `sdk.getPersonPortraits(id)` | `sdk.persons.readPersonPortraits(id)` | Persons API |
| `sdk.getPersonChangeHistory(id)` | `sdk.persons.readPersonChangeHistory(id)` | Persons API |

### Why This Change?

**Benefits of v2.0.0 architecture:**
- ✅ **Better organization**: Related functionality grouped into logical modules
- ✅ **Cleaner client.ts**: Core SDK now only handles HTTP methods and infrastructure
- ✅ **No duplicates**: Single source of truth for each API method
- ✅ **Better tree-shaking**: Import only the modules you need
- ✅ **Easier maintenance**: Changes isolated to specific modules
- ✅ **Consistent patterns**: All modules follow the same structure

### Quick Migration Example

**Before (v1.x):**
```typescript
const sdk = createFamilySearchSDK({ accessToken: 'token' });

const user = await sdk.readCurrentUser();
const person = await sdk.readPerson('KWQS-BBQ');
const matches = await sdk.matchPerson({ givenName: 'John', familyName: 'Smith' });
const places = await sdk.searchPlaces('London, England');
```

**After (v2.0.0):**
```typescript
const sdk = createFamilySearchSDK({ accessToken: 'token' });

const user = await sdk.user.readCurrentUser();
const person = await sdk.persons.readPerson('KWQS-BBQ');
const matches = await sdk.matches.matchPerson({ givenName: 'John', familyName: 'Smith' });
const places = await sdk.places.searchPlaces('London, England');
```

**Pattern:** `sdk.<method>()` → `sdk.<module>.<method>()`

## Features

- 🔷 **Full TypeScript support** with comprehensive type definitions
- 🔐 **OAuth v3 compatible** authentication utilities
- 📊 **Promise-based API** for async operations
- 🌍 **Environment support** (production, beta, integration)
- 📝 **GEDCOM export** - Convert FamilySearch data to GEDCOM 5.5 format
- 📍 **Places API** helpers for location searches
- 👨‍👩‍👧 **Tree/Pedigree API** for ancestry data
- 📚 **Sources API** - Fetch source references and descriptions
- 💬 **Discussions API** - Access person discussions and comments
- 🖼️ **Memories API** - Work with photos, documents, and stories
- 🔄 **Rate Limiting** - Built-in rate limiting with automatic retry on 429 errors
- ⚡ **Enhanced Error Handling** - Typed error classes for better error management
- 📜 **Change History** - Access person change history and audit logs
- 🧩 **Modular Architecture (v2.0.0)** - Organized API modules for better maintainability

## Installation

```bash
npm install @treeviz/familysearch-sdk
```

## Quick Start

```typescript
import {
  createFamilySearchSDK,
  fetchPedigree,
  convertToGedcom
} from '@treeviz/familysearch-sdk';

// Create SDK instance with your OAuth access token
const sdk = createFamilySearchSDK({
  environment: 'production',
  accessToken: 'your-oauth-token'
});

// Fetch current user (v2.0.0 - note the module prefix)
const user = await sdk.user.readCurrentUser();
console.log('User:', user?.displayName);

// Fetch pedigree data
const pedigree = await fetchPedigree(sdk, user?.personId, {
  generations: 5,
  onProgress: (progress) => {
    console.log(`${progress.percent}% complete`);
  }
});

// Convert to GEDCOM format
const gedcom = convertToGedcom(pedigree, {
  treeName: 'My Family Tree'
});

console.log(gedcom);
```

## SDK Modules (v2.0.0)

The SDK is organized into the following modules:

| Module | Access via | Purpose |
|--------|-----------|---------|
| **User API** | `sdk.user.*` | Current user information |
| **Persons API** | `sdk.persons.*` | Person CRUD operations, memories, portraits, change history |
| **Search API** | `sdk.search.*` | Person search by query or structured data |
| **Matches API** | `sdk.matches.*` | Person matching for duplicate detection |
| **Relationships API** | `sdk.relationships.*` | Couple and parent-child relationships |
| **Sources API** | `sdk.sources.*` | Source descriptions and attachments |
| **Places API** | `sdk.places.*` | Place search and details |
| **Discussions API** | `sdk.discussions.*` | Person discussions and comments |
| **Memories API** | `sdk.memories.*` | Photos, documents, and stories |
| **Notes API** | `sdk.notes.*` | Person notes |
| **Pedigrees API** | `sdk.pedigrees.*` | Ancestry and descendancy queries |
| **Dates API** | `sdk.dates.*` | Date standardization |
| **Names API** | `sdk.names.*` | Name standardization |
| **Vocabularies API** | `sdk.vocabularies.*` | Controlled vocabularies |

### Module Examples

```typescript
// User API
const user = await sdk.user.readCurrentUser();

// Persons API
const person = await sdk.persons.readPerson('KWQS-BBQ');
const memories = await sdk.persons.readPersonMemories('KWQS-BBQ');
const changeHistory = await sdk.persons.readPersonChangeHistory('KWQS-BBQ');
const gedcom = await sdk.persons.exportGEDCOM('KWQS-BBQ');

// Search API
const searchResults = await sdk.search.searchPersons('John Smith');
const matchResults = await sdk.search.searchPersonByData({
  givenName: 'John',
  familyName: 'Smith',
  birthDate: '1850'
});

// Matches API
const matches = await sdk.matches.matchPerson({
  givenName: 'Mary',
  familyName: 'Johnson',
  gender: 'Female',
  birthDate: '1875',
  birthPlace: 'Boston, Massachusetts'
});

// Places API
const places = await sdk.places.searchPlaces('London, England');
const placeDetails = await sdk.places.readPlaceById('12345');

// Relationships API
const ancestry = await sdk.relationships.readPersonAncestry('KWQS-BBQ', { generations: 4 });
const parents = await sdk.relationships.readPersonParents('KWQS-BBQ');

// Sources API
const sources = await sdk.sources.readPersonSources('KWQS-BBQ');
const sourceDesc = await sdk.sources.readSourceDescription('SOURCE-123');

// Discussions API
const discussions = await sdk.discussions.readPersonDiscussions('KWQS-BBQ');
```

## OAuth Authentication

The SDK provides utilities for OAuth 2.0 authentication with FamilySearch.

### Basic OAuth Flow

```typescript
import {
  generateOAuthState,
  buildAuthorizationUrl,
  exchangeCodeForToken,
  validateAccessToken,
  refreshAccessToken
} from '@treeviz/familysearch-sdk/auth';

// Generate state for CSRF protection
const state = generateOAuthState();

// Build authorization URL with offline_access scope for refresh tokens
const authUrl = buildAuthorizationUrl({
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  environment: 'production'
}, state, {
  scopes: ['offline_access']  // Request refresh token
});

// Redirect user to authUrl...

// After callback, exchange code for token
const tokens = await exchangeCodeForToken(code, {
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  environment: 'production'
});

console.log('Access token:', tokens.access_token);
console.log('Refresh token:', tokens.refresh_token);  // Available with offline_access scope
console.log('Expires in:', tokens.expires_in);

// Validate token
const isValid = await validateAccessToken(tokens.access_token, 'production');

// Refresh token when it expires
if (tokens.refresh_token) {
  const newTokens = await refreshAccessToken(tokens.refresh_token, {
    clientId: 'your-client-id',
    redirectUri: 'https://your-app.com/callback',
    environment: 'production'
  });
  console.log('New access token:', newTokens.access_token);
}
```

### Token Storage (Browser Environment)

**Best Practice for storing FamilySearch tokens:**

```typescript
import {
  storeTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  clearStoredTokens
} from '@treeviz/familysearch-sdk/auth';

// After obtaining tokens from OAuth flow
await storeTokens('user-id', {
  accessToken: tokens.access_token,
  expiresAt: Date.now() + (tokens.expires_in * 1000),
  refreshToken: tokens.refresh_token,  // Store for silent refresh
  environment: 'production'
});

// Retrieve tokens later
const accessToken = getStoredAccessToken('user-id');
const refreshToken = getStoredRefreshToken('user-id');

// Clear tokens on sign out
clearStoredTokens('user-id');
```

**Storage Strategy (FamilySearch Compatibility):**
- ✅ **Access tokens** → `sessionStorage` (temporary, cleared on browser close)
- ✅ **Refresh tokens** → `localStorage` (persistent, for re-authentication)
- ✅ **Compliant** with FamilySearch requirement: "No permanent storage of FamilySearch API Session ID"

### Refresh Token Best Practices

**Always request `offline_access` scope** to ensure you receive a refresh token:

```typescript
const authUrl = buildAuthorizationUrl(config, state, {
  scopes: ['offline_access']  // ← Important!
});
```

**Why `offline_access`?**
- ✅ Guarantees refresh token in response
- ✅ Refresh token is renewed on each refresh
- ✅ Prevents popup re-authentication loops
- ✅ Better user experience (silent token refresh)

Without `offline_access`:
- ❌ FamilySearch may not return refresh token
- ❌ Subsequent refreshes may not renew refresh token
- ❌ Eventually requires popup re-authentication

See [FamilySearch Refresh Token Implementation](../../docs/FAMILYSEARCH_REFRESH_TOKEN.md) for detailed information about token lifecycle and silent refresh implementation.

## Places API

Search and retrieve place information from FamilySearch.

```typescript
import { createFamilySearchSDK } from '@treeviz/familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Search for places (v2.0.0 - using sdk.places module)
const results = await sdk.places.searchPlaces('London, England', {
  date: '1850',
  count: 10
});

// Or use structured query parameters
const structuredResults = await sdk.places.searchPlaces({
  name: 'London',
  parentId: '12345',  // Parent place ID
  typeId: '789',      // Place type ID (city, county, etc.)
  date: '1850-01-01',
  count: 10
});

// Get place details
const details = await sdk.places.readPlaceById('place-id');
console.log(details.name, details.latitude, details.longitude);

// Get child places (e.g., counties in a state)
const children = await sdk.places.readPlaceChildren('place-id', {
  count: 50
});
```

## Tree/Pedigree API

Fetch and manage family tree data.

```typescript
import { createFamilySearchSDK } from '@treeviz/familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Get current user (v2.0.0 - using sdk.user module)
const user = await sdk.user.readCurrentUser();
console.log(user?.displayName, user?.personId);

// Read a person (v2.0.0 - using sdk.persons module)
const person = await sdk.persons.readPerson('KWQS-BBQ');
console.log(person?.display?.name);

// Read person with relationships
const personWithRelations = await sdk.persons.readPersonWithDetails('KWQS-BBQ', {
  sourceDescriptions: true
});

// Get ancestry (v2.0.0 - using sdk.relationships module)
const ancestry = await sdk.relationships.readPersonAncestry('KWQS-BBQ', {
  generations: 4
});

// Fetch pedigree (will use current user's personId if not provided)
const pedigree = await fetchPedigree(sdk, user?.personId, {
  generations: 4,
  includeDetails: true,
  includeNotes: true
});
```

## Sources API

Retrieve source references linked to persons.

```typescript
import { createFamilySearchSDK } from '@treeviz/familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Fetch sources for a person (v2.0.0 - using sdk.sources module)
const sources = await sdk.sources.readPersonSources('KWQS-BBQ');

// Access source references
if (sources?.persons?.[0]?.sources) {
  sources.persons[0].sources.forEach(source => {
    console.log('Source ID:', source.descriptionId);
    console.log('Qualifiers:', source.qualifiers);
  });
}

// Access source descriptions
if (sources?.sourceDescriptions) {
  sources.sourceDescriptions.forEach(desc => {
    console.log('Title:', desc.titles?.[0]?.value);
    console.log('Citation:', desc.citations?.[0]?.value);
    console.log('About:', desc.about);
  });
}

// Get a specific source description
const sourceDesc = await sdk.sources.readSourceDescription('SOURCE-123');
console.log('Source title:', sourceDesc?.titles?.[0]?.value);
```

## Person Match API

Find potential matches in the FamilySearch Tree for persons from external GEDCOM data or manually created trees.

```typescript
import { createFamilySearchSDK } from '@treeviz/familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Match a person from external GEDCOM data (v2.0.0 - using sdk.matches module)
const matches = await sdk.matches.matchPerson({
  givenName: 'John',
  familyName: 'Smith',
  gender: 'Male',
  birthDate: '1850',
  birthPlace: 'London, England',
  deathDate: '1920',
  deathPlace: 'New York, USA'
});

// Process match results
if (matches?.entries) {
  matches.entries.forEach(entry => {
    console.log('Match title:', entry.title);
    console.log('Confidence score:', entry.content?.score);
    console.log('Match ID:', entry.id);
    
    // Access matched person details
    const matchedPerson = entry.content?.gedcomx?.persons?.[0];
    if (matchedPerson) {
      console.log('Name:', matchedPerson.display?.name);
      console.log('Birth:', matchedPerson.display?.birthDate);
    }
  });
}

// Filter by collection and limit results
const censusMatches = await sdk.matches.matchPerson({
  givenName: 'Mary',
  familyName: 'Johnson',
  birthDate: '1875'
}, {
  collection: 'census',
  count: 10
});

// Search by structured person data (v2.0.0 - using sdk.search module)
const searchResults = await sdk.search.searchPersonByData({
  givenName: 'John',
  familyName: 'Smith',
  birthDate: '1850',
  birthPlace: 'London, England',
  fatherGivenName: 'William',
  fatherFamilyName: 'Smith'
}, {
  count: 20,
  collection: 'tree'
});
```

## GEDCOM Conversion

Convert FamilySearch data to GEDCOM 5.5 format.

```typescript
import { convertToGedcom } from 'familysearch-sdk/utils';

const gedcom = convertToGedcom(pedigreeData, {
  treeName: 'Family Tree',
  includeLinks: true,
  includeNotes: true
});

// Save to file
fs.writeFileSync('family.ged', gedcom);
```

## Discussions API

Access person discussions and comments.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Get discussions for a person
const discussions = await sdk.getPersonDiscussions('KWQS-BBQ');

if (discussions?.discussions) {
  discussions.discussions.forEach(discussion => {
    console.log('Title:', discussion.title);
    console.log('Details:', discussion.details);
    console.log('Comments:', discussion.numberOfComments);
  });
}
```

## Portraits API

Fetch portrait photos for persons.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Get portraits for a person
const portraits = await sdk.getPersonPortraits('KWQS-BBQ');

if (portraits?.sourceDescriptions) {
  portraits.sourceDescriptions.forEach(portrait => {
    console.log('Portrait URL:', portrait.about);
    console.log('Title:', portrait.titles?.[0]?.value);
  });
}
```

## Memories API

Work with photos, documents, and stories.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Get a specific memory
const memory = await sdk.getMemory('MEM-123');

// Get user's uploaded memories
const userMemories = await sdk.readUserMemories({ count: 50 });

// Get comments on a memory
const comments = await sdk.readMemoryComments('MEM-123');
if (comments?.discussions?.[0]?.comments) {
  comments.discussions[0].comments.forEach(comment => {
    console.log('Comment:', comment.text);
  });
}
```

## Change History API

Access person change history and audit logs.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Get change history for a person
const history = await sdk.getPersonChangeHistory('KWQS-BBQ');

if (history?.entries) {
  history.entries.forEach(entry => {
    console.log('Change:', entry.title);
    console.log('Date:', new Date(entry.updated || 0));
    entry.changeInfo?.forEach(info => {
      console.log('Operation:', info.operation);
      console.log('Object Type:', info.objectType);
    });
  });
}
```

## Rate Limiting

The SDK includes built-in rate limiting with automatic retry on 429 errors.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({
  accessToken: 'token',
  rateLimiter: {
    requestsPerSecond: 10,  // Max requests per second
    maxBurst: 20,            // Max burst size
    maxRetries: 3,           // Max retry attempts on 429
    initialBackoffMs: 1000,  // Initial backoff delay
    maxBackoffMs: 30000      // Max backoff delay
  }
});

// Requests are automatically rate limited and retried on 429 errors
const person = await sdk.getPerson('KWQS-BBQ');
```

## Error Handling

The SDK provides typed error classes for better error management.

```typescript
import {
  createFamilySearchSDK,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  ServerError,
  NetworkError
} from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

try {
  const person = await sdk.getPerson('INVALID-ID');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Person not found:', error.resourceId);
  } else if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.statusCode);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.originalError);
  }
}
```

## Environment Configuration

The SDK supports three FamilySearch environments:

| Environment | Description | API Host |
|-------------|-------------|----------|
| `production` | Live production API | api.familysearch.org |
| `beta` | Beta testing environment | apibeta.familysearch.org |
| `integration` | Sandbox for development | api-integ.familysearch.org |

```typescript
import { createFamilySearchSDK, ENVIRONMENT_CONFIGS } from 'familysearch-sdk';

// Create SDK for production
const sdk = createFamilySearchSDK({
  environment: 'production',
  accessToken: 'token'
});

// Access environment configuration
const config = ENVIRONMENT_CONFIGS['production'];
console.log(config.platformHost); // https://api.familysearch.org
```

## Custom Logging

Provide a custom logger for debugging.

```typescript
const sdk = createFamilySearchSDK({
  accessToken: 'token',
  logger: {
    log: (msg, ...args) => console.log(`[FS SDK] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[FS SDK] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[FS SDK] ${msg}`, ...args),
  }
});
```

## API Reference

### Core SDK

- `FamilySearchSDK` - Main SDK class
- `createFamilySearchSDK(config)` - Create a new SDK instance
- `initFamilySearchSDK(config)` - Initialize/get singleton instance
- `getFamilySearchSDK()` - Get singleton instance

### Authentication (`/auth`)

- `generateOAuthState()` - Generate CSRF state
- `buildAuthorizationUrl(config, state)` - Build OAuth URL
- `exchangeCodeForToken(code, config)` - Exchange code for tokens
- `refreshAccessToken(refreshToken, config)` - Refresh access token
- `validateAccessToken(token, environment)` - Validate token

### Places (`/places`)

- `searchPlaces(sdk, query, options)` - Search for places
- `readPlaceById(sdk, id)` - Get place by ID
- `readPlaceChildren(sdk, id, options)` - Get child places
- `readPlaceDetails(sdk, id)` - Get detailed place info

### Tree (`/tree`)

- `fetchPedigree(sdk, personId, options)` - Fetch ancestry data
- `readCurrentUser(sdk)` - Get current user info
- `getPersonWithDetails(sdk, personId)` - Get person details
- `fetchMultiplePersons(sdk, personIds)` - Batch fetch persons

### Person APIs

- `sdk.getPerson(personId)` - Get person by ID
- `sdk.getPersonSources(personId)` - Get source references for a person
- `sdk.getPersonNotes(personId)` - Get notes for a person
- `sdk.getPersonMemories(personId)` - Get memories for a person
- `sdk.getPersonDiscussions(personId)` - Get discussions for a person
- `sdk.getPersonPortraits(personId)` - Get portrait photos for a person
- `sdk.getPersonChangeHistory(personId)` - Get change history for a person
- `sdk.searchPersons(query, options)` - Search for persons

### Sources APIs

- `sdk.getSourceDescription(sourceId)` - Get source description by ID
- `sdk.searchSourceDescriptions(query, options)` - Search source descriptions

### Memories APIs

- `sdk.getMemory(memoryId)` - Get memory by ID
- `sdk.readUserMemories(options)` - Get user's uploaded memories
- `sdk.readMemoryComments(memoryId)` - Get comments for a memory

### Relationships APIs

- `sdk.getCoupleRelationship(relationshipId)` - Get couple relationship details
- `sdk.getChildAndParentsRelationship(relationshipId)` - Get parent-child relationship details
- `sdk.getAncestry(personId, generations)` - Get ancestry for a person
- `sdk.getDescendancy(personId, generations)` - Get descendancy for a person

### Error Classes

- `FamilySearchError` - Base error class
- `AuthenticationError` - 401/403 authentication errors
- `NotFoundError` - 404 resource not found errors
- `RateLimitError` - 429 rate limit errors
- `ValidationError` - 400 validation errors
- `ServerError` - 5xx server errors
- `NetworkError` - Network/connection errors

### Person Matching

- `sdk.matchPerson(person, options)` - Find matches for external GEDCOM persons
- `sdk.getTreePersonMatches(personId, options)` - Get matches for existing FamilySearch persons

### Utils (`/utils`)

- `convertToGedcom(pedigreeData, options)` - Convert to GEDCOM

## API Coverage

This SDK currently implements approximately **84% (172 endpoints)** of the FamilySearch API. For comprehensive analysis:

- 📊 **[API Coverage Analysis](./API_COVERAGE_ANALYSIS.md)** - Detailed English analysis with implementation roadmap
- 🇭🇺 **[API Coverage Analysis (Hungarian)](./API_COVERAGE_ANALYSIS_HU.md)** - Hungarian summary and recommendations
- 📋 **[Complete API Endpoints List](./API_ENDPOINTS_COMPLETE.md)** - Full endpoint inventory with implementation status
- 🎯 **[Latest Session Summary](./docs/SESSION_SUMMARY_2026_01_21.md)** - Recent implementation progress (73% → 84%)

### Implementation Status

✅ **Fully Implemented Categories (8/19)**:
- Change History, Discussions, Genealogies (User Trees)
- Groups, Matches, Notes, Places Standards, Vocabularies

🚧 **Partial Implementation**:
- **Tree Persons**: 34/48 (71%) - Missing: reference deletions, search, matches
- **Relationships**: 43/48 (90%) - Missing: restore, notes, GedcomX format
- **Sources**: 16/19 (84%) - Missing: HEAD requests, user sources
- **Memories**: 4/5 (80%) - Missing: create memory
- **Other categories**: 90%+ coverage

### Key Capabilities

✅ **You CAN**:
- ✅ Read, create, update, delete persons
- ✅ Create and manage relationships (couple, parent-child)
- ✅ Read and manage sources (descriptions, attachments, collections)
- ✅ Search and match persons
- ✅ Fetch pedigrees and ancestry data
- ✅ Read memories, discussions, notes
- ✅ Work with User Trees (Genealogies API)

⚠️ **Limited Support**:
- ⚠️ Reference deletions (discussion, memory, source references)
- ⚠️ Relationship restore operations
- ⚠️ Advanced search operations
- ⚠️ Match management (not-a-match operations)

See the [API Coverage Analysis](./API_COVERAGE_ANALYSIS.md) for detailed information about missing endpoints and implementation priorities.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

