# GitHub Copilot Instructions - FamilySearch SDK

## Project Overview

**FamilySearch SDK** (@treeviz/familysearch-sdk) is a TypeScript SDK for interacting with the FamilySearch API. It provides a type-safe interface for authentication, fetching person data, and managing OAuth flows.

### Tech Stack

- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest with mocked HTTP responses
- **HTTP Client**: Native fetch API
- **OAuth**: FamilySearch OAuth 2.0
- **Module Format**: ES Modules

### Project Structure

```
familysearch-sdk/
├── src/
│   ├── client.ts          # Main SDK client
│   ├── auth.ts            # OAuth authentication
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Helper utilities
│   ├── __tests__/         # Unit tests
│   └── index.ts           # Main entry point
└── docs/                  # Documentation
```

### Key Features

1. **OAuth 2.0 Authentication**: Handle FamilySearch OAuth flow
2. **Person Data**: Fetch person records with relationships
3. **Pedigree**: Get ancestor trees (parents, grandparents, etc.)
4. **Type Safety**: Full TypeScript support with API response types
5. **Error Handling**: Graceful handling of API errors and rate limits
6. **Token Management**: Automatic token refresh

### Code Style & Conventions

1. **Language**: All code, comments, and documentation should be in **English**
   - **Code**: Variable names, function names, class names must be in English
   - **Comments**: All inline comments and documentation comments must be in English
   - **Documentation**: All `.md` files must be in English
   - **Commit Messages**: Write commit messages in English
   - **Copilot Responses**: Always respond in the **same language as the user's question**
2. **TypeScript**: Strict mode enabled, avoid `any` types
3. **File Naming**: `kebab-case.ts`
4. **API Client**: Use class-based structure for SDK
5. **Error Handling**: Throw descriptive errors with context
6. **Testing**: Mock all HTTP requests in tests

### Commit Message Convention

Follow **Conventional Commits** specification:

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `chore`: Other changes

**Examples:**
```
feat(auth): add refresh token support
fix(client): handle 429 rate limit responses
docs: update authentication flow guide
test(pedigree): add ancestor fetch tests
refactor(types): improve API response typing
```

### Common Tasks

#### Basic Usage
```typescript
import { FamilySearchClient } from '@treeviz/familysearch-sdk';

const client = new FamilySearchClient({
  appKey: 'YOUR_APP_KEY',
  redirectUri: 'https://your-app.com/callback'
});

// OAuth flow
const authUrl = client.getAuthUrl();
// Redirect user to authUrl...

// Exchange code for token
await client.authenticate(authCode);

// Fetch person data
const person = await client.getPerson('PERSON-ID');
const ancestors = await client.getPedigree('PERSON-ID', { generations: 4 });
```

#### Running Tests
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:ui      # Vitest UI
```

#### Building
```bash
npm run build        # Build for production
npm run dev          # Development mode
```

#### Publishing to NPM
```bash
npm version patch|minor|major
npm run build
npm publish
```

### API Structure

#### Main Classes

1. **FamilySearchClient**
   - Constructor: `new FamilySearchClient(config)`
   - Methods: 
     - `getAuthUrl()`: Generate OAuth authorization URL
     - `authenticate(code)`: Exchange auth code for access token
     - `getPerson(id)`: Fetch person record
     - `getPedigree(id, options)`: Fetch ancestor tree
     - `getCurrentUser()`: Get authenticated user info

2. **Auth Utilities**
   - `generateAuthUrl(appKey, redirectUri, state)`
   - `exchangeCodeForToken(code, appKey, redirectUri)`
   - `refreshAccessToken(refreshToken, appKey)`

### FamilySearch API Integration

#### OAuth Flow
1. Generate authorization URL with `getAuthUrl()`
2. Redirect user to FamilySearch login
3. Receive callback with authorization code
4. Exchange code for access token with `authenticate()`
5. Use access token for API requests

#### Rate Limiting
- FamilySearch API has rate limits (varies by endpoint)
- SDK should handle 429 responses gracefully
- Implement retry logic with exponential backoff

#### Error Handling
```typescript
try {
  const person = await client.getPerson('INVALID-ID');
} catch (error) {
  if (error.statusCode === 404) {
    console.error('Person not found');
  } else if (error.statusCode === 401) {
    console.error('Authentication required');
  }
}
```

### Testing Best Practices

1. **Mock HTTP**: Use Vitest to mock fetch responses
2. **Test OAuth Flow**: Mock authorization and token exchange
3. **Error Cases**: Test API errors (404, 401, 429, 500)
4. **Type Safety**: Verify response types match TypeScript definitions
5. **Token Refresh**: Test automatic token refresh logic

### Performance Optimization

- **Caching**: Cache person data to reduce API calls
- **Batch Requests**: Combine multiple API calls when possible
- **Parallel Fetching**: Use Promise.all for independent requests
- **Rate Limit Respect**: Implement request throttling

### Common Issues & Solutions

#### CORS Errors
- FamilySearch API requires proper CORS configuration
- Use server-side proxy for sensitive operations
- Handle preflight OPTIONS requests

#### Token Expiration
- Access tokens expire after ~24 hours
- Implement automatic token refresh
- Store refresh token securely

#### API Changes
- FamilySearch API may change over time
- Version API responses if possible
- Monitor for deprecation notices

### Security Best Practices

1. **App Key**: Never expose app key in client-side code
2. **Tokens**: Store access tokens securely (HttpOnly cookies, secure storage)
3. **HTTPS**: Always use HTTPS for OAuth redirects
4. **State Parameter**: Use state parameter to prevent CSRF attacks
5. **Validation**: Validate all API responses before using

### Documentation

All public APIs should have JSDoc comments:

```typescript
/**
 * Fetch a person record from FamilySearch
 * @param personId - FamilySearch person ID (e.g., "KWQS-BBQ")
 * @returns Person data with relationships
 * @throws Error if person not found or unauthorized
 */
async getPerson(personId: string): Promise<Person> {
  // ...
}
```

### Type Definitions

Maintain accurate TypeScript types for all API responses:

```typescript
interface Person {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  birth?: Event;
  death?: Event;
  parents?: Person[];
  spouses?: Person[];
  children?: Person[];
}

interface Event {
  date?: string;
  place?: string;
}
```

### Contact & Resources

- **NPM Package**: @treeviz/familysearch-sdk
- **Repository**: https://github.com/idavidka/familysearch-sdk
- **FamilySearch API**: https://www.familysearch.org/developers/
- **Parent Project**: TreeViz Monorepo

---

**When working on this project:**
1. Always write in English (code, comments, docs)
2. Mock all HTTP requests in tests
3. Follow FamilySearch API guidelines
4. Handle OAuth flow securely
5. Implement proper error handling
6. Respect API rate limits
7. **After completing changes, ALWAYS suggest a commit message** following Conventional Commits format

**Commit Message Reminder:**
After making any changes, ALWAYS provide a suggested commit message at the end of your response:

```
---

## 🎯 Suggested Commit Message

type(scope): brief description
```
