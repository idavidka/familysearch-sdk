/**
 * FamilySearch SDK API Modules
 * 
 * Centralized exports for all API endpoint groups.
 * 
 * This modular structure follows the official FamilySearch API documentation:
 * https://developers.familysearch.org/main/reference
 * 
 * Each module contains related API endpoints organized by functionality:
 * - Tree API: Persons, Relationships, Pedigrees, Search, Matches
 * - Memories API: Photos, Documents, Stories, Comments
 * - Standards API: Places, Dates, Names, Vocabularies
 * - User API: Current User profile
 */

// Tree API
export * from "./tree";

// Memories API
export * from "./memories";

// Discussions API
export * from "./discussions";

// Standards API
export * from "./standards";

// User API
export * from "./user";
