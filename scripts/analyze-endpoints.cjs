#!/usr/bin/env node

/**
 * Lightweight FamilySearch API Endpoint Analyzer
 * 
 * Extracts endpoint information from API_ENDPOINTS_DOCS.md
 * and creates a structured JSON file for analysis.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const URLS_FILE = 'API_ENDPOINTS_DOCS.md';
const OUTPUT_FILE = 'api-docs-cache/endpoints.json';
const DOCS_DIR = 'api-docs-cache';

console.log('FamilySearch API Endpoint Analyzer');
console.log('===================================\n');

// Create output directory
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Read URLs file
if (!fs.existsSync(URLS_FILE)) {
  console.error(`ERROR: ${URLS_FILE} not found!`);
  process.exit(1);
}

const content = fs.readFileSync(URLS_FILE, 'utf-8');
const urlMatches = content.match(/https:\/\/developers\.familysearch\.org[^\s"']*/g);

if (!urlMatches) {
  console.error('ERROR: No URLs found in file!');
  process.exit(1);
}

// Extract unique URLs and categorize them
const urls = [...new Set(urlMatches)];
console.log(`Found ${urls.length} unique URLs\n`);

// Categorize endpoints
const endpoints = urls.map((url) => {
  const parts = url.split('/');
  const type = parts.includes('reference') ? 'reference' : 'docs';
  const endpoint = url
    .replace(/.*\/reference\//, '')
    .replace(/.*\/docs\//, '')
    .replace(/[\/\?#].*$/, '');

  // Try to categorize by endpoint name
  let category = 'Other';
  const name = endpoint.toLowerCase();

  if (name.includes('person') && !name.includes('genealog')) {
    category = 'Tree Persons';
  } else if (name.includes('relationship') || name.includes('parent') || name.includes('couple') || name.includes('spouse')) {
    category = 'Relationships';
  } else if (name.includes('source')) {
    category = 'Sources';
  } else if (name.includes('note')) {
    category = 'Notes';
  } else if (name.includes('discussion') || name.includes('comment')) {
    category = 'Discussions';
  } else if (name.includes('memory') || name.includes('persona')) {
    category = 'Memories';
  } else if (name.includes('place')) {
    category = 'Places (Standards)';
  } else if (name.includes('date')) {
    category = 'Dates (Standards)';
  } else if (name.includes('name')) {
    category = 'Names (Standards)';
  } else if (name.includes('vocab')) {
    category = 'Vocabularies';
  } else if (name.includes('genealog')) {
    category = 'Genealogies (User Trees)';
  } else if (name.includes('match')) {
    category = 'Matches';
  } else if (name.includes('portrait')) {
    category = 'Portraits';
  } else if (name.includes('search')) {
    category = 'Search';
  } else if (name.includes('ancestry') || name.includes('descendancy') || name.includes('pedigree')) {
    category = 'Pedigrees';
  } else if (name.includes('user') || name.includes('agent') || name.includes('current')) {
    category = 'User/Agent';
  } else if (name.includes('group')) {
    category = 'Groups';
  } else if (name.includes('tree') && !name.includes('person')) {
    category = 'Trees';
  } else if (name.includes('change') || name.includes('history') || name.includes('restore')) {
    category = 'Change History';
  } else if (name.includes('auth') || name.includes('token')) {
    category = 'Authentication';
  }

  // Detect HTTP method from endpoint name
  let method = 'GET';
  if (name.startsWith('create')) method = 'POST';
  else if (name.startsWith('update')) method = 'PUT';
  else if (name.startsWith('delete')) method = 'DELETE';
  else if (name.startsWith('head')) method = 'HEAD';
  else if (name.startsWith('read') || name.startsWith('get')) method = 'GET';
  else if (name.startsWith('search')) method = 'GET';

  return {
    endpoint,
    url,
    type,
    category,
    method,
  };
});

// Group by category
const categories = {};
endpoints.forEach((ep) => {
  if (!categories[ep.category]) {
    categories[ep.category] = [];
  }
  categories[ep.category].push(ep);
});

// Create summary
const summary = {
  totalEndpoints: endpoints.length,
  totalCategories: Object.keys(categories).length,
  generatedAt: new Date().toISOString(),
  categories: {},
};

Object.keys(categories).sort().forEach((cat) => {
  summary.categories[cat] = {
    count: categories[cat].length,
    endpoints: categories[cat].map((ep) => ({
      name: ep.endpoint,
      method: ep.method,
      url: ep.url,
    })),
  };
});

// Write JSON output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2), 'utf-8');

console.log('Analysis Complete!');
console.log('=================');
console.log(`Total Endpoints: ${summary.totalEndpoints}`);
console.log(`Categories: ${summary.totalCategories}\n`);

Object.keys(summary.categories).forEach((cat) => {
  console.log(`  ${cat.padEnd(30)} ${summary.categories[cat].count} endpoints`);
});

console.log(`\nOutput saved to: ${OUTPUT_FILE}`);

// Create a quick markdown summary
const mdFile = path.join(DOCS_DIR, 'endpoints-summary.md');
let mdContent = '# FamilySearch API Endpoints Summary\n\n';
mdContent += `**Generated:** ${summary.generatedAt}\n`;
mdContent += `**Total Endpoints:** ${summary.totalEndpoints}\n`;
mdContent += `**Categories:** ${summary.totalCategories}\n\n`;

Object.keys(summary.categories).forEach((cat) => {
  mdContent += `## ${cat} (${summary.categories[cat].count} endpoints)\n\n`;
  summary.categories[cat].endpoints.forEach((ep) => {
    mdContent += `- **${ep.method}** \`${ep.name}\` - [${ep.url}](${ep.url})\n`;
  });
  mdContent += '\n';
});

fs.writeFileSync(mdFile, mdContent, 'utf-8');
console.log(`Summary markdown: ${mdFile}\n`);
