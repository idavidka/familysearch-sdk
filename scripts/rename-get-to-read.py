#!/usr/bin/env python3
"""
Rename get* functions to read* in TypeScript files
"""

import os
import re
import sys

# List of functions to rename (from the grep output)
FUNCTIONS_TO_RENAME = [
    "getNotAMatchDeclarations",
    "getTreeMatches",
    "getPersonNotAMatches",
    "getChildAndParentsRelationship",
    "getChildAndParentsRelationshipChangeHistory",
    "getChildAndParentsRelationshipNote",
    "getChildAndParentsRelationshipNotes",
    "getChildAndParentsRelationshipSourceReferences",
    "getChildAndParentsRelationshipSources",
    "getCoupleRelationship",
    "getCoupleRelationshipChangeHistory",
    "getCoupleRelationshipNote",
    "getCoupleRelationshipNotes",
    "getCoupleRelationshipSourceReferences",
    "getCoupleRelationshipSources",
    "getPreferredParentRelationship",
    "getPreferredSpouseRelationship",
    "getAncestry",
    "getDescendancy",
    "getPendingModifications",
    "getPersonMergeAnalysis",
    "getPersonNote",
    "getSourceDescription",
    "getSourceDescriptionChanges",
    "getSourceDescriptions",
    "getSourceFolders",
    "getUserSourceDescriptions",
    "getUserSourceFolders",
    "getCollectionSourceDescriptions",
    "getUserDefinedCollection",
    "getTree",
    "getTreeChanges",
    "getChildAndParentRelationshipNote",
]

def rename_in_file(filepath):
    """Rename get* to read* in a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = False
    
    for func_name in FUNCTIONS_TO_RENAME:
        read_name = func_name.replace('get', 'read', 1)
        
        # Replace function declaration
        pattern1 = rf'export async function {func_name}\('
        replacement1 = f'export async function {read_name}('
        if re.search(pattern1, content):
            content = re.sub(pattern1, replacement1, content)
            changes_made = True
            print(f"  ✓ Renamed function: {func_name} → {read_name}")
        
        # Replace in JSDoc examples
        pattern2 = rf'await {func_name}\('
        replacement2 = f'await {read_name}('
        content = re.sub(pattern2, replacement2, content)
        
        # Replace "Get" → "Read" in JSDoc comments for this function
        # This is tricky - only replace in the JSDoc block before the function
        pattern3 = rf'(/\*\*[^*]*\*\s+Get\s+[^*]+\*/)\s*export async function {read_name}\('
        def replace_get_in_jsdoc(match):
            jsdoc = match.group(1).replace(' * Get ', ' * Read ').replace(' * get ', ' * read ')
            jsdoc = jsdoc.replace('Failed to get ', 'Failed to read ')
            return f'{jsdoc}\nexport async function {read_name}('
        
        content = re.sub(pattern3, replace_get_in_jsdoc, content, flags=re.DOTALL)
    
    if changes_made and content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Main function"""
    src_dir = 'src/api/tree'
    
    if not os.path.exists(src_dir):
        print(f"Error: Directory {src_dir} not found!")
        print(f"Current directory: {os.getcwd()}")
        sys.exit(1)
    
    print("Renaming get* → read* functions...\n")
    
    files_changed = 0
    for filename in os.listdir(src_dir):
        if filename.endswith('.ts') and filename != 'index.ts':
            filepath = os.path.join(src_dir, filename)
            print(f"Processing {filename}...")
            if rename_in_file(filepath):
                files_changed += 1
    
    print(f"\n✅ Done! Changed {files_changed} files.")

if __name__ == '__main__':
    main()
