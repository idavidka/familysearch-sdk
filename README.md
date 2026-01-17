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
- 📚 **Sources API** - Fetch source references linked to persons

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

### Person Sources

- `sdk.getPersonSources(personId)` - Get source references for a person

### Utils (`/utils`)

- `convertToGedcom(pedigreeData, options)` - Convert to GEDCOM

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
