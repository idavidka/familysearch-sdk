# @treeviz/familysearch-sdk

> Part of the [@treeviz](https://www.npmjs.com/org/treeviz) organization - A collection of tools for genealogy data processing and visualization.

A modern, TypeScript-first SDK for the FamilySearch API v3.

> **Note:** This package was previously published as `familysearch-sdk`. It has been moved to the `@treeviz` organization.

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

// Fetch pedigree data
const pedigree = await fetchPedigree(sdk, undefined, {
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

## OAuth Authentication

The SDK provides utilities for OAuth 2.0 authentication with FamilySearch.

```typescript
import {
  generateOAuthState,
  buildAuthorizationUrl,
  exchangeCodeForToken,
  validateAccessToken
} from 'familysearch-sdk/auth';

// Generate state for CSRF protection
const state = generateOAuthState();

// Build authorization URL
const authUrl = buildAuthorizationUrl({
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  environment: 'production'
}, state);

// Redirect user to authUrl...

// After callback, exchange code for token
const tokens = await exchangeCodeForToken(code, {
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  environment: 'production'
});

// Validate token
const isValid = await validateAccessToken(tokens.access_token, 'production');
```

## Places API

Search and retrieve place information from FamilySearch.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';
import { searchPlaces, getPlaceDetails } from 'familysearch-sdk/places';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Search for places
const results = await searchPlaces(sdk, 'London, England', {
  date: '1850',
  count: 10
});

// Get place details
const details = await getPlaceDetails(sdk, 'place-id');
console.log(details.name, details.latitude, details.longitude);
```

## Tree/Pedigree API

Fetch and manage family tree data.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';
import { fetchPedigree, getCurrentUser } from 'familysearch-sdk/tree';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Get current user
const user = await getCurrentUser(sdk);
console.log(user?.displayName);

// Fetch pedigree (will use current user's personId)
const pedigree = await fetchPedigree(sdk, undefined, {
  generations: 4,
  includeDetails: true,
  includeNotes: true
});
```

## Sources API

Retrieve source references linked to persons.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Fetch sources for a person
const sources = await sdk.getPersonSources('KWQS-BBQ');

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
```

## Person Match API

Find potential matches in the FamilySearch Tree for persons from external GEDCOM data or manually created trees.

```typescript
import { createFamilySearchSDK } from 'familysearch-sdk';

const sdk = createFamilySearchSDK({ accessToken: 'token' });

// Match a person from external GEDCOM data
const matches = await sdk.matchPerson({
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
const censusMatches = await sdk.matchPerson({
  givenName: 'Mary',
  familyName: 'Johnson',
  birthDate: '1875'
}, {
  collection: 'census',
  count: 10
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
const userMemories = await sdk.getUserMemories({ count: 50 });

// Get comments on a memory
const comments = await sdk.getMemoryComments('MEM-123');
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
- `getPlaceById(sdk, id)` - Get place by ID
- `getPlaceChildren(sdk, id, options)` - Get child places
- `getPlaceDetails(sdk, id)` - Get detailed place info

### Tree (`/tree`)

- `fetchPedigree(sdk, personId, options)` - Fetch ancestry data
- `getCurrentUser(sdk)` - Get current user info
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
- `sdk.getUserMemories(options)` - Get user's uploaded memories
- `sdk.getMemoryComments(memoryId)` - Get comments for a memory

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

