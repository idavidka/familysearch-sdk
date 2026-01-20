#!/usr/bin/env node

/**
 * FamilySearch SDK Coverage Checker
 * 
 * Compares documented API endpoints with SDK implementation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('FamilySearch SDK Coverage Checker');
console.log('=================================\n');

// Step 1: Run endpoint analyzer to get all documented endpoints
console.log('📊 Analyzing documented endpoints...');
execSync('node scripts/analyze-endpoints.cjs', { stdio: 'inherit' });

// Step 2: Get list of SDK implemented functions
console.log('\n📦 Extracting SDK implemented functions...');
const sdkFunctions = execSync(
  'grep -r "^export.*function" src/api --include="*.ts" | sed \'s/.*function //\' | sed \'s/(.*$//\' | sort | uniq',
  { encoding: 'utf-8' }
).trim().split('\n');

console.log(`Found ${sdkFunctions.length} SDK functions\n`);

// Step 3: Load endpoint analysis
const endpointsFile = 'api-docs-cache/endpoints.json';
if (!fs.existsSync(endpointsFile)) {
  console.error('ERROR: Run analyze-endpoints first!');
  process.exit(1);
}

const endpointsData = JSON.parse(fs.readFileSync(endpointsFile, 'utf-8'));

// Step 4: Create mapping of endpoint names to common function names
const endpointToFunction = (endpoint) => {
  const name = endpoint.toLowerCase();
  
  // Common mappings
  const mappings = {
    'readcurrenttreeperson': 'getCurrentUser',
    'readcurrentuser': 'getCurrentUser',
    'readagent': 'getAgent',
    'readperson': 'getPerson',
    'readpersons': 'getPersons',
    'createperson': 'createPerson',
    'updateperson': 'updatePerson',
    'deleteperson': 'deletePerson',
    'standardizedate': 'normalizeDate',
    'readplaces': 'searchPlaces',
    'readplace': 'getPlaceDetails',
  };
  
  if (mappings[name]) return mappings[name];
  
  // Generic patterns
  if (name.startsWith('read')) {
    return 'get' + name.substring(4).charAt(0).toUpperCase() + name.substring(5);
  }
  if (name.startsWith('get')) {
    return name.charAt(0).toLowerCase() + name.substring(1);
  }
  if (name.startsWith('create')) {
    return name.charAt(0).toLowerCase() + name.substring(1);
  }
  if (name.startsWith('update')) {
    return name.charAt(0).toLowerCase() + name.substring(1);
  }
  if (name.startsWith('delete')) {
    return name.charAt(0).toLowerCase() + name.substring(1);
  }
  
  return endpoint;
};

// Step 5: Check coverage
const results = {
  implemented: [],
  missing: [],
  uncertain: [],
};

let totalEndpoints = 0;

Object.keys(endpointsData.categories).forEach((category) => {
  endpointsData.categories[category].endpoints.forEach((ep) => {
    totalEndpoints++;
    const expectedFunc = endpointToFunction(ep.name);
    const found = sdkFunctions.some((f) => 
      f.toLowerCase() === expectedFunc.toLowerCase() ||
      f.toLowerCase().includes(ep.name.toLowerCase().substring(4)) // Skip 'read/get/create/update/delete'
    );
    
    if (found) {
      results.implemented.push({
        endpoint: ep.name,
        category,
        method: ep.method,
      });
    } else {
      // Check if it's a HEAD request or other rare method
      if (ep.method === 'HEAD' || ep.name.includes('header')) {
        results.uncertain.push({
          endpoint: ep.name,
          category,
          method: ep.method,
          reason: 'HEAD request - rarely needed',
        });
      } else {
        results.missing.push({
          endpoint: ep.name,
          category,
          method: ep.method,
          expected: expectedFunc,
        });
      }
    }
  });
});

// Step 6: Generate report
console.log('\n=================================');
console.log('COVERAGE REPORT');
console.log('=================================\n');

console.log(`Total Documented Endpoints: ${totalEndpoints}`);
console.log(`Implemented: ${results.implemented.length} (${Math.round(results.implemented.length / totalEndpoints * 100)}%)`);
console.log(`Missing: ${results.missing.length}`);
console.log(`Uncertain (HEAD/rare): ${results.uncertain.length}\n`);

// Group missing by category
const missingByCategory = {};
results.missing.forEach((item) => {
  if (!missingByCategory[item.category]) {
    missingByCategory[item.category] = [];
  }
  missingByCategory[item.category].push(item);
});

console.log('MISSING ENDPOINTS BY CATEGORY:');
console.log('==============================\n');

Object.keys(missingByCategory).sort().forEach((cat) => {
  console.log(`${cat} (${missingByCategory[cat].length} missing):`);
  missingByCategory[cat].forEach((item) => {
    console.log(`  ❌ ${item.method} ${item.endpoint} → Expected: ${item.expected}()`);
  });
  console.log('');
});

// Save detailed report
const reportFile = 'api-docs-cache/coverage-report.json';
fs.writeFileSync(reportFile, JSON.stringify({
  summary: {
    total: totalEndpoints,
    implemented: results.implemented.length,
    missing: results.missing.length,
    uncertain: results.uncertain.length,
    coverage: Math.round(results.implemented.length / totalEndpoints * 100),
  },
  implemented: results.implemented,
  missing: results.missing,
  uncertain: results.uncertain,
  generatedAt: new Date().toISOString(),
}, null, 2), 'utf-8');

console.log(`\nDetailed report saved to: ${reportFile}\n`);
