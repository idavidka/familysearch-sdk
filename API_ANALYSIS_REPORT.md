# FamilySearch SDK API Analysis Report

**Generated:** 2026-01-21T13:30:14.488Z

---

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Endpoints** | 204 | 100% |
| ✅ **Implemented** | 150 | 74% |
| ❌ **Missing** | 42 | 21% |
| 🚫 **Not Applicable** | 12 | 6% |

**Applicable Coverage:** 150/192 (78%)

---

## ✅ Implemented Endpoints (150)

### checkplaceischild

- **Title:** Check If Place IsChild
- **Method:** GET
- **Function:** `checkPlaceIsChild()`
- **Description:** Check if a place is a child of one or more of the specified parent places.

### createchildandparentsrelationshipnote

- **Title:** Create Child and Parents Relationship Note
- **Method:** POST
- **Function:** `createChildAndParentsRelationshipNote()`
- **Description:** Create a note on a child and parents relationship.

### createchildandparentsrelationshipsourcereference

- **Title:** Create Child and Parents Source Reference
- **Method:** POST
- **Function:** `createChildAndParentsRelationshipSourceReference()`
- **Description:** Create a source reference attached to a child and parents relationship.

### createcouplerelationshipnote

- **Title:** Create Couple Relationship Note
- **Method:** POST
- **Function:** `createCoupleRelationshipNote()`
- **Description:** Create a note attached to a couple relationship. The Couple Relationship Notes resource is an embedded resource, and any links to this resource are to be treated as embedded links.

### createcouplerelationshipsourcereference

- **Title:** Create Couple Relationship Source Reference
- **Method:** POST
- **Function:** `createCoupleRelationshipSourceReference()`
- **Description:** Create a couple relationship source reference.

### creatediscussion

- **Title:** Create Discussion
- **Method:** POST
- **Function:** `createDiscussion()`
- **Description:** Only one discussion may be created at a time.

### creategenealogiesperson

- **Title:** Create Genealogies Person
- **Method:** POST
- **Function:** `createGenealogyPerson()`
- **Description:** Create a person in the specified tree.

### creategenealogiessourcedescription

- **Title:** Create Source Description
- **Method:** POST
- **Function:** `createGenealogySourceDescription()`
- **Description:** Create a source description in a tree.

### creategenealogiestree

- **Title:** Create Genealogies Tree
- **Method:** POST
- **Function:** `createGenealogyTree()`
- **Description:** Create a tree in the user-submitted genealogies.

### creategroup

- **Title:** Create Group
- **Method:** POST
- **Function:** `createGroup()`
- **Description:** Create a CET group.  A CET group is represented as a GedcomX FamilySearch extension Group.

### creatememories

- **Title:** Create Memory
- **Method:** POST
- **Function:** `createMemories()`
- **Description:** Create a memory.

### createnamesegments

- **Title:** Compose Full Name
- **Method:** POST
- **Function:** `createNameSegments()`
- **Description:** Compose a full name from its parts.

### createperson

- **Title:** Create Person
- **Method:** POST
- **Function:** `createPerson()`
- **Description:** Create a person.

### createpersonmemory

- **Title:** Create Person Memory
- **Method:** POST
- **Function:** `createPersonMemory()`
- **Description:** Create a memory for a person. The memory can be a photo, document, story, or obituary.

### createpersonnote

- **Title:** Create Person Note
- **Method:** POST
- **Function:** `createPersonNote()`
- **Description:** Create a note on a person.

### createsourcedescription

- **Title:** Create Source Description
- **Method:** POST
- **Function:** `createSourceDescription()`
- **Description:** Create a source description.

### createsourcefolder

- **Title:** Create Source Folder
- **Method:** POST
- **Function:** `createSourceFolder()`
- **Description:** Create a user-defined collection.

### delete

- **Title:** Delete User History Entry
- **Method:** DELETE
- **Function:** `delete()`
- **Description:** Delete a users history entry.

### deletechildandparentsrelationship

- **Title:** Delete Child and Parents Relationship
- **Method:** DELETE
- **Function:** `deleteChildAndParentsRelationship()`
- **Description:** Delete a child and parents relationship.

### deletechildandparentsrelationshipconclusion

- **Title:** Delete Child and Parents Relationship Conclusion
- **Method:** DELETE
- **Function:** `deleteChildAndParentsRelationshipConclusion()`
- **Description:** Delete a child and parents relationship conclusion

### deletechildandparentsrelationshipnote

- **Title:** Delete Child and Parents Relationship Note
- **Method:** DELETE
- **Function:** `deleteChildAndParentsRelationshipNote()`
- **Description:** Delete a note

### deletechildandparentsrelationshipparent

- **Title:** Delete Parent from Child and Parents Relationship
- **Method:** DELETE
- **Function:** `deleteChildAndParentsRelationshipParent()`
- **Description:** Remove a parent from the child and parent relationship.

### deletechildandparentsrelationshipsourcereference

- **Title:** Delete Child and Parents Source Reference
- **Method:** DELETE
- **Function:** `deleteChildAndParentsRelationshipSourceReference()`
- **Description:** Delete a source reference attached to a child and parents relationship.

### deletecouplerelationship

- **Title:** Delete Couple Relationship
- **Method:** DELETE
- **Function:** `deleteCoupleRelationship()`
- **Description:** Delete a couple relationship.

### deletecouplerelationshipconclusion

- **Title:** Delete Couple Relationship Conclusion
- **Method:** DELETE
- **Function:** `deleteCoupleRelationshipConclusion()`
- **Description:** Delete a Couple Relationship conclusion.

### deletecouplerelationshipnote

- **Title:** Delete Couple Relationship Note
- **Method:** DELETE
- **Function:** `deleteCoupleRelationshipNote()`
- **Description:** Delete a couple relationship note.

### deletecouplerelationshipsourcereference

- **Title:** Delete Couple Relationship Source Reference
- **Method:** DELETE
- **Function:** `deleteCoupleRelationshipSourceReference()`
- **Description:** Delete a couple relationship source reference.

### deletegenealogiesconclusion

- **Title:** Delete Conclusion
- **Method:** DELETE
- **Function:** `deleteGenealogyConclusion()`
- **Description:** Delete a conclusion on a person.

### deletegenealogiesperson

- **Title:** Delete Genealogies Person
- **Method:** DELETE
- **Function:** `deleteGenealogyPerson()`
- **Description:** Delete a genealogies person.

### deletegenealogiesrelationship

- **Title:** Delete Relationship
- **Method:** DELETE
- **Function:** `deleteGenealogyRelationship()`
- **Description:** Delete a relationship.

### deletegenealogiessourcedescription

- **Title:** Delete Source Description
- **Method:** DELETE
- **Function:** `deleteGenealogySourceDescription()`
- **Description:** Delete a source description.

### deletegenealogiestree

- **Title:** Delete Tree
- **Method:** DELETE
- **Function:** `deleteGenealogyTree()`
- **Description:** Delete a genealogies tree.

### deletegroup

- **Title:** Delete Group
- **Method:** DELETE
- **Function:** `deleteGroup()`
- **Description:** Delete a CET group.  A CET group is represented as a Gedcomx Group.

### deletememory

- **Title:** Delete Memory
- **Method:** DELETE
- **Function:** `deleteMemory()`
- **Description:** Delete a memory.

### deleteperson

- **Title:** Delete Person
- **Method:** DELETE
- **Function:** `deletePerson()`
- **Description:** Delete a single Person by the personId

### deletepersonconclusion

- **Title:** Delete Conclusion
- **Method:** DELETE
- **Function:** `deletePersonConclusion()`
- **Description:** Delete a person conclusion.

### deletepersondiscussionreference

- **Title:** Delete Discussion Reference
- **Method:** DELETE
- **Function:** `deletePersonDiscussionReference()`
- **Description:** Delete a reference to a discussion for a person

### deletepersonmemoriespersonareference

- **Title:** Delete Memory Persona Reference
- **Method:** DELETE
- **Function:** `deletePersonMemoryPersonaReference()`
- **Description:** Delete a memory persona reference.

### deletepersonnotamatch

- **Title:** Delete Not-a-Match Declaration
- **Method:** DELETE
- **Function:** `deleteNotAMatchDeclaration()`
- **Description:** Delete a not-a-match declaration means that the primary person could be a match with the given person.
A reason string can be provided indicating why the user believes the two persons may no longer be considered as distinct individuals.
The reason is sent as an 'X-Reason' header on the request. This reason should have a maximum length of 2000 characters,
and if the reason supplied is too long, the request may fail as a bad request.

### deletepersonnotamatches

- **Title:** Delete Not-a-Match Declarations
- **Method:** DELETE
- **Function:** `deleteAllNotAMatchDeclarations()`
- **Description:** Delete a not-a-match declaration means that the primary person could be a match with the given list of persons.
A reason string can be provided indicating why the user believes the two persons may no longer be considered as distinct individuals.
The reason is sent as an 'X-Reason' header on the request. This reason should have a maximum length of 2000 characters,
and if the reason supplied is too long, the request may fail as a bad request.

### deletepersonnote

- **Title:** Delete Person Note
- **Method:** DELETE
- **Function:** `deletePersonNote()`
- **Description:** Delete a note attached to a person.

### deletepersonportrait

- **Title:** Delete Person Portrait
- **Method:** DELETE
- **Function:** `deletePersonPortrait()`
- **Description:** Delete a portrait. The delete operation will only remove the current user's portrait selection, meaning the user may still see a "default" portrait that was selected by another user.

### deletepersonsourcereference

- **Title:** Delete Person Source Reference
- **Method:** DELETE
- **Function:** `deletePersonSourceReference()`
- **Description:** Delete a source reference for a person.

### deletepreferredparentrelationship

- **Title:** Delete Preferred Parent Relationship
- **Method:** DELETE
- **Function:** `deletePreferredParentRelationship()`
- **Description:** Delete the preferred parent relationship for the given user and tree person.

### deletepreferredspouserelationship

- **Title:** Delete Preferred Spouse Relationship
- **Method:** DELETE
- **Function:** `deletePreferredSpouseRelationship()`
- **Description:** Delete the preferred spouse relationship for the given user and tree person.

### deletesourcedescription

- **Title:** Delete Source Description
- **Method:** DELETE
- **Function:** `deleteSourceDescription()`
- **Description:** Delete a source description.

### deletesourcedescriptionsfromcollections

- **Title:** Delete Source Descriptions From Collections
- **Method:** DELETE
- **Function:** `removeSourcesFromCollection()`
- **Description:** Remove one or more source descriptions from all user-defined collections owned by a specific user.

### deleteuserdefinedcollection

- **Title:** Delete User Defined Collection
- **Method:** DELETE
- **Function:** `deleteUserDefinedCollection()`
- **Description:** Delete a user-defined collection.  The Source Folder resource defines the interface for a source folder. This resource is used to delete a source folder. The default source folder is the folder without a name. If a folder isn't specified when a source is attached, the source will be put in the default folder.

### getaccesstoken

- **Title:** Request an OAuth 2.0 Access Token
- **Method:** POST
- **Function:** `exchangeCodeForToken()`
- **Description:** The Access Token resource is used to obtain an access token to be used for the FamilySearch API.

### getchildandparentsrelationship

- **Title:** Read Child and Parents Relationship
- **Method:** GET
- **Function:** `getChildAndParentsRelationship()`
- **Description:** Read a child and parents relationship.

### getchildandparentsrelationshipnotes

- **Title:** Read Child and Parents Relationship Notes
- **Method:** GET
- **Function:** `getChildAndParentsRelationshipNotes()`
- **Description:** Read the list of notes attached to a child-and-parents relationship.

### getchildandparentsrelationshipsourcereferences

- **Title:** Read Child and Parents Source References
- **Method:** GET
- **Function:** `getChildAndParentsRelationshipSourceReferences()`
- **Description:** Read the source references attached to a child and parents relationship.

### getchildandparentsrelationshipsources

- **Title:** Read Child and Parents Relationship Sources
- **Method:** GET
- **Function:** `getChildAndParentsRelationshipSources()`
- **Description:** Read sources associated with a child and parents relationship.

### getcouplerelationshipnotes

- **Title:** Read Couple Relationship Notes
- **Method:** GET
- **Function:** `getCoupleRelationshipNotes()`
- **Description:** Read the list of notes attached to a couple relationship. The Couple Relationship Notes resource is an embedded resource, and any links to this resource are to be treated as embedded links.

### getgroups

- **Title:** Read User's Groups
- **Method:** GET
- **Function:** `getGroups()`
- **Description:** Get the groups that the current user is a member of.  A CET group is represented as a GedcomX FamilySearch extension Group.

### getmemories

- **Title:** Read Memories
- **Method:** GET
- **Function:** `getMemories()`
- **Description:** Read a list of memories.

### getnamescript

- **Title:** Get Name Script
- **Method:** GET
- **Function:** `getNameScript()`
- **Description:** Get the script of a name.

### getnamesegments

- **Title:** Segment a Name
- **Method:** GET
- **Function:** `getNameSegments()`
- **Description:** Segment a full name into its parts.

### getpersonmemories

- **Title:** Get Person Memory Descriptions
- **Method:** GET
- **Function:** `getPersonMemories()`
- **Description:** Read the list of descriptions of the memories for the person. The descriptions will include title, description, memory type and URIs to the raw memories.

### getpreferredparentrelationship

- **Title:** Read Preferred Parent Relationship
- **Method:** GET
- **Function:** `getPreferredParentRelationship()`
- **Description:** Read the preferred parent relationship for the given user and tree person.

### getsourcedescriptionchanges

- **Title:** Get Source Description Changes
- **Method:** POST
- **Function:** `getSourceDescriptionChanges()`
- **Description:** Get a list of source description ids that have changed since the specified timestamp.

### readagent

- **Title:** Read Agent
- **Method:** GET
- **Function:** `getAgent()`
- **Description:** Read an agent. An agent can be a user, a system, or an organization.

### readancestry

- **Title:** Read Ancestry
- **Method:** GET
- **Function:** `getAncestry()`
- **Description:** Read a person and the person's ancestors for the specified number of generations

### readchildandparentrelationship

- **Title:** Read Child and Parents Change History
- **Method:** GET
- **Function:** `getChildAndParentsRelationshipChangeHistory()`
- **Description:** Read the history of a child and parents relationship

### readchildandparentrelationshipnote

- **Title:** Read Child and Parents Relationship Note
- **Method:** GET
- **Function:** `getChildAndParentsRelationshipNote()`
- **Description:** Read a specific note (nid) on a child-and-parents relationship (caprid).

### readcomments

- **Title:** Read Comments
- **Method:** GET
- **Function:** `getDiscussionComments()`
- **Description:** Read the list of comments for a specific discussion.

### readcouplerelationship

- **Title:** Read Couple Relationship
- **Method:** GET
- **Function:** `getCoupleRelationship()`
- **Description:** Read a specific couple relationship.

### readcouplerelationshipchangehistory

- **Title:** Read Couple Relationship Change History
- **Method:** GET
- **Function:** `getCoupleRelationshipChangeHistory()`
- **Description:** Read the change history of a couple relationship.

### readcouplerelationshipnote

- **Title:** Read Couple Relationship Note
- **Method:** GET
- **Function:** `getCoupleRelationshipNote()`
- **Description:** Read a couple relationship note.

### readcouplerelationshipsourcereferences

- **Title:** Read Couple Relationship Source References
- **Method:** GET
- **Function:** `getCoupleRelationshipSourceReferences()`
- **Description:** Read the source references for a couple relationship.

### readcouplerelationshipsources

- **Title:** Read Couple Relationship Sources
- **Method:** GET
- **Function:** `getCoupleRelationshipSources()`
- **Description:** Read all sources associated with a couple relationship.

### readcurrenttree

- **Title:** Read Current Tree Id
- **Method:** GET
- **Function:** `getCurrentTree()`
- **Description:** Retrieve the id of the current tree.

### readcurrenttreeperson

- **Title:** Read Current User Tree Person
- **Method:** GET
- **Function:** `getCurrentUser()`
- **Description:** Read the tree person that represents the current user.

### readcurrentuser

- **Title:** Read Current User
- **Method:** GET
- **Function:** `getCurrentUser()`
- **Description:** Read the current user's profile information.

### readdescendancy

- **Title:** Read Descendancy
- **Method:** GET
- **Function:** `getDescendancy()`
- **Description:** Read the descendancy of a person.

### readdiscussion

- **Title:** Read Discussion
- **Method:** GET
- **Function:** `getDiscussion()`
- **Description:** Read a discussion.

### readgenealogiesbulkmatch

- **Title:** Read Genealogies Bulk Matches
- **Method:** GET
- **Function:** `getGenealogyBulkMatch()`
- **Description:** Read a set of matches for the given genealogies persons.

### readgenealogiesnote

- **Title:** Read Genealogies Note
- **Method:** GET
- **Function:** `getGenealogyNote()`
- **Description:** Read a genealogies note.

### readgenealogiesperson

- **Title:** Read Genealogies Person
- **Method:** GET
- **Function:** `getGenealogyPerson()`
- **Description:** Read a genealogies person, including the names, gender, and facts of the person.

### readgenealogiespersonmatches

- **Title:** Read Genealogies Person Matches
- **Method:** GET
- **Function:** `getGenealogyPersonMatches()`
- **Description:** The Person Matches by Genealogies Person Id resource defines the set of matches in the system for a person in the user-submitted genealogies.

### readgenealogiespersons

- **Title:** Read Genealogies Persons
- **Method:** GET
- **Function:** `getGenealogyPersons()`
- **Description:** Read the list of persons in the specified tree.

### readgenealogiessourcedescription

- **Title:** Read Source Description
- **Method:** GET
- **Function:** `getGenealogySourceDescription()`
- **Description:** Read a source description.

### readgenealogiestree

- **Title:** Read Tree
- **Method:** GET
- **Function:** `getGenealogyTree()`
- **Description:** Read a tree in a user-submitted genealogy.

### readgenealogiestrees

- **Title:** Read Genealogies Trees
- **Method:** GET
- **Function:** `getGenealogyTrees()`
- **Description:** Read the trees the current user has created.

### readgroup

- **Title:** Read Group
- **Method:** GET
- **Function:** `getGroup()`
- **Description:** Read a group.  A CET group is represented as a Gedcomx Group.

### readmemory

- **Title:** Read Memory
- **Method:** GET
- **Function:** `getMemory()`
- **Description:** Read a memory.  A memory consists of one or more artifacts, each with an associated description.  When reading a memory, it is represented as the (paged) list of artifact descriptions.

### readmemorycomments

- **Title:** Read Memory Comments
- **Method:** GET
- **Function:** `getMemoryWithComments()`
- **Description:** Read a memory's comments.

### readmemorypersona

- **Title:** Read Memory Persona
- **Method:** GET
- **Function:** `getMemoryPersona()`
- **Description:** Read a memories persona.

### readmemorypersonas

- **Title:** Read Memory Personas
- **Method:** GET
- **Function:** `getMemoryPersonas()`
- **Description:** Read a memories personas.

### readpartnereligibility

- **Title:** Read Partner Eligibility
- **Method:** GET
- **Function:** `checkPartnerEligibility()`
- **Description:** Determine whether the current user is eligible for a free partner account.

### readperson

- **Title:** Read Person
- **Method:** GET
- **Function:** `getPerson()`
- **Description:** Retrieve a single Person by the personId including the names, gender, and facts of the person.

### readpersonchangehistory

- **Title:** Read Person Change History
- **Method:** GET
- **Function:** `getPersonChangeHistory()`
- **Description:** Read the change history for a person. Each entry in the change history provides details about what was changed, who performed the change, and an explanation of why the change was made if the reason was provided by the user.

### readpersonchildren

- **Title:** Read Children
- **Method:** GET
- **Function:** `getPersonChildren()`
- **Description:** Read a person's children.

### readpersonfamilies

- **Title:** Read Families
- **Method:** GET
- **Function:** `getPersonFamilies()`
- **Description:** Read the families for a specific person. The data returned includes the person, their spouses, the relationships to each spouse, their children, the relationships to each child, their parents, the relationships to each parent, their siblings, and the relationships for each sibling to each parent.

### readpersonmerge

- **Title:** Read Person Merge
- **Method:** GET
- **Function:** `getPersonMerge()`
- **Description:** Read the current state of the potential merge by performing a merge analysis. The filter request parameter may be specified indicating which categories of information need to be analyzed. If no filter is specified then all categories will be used. The valid filter categories are listed below.

### readpersonnotamatches

- **Title:** Read Not-a-Match Declarations
- **Method:** GET
- **Function:** `getNotAMatchDeclarations()`
- **Description:** Get a list of not-a-match declarations associated with the person; in other words, get a list of ids of other Persons who should not be merged with the indicated person, along with the associated reasons.

### readpersonnote

- **Title:** Read Person Note
- **Method:** GET
- **Function:** `getPersonNote()`
- **Description:** Read a note attached to a person. The Person Note resource is an embedded resource, and any links to this resource are to be treated as embedded links.

### readpersonnotes

- **Title:** Read Person Notes
- **Method:** GET
- **Function:** `getPersonNotes()`
- **Description:** Read the list of notes attached to a person. The Person Notes resource is an embedded resource, and any links to this resource are to be treated as embedded links.

### readpersonparents

- **Title:** Read Parents
- **Method:** GET
- **Function:** `getPersonParents()`
- **Description:** Read the set of relationships for a specific person.

### readpersonportrait

- **Title:** Read Person Portrait
- **Method:** GET
- **Function:** `getPersonPortrait()`
- **Description:** Get the location of the portrait image. A successful invocation will return a 307 redirect to the image.

### readpersonportraits

- **Title:** Read Person Portraits
- **Method:** GET
- **Function:** `getPersonPortraits()`
- **Description:** Read a list of portrait descriptions associated with a tree person.

### readpersons

- **Title:** Read Persons List
- **Method:** GET
- **Function:** `getPersons()`
- **Description:** Read a list of persons. Invalid ids will be returned in Warning headers. The maximum number of persons that can be read is 200.

### readpersonsources

- **Title:** Read Person Sources
- **Method:** GET
- **Function:** `getPersonSources()`
- **Description:** Read all sources associated with a person.

### readpersonspouses

- **Title:** Read Spouses
- **Method:** GET
- **Function:** `getPersonSpouses()`
- **Description:** Read the set of spouses for a specific person.

### readplace

- **Title:** Read Place
- **Method:** GET
- **Function:** `getPlaceDetails()`
- **Description:** Read a place. A Place resource represents a logical place and will have one or more Place Descriptions associated with it. For example, the city of Provo exists in the county of Utah, in the state of Utah, in the United States. However, when Provo was first established, the state of Utah did not exist. Utah County existed in the Utah Territory. So, Provo has two Place Descriptions but only one Place resource:

### readplacechildren

- **Title:** Read Place Children
- **Method:** GET
- **Function:** `getPlaceChildren()`
- **Description:** Read the children of a place. It returns the direct children (those place descriptions that are in the jurisdiction) of a given place description. It is generally used for traversing from parent jurisdiction to child jurisdiction where no additional flexibility is needed or wanted. For example, if there's a need to filter on type, year, etc. this resource should not be used. Using this resource to search for children of a place (/description/1/children) will return the same results as searching for everything with the parentId of place "1" (/search?q=+parentId:1).

### readplacedescription

- **Title:** Read Place Description
- **Method:** GET
- **Function:** `getPlaceDescription()`
- **Description:** Read a place description. A Place Description represents a place in a given time period, within a specific jurisdiction, with a specific official name. Place Description identifiers are in a different namespace than Place identifiers - for example, Place ID 123 is not the same as Place Description ID 123.

### readplacedescriptions

- **Title:** Read Place Descriptions
- **Method:** GET
- **Function:** `getPlaceDescriptions()`
- **Description:** Read a list of place descriptions.  See the Place Description resource for a definition of a Place Description.

### readplaces

- **Title:** Places Search
- **Method:** GET
- **Function:** `searchPlaces()`
- **Description:** The Places Search query facilitates the interpretation of a place name with a standardized place description. Clients can interpret user-entered place names and associate a standardized place with the name. They can also retrieve specific types of places by including specific name-value pairs withing the places query parameter. Please note that all name-value pairs and URLs must adhere to the HTTP specifications. The following name-value pairs are applicable to the places query:

### readplacetype

- **Title:** Read Place Type
- **Method:** GET
- **Function:** `getPlaceType()`
- **Description:** Read a place type.  A place type is a type of place, such as a cemetery, city, state, etc. Types have translated names, which is useful for localization purposes.

### readplacetypegroup

- **Title:** Read Place Type Group
- **Method:** GET
- **Function:** `getPlaceTypeGroup()`
- **Description:** Read a place type group. A place type group is a collection of related place types that provides convenience when working with types. For example, there are a number of city-like types, such as city, populated place, and capital city. A "city-like" type group can be used to include all of them.

### readplacetypegroups

- **Title:** Read Place Type Groups
- **Method:** GET
- **Function:** `getPlaceTypeGroups()`
- **Description:** Read the list of place type groups. A place type group is a collection of related place types that provides convenience when working with types. For example, a "city-like" type group includes city, populated place, and capital city types.

### readplacetypes

- **Title:** Read Place Types
- **Method:** GET
- **Function:** `getPlaceTypes()`
- **Description:** Read the list of place types. A place type defines a category of place such as cemetery, city, state, etc. Types have translated names for localization purposes.

### readpreferredspouserelationship

- **Title:** Read Preferred Spouse Relationship
- **Method:** GET
- **Function:** `getPreferredSpouseRelationship()`
- **Description:** Read the preferred spouse relationship for the given user and tree person.

### readsourcedescription

- **Title:** Read Source Description
- **Method:** GET
- **Function:** `getSourceDescription()`
- **Description:** Read a source description. The Source Description resource gets a user's source description.

### readsourcedescriptions

- **Title:** Read Current User Source Descriptions
- **Method:** GET
- **Function:** `getSourceDescriptions()`
- **Description:** Read a list of all user-defined source descriptions.

### readsourcefolders

- **Title:** Read Source Folders
- **Method:** GET
- **Function:** `getSourceFolders()`
- **Description:** Read the collections defined by the current user.

### readtree

- **Title:** Read Tree
- **Method:** GET
- **Function:** `getTree()`
- **Description:** Read a CET specified by the tree Id (tid) in the path.

### readuserdefinedcollection

- **Title:** Read User Defined Collection
- **Method:** GET
- **Function:** `getUserDefinedCollection()`
- **Description:** Get a user-defined collection.  The Source Folder resource defines the interface for a source folder. This resource is used to read a source folder. The default source folder is the folder without a name. If a folder isn't specified when a source is attached, the source will be put in the default folder.

### readuserhistory

- **Title:** Read User History
- **Method:** GET
- **Function:** `getUserHistory()`
- **Description:** Read a user's history.

### readusermemories

- **Title:** Read User Memories
- **Method:** GET
- **Function:** `getUserMemories()`
- **Description:** Read a user's memories. The user memories query provides a (paged) list of artifacts of memories that belong to a specific user. This allows users to get a list of all memories that have been uploaded by the current user. To do this, make a request to the User Memories resource with the Accept header set to application/x-fs-v1+json.

### readusersourcefolders

- **Title:** Read User Source Folders
- **Method:** GET
- **Function:** `getUserSourceFolders()`
- **Description:** Read the set of collections that belong to a specific user.

### restorechange

- **Title:** Restore Change
- **Method:** POST
- **Function:** `restoreChange()`
- **Description:** Restore a change to a person or relationship.

### restorechildandparentsrelationship

- **Title:** Restore Child and Parents Relationship
- **Method:** POST
- **Function:** `restoreChildAndParentsRelationship()`
- **Description:** Restore a child and parents relationship.

### restorecouplerelationship

- **Title:** Restore Couple Relationship
- **Method:** POST
- **Function:** `restoreCoupleRelationship()`
- **Description:** Execute the restore action which will un-delete the couple relationship and restore it to an active/visible state.

### restoregenealogiesperson

- **Title:** Restore Person
- **Method:** POST
- **Function:** `restoreGenealogyPerson()`
- **Description:** Restore a person that was deleted.

### restoreperson

- **Title:** Restore Person
- **Method:** POST
- **Function:** `restorePerson()`
- **Description:** Restore a person that was previously deleted.

### searchforparentplaces

- **Title:** Parent Places
- **Method:** GET
- **Function:** `searchParentPlaces()`
- **Description:** Search for places that contain the given text string and their parents. Filter results based on the parent ids parameter if provided.

### standardizedate

- **Title:** Standardize Date
- **Method:** GET
- **Function:** `normalizeDate()`
- **Description:** Get a string of standardized dates.

### updatechildandparentsrelationship

- **Title:** Update Child and Parents Relationship
- **Method:** POST
- **Function:** `updateChildAndParentsRelationship()`
- **Description:** Update a child and parents relationship.

### updatechildandparentsrelationshipnote

- **Title:** Update Child and Parents Relationship Note
- **Method:** POST
- **Function:** `updateChildAndParentsRelationshipNote()`
- **Description:** Update a specific child-and-parents relationship (caprid) note (nid).

### updatecouplerelationship

- **Title:** Update Couple Relationship
- **Method:** POST
- **Function:** `updateCoupleRelationship()`
- **Description:** Add or update specific facts attached to a couple. FamilySearch also allows you to update the persons in a couple relationship.

### updatecouplerelationshipnote

- **Title:** Update Couple Relationship Note
- **Method:** POST
- **Function:** `updateCoupleRelationshipNote()`
- **Description:** Update a couple relationship note.

### updatediscussion

- **Title:** Update Discussion
- **Method:** POST
- **Function:** `updateDiscussion()`
- **Description:** Update a discussion.

### updategenealogiesperson

- **Title:** Update Genealogies Person
- **Method:** POST
- **Function:** `updateGenealogyPerson()`
- **Description:** Update a person.

### updategenealogiesrelationship

- **Title:** Update Relationship
- **Method:** POST
- **Function:** `updateGenealogyRelationship()`
- **Description:** Update a relationship. The Relationship resource provides the interface to add or update specific facts attached to a relationship.

### updategenealogiessourcedescription

- **Title:** Update Source Description
- **Method:** POST
- **Function:** `updateGenealogySourceDescription()`
- **Description:** Update a source description.

### updategenealogiestree

- **Title:** Update Tree
- **Method:** POST
- **Function:** `updateGenealogyTree()`
- **Description:** Update a genealogies tree with persons and/or relationships.

### updategroup

- **Title:** Update Group
- **Method:** POST
- **Function:** `updateGroup()`
- **Description:** Update a CET group.  A CET group is represented as a Gedcomx Group.

### updatememory

- **Title:** Update Memory
- **Method:** POST
- **Function:** `updateMemory()`
- **Description:** Update a description of a memory.  A memory consists of one or more artifacts, each with an associated description.

### updateperson

- **Title:** Update Person
- **Method:** POST
- **Function:** `updatePerson()`
- **Description:** Update a single Person by the person ID including the names, gender, and facts of the person.

### updatepersonnotamatches

- **Title:** Update Not-a-Match Declaration
- **Method:** POST
- **Function:** `createNotAMatchDeclaration()`
- **Description:** Add or edit a not-a-match declaration, indicating that the two referenced persons are separate and distinct individuals and should not be merged together. This operation will fail if there already exists a not-a-match declaration for the person(s).

### updatepersonnote

- **Title:** Update Person Note
- **Method:** POST
- **Function:** `updatePersonNote()`
- **Description:** Update a note attached to a person. The Person Note resource is an embedded resource, and any links to this resource are to be treated as embedded links.

### updatepersonportraits

- **Title:** Update Person Portraits
- **Method:** POST
- **Function:** `updatePersonPortraits()`
- **Description:** Update the portrait list associated with a tree person.

### updatepreferredparentrelationship

- **Title:** Update Preferred Parent Relationship
- **Method:** PUT
- **Function:** `setPreferredParentRelationship()`
- **Description:** Set the preferred parent relationship for the given user and tree person.

### updatepreferredspouserelationship

- **Title:** Set Preferred Spouse Relationship
- **Method:** PUT
- **Function:** `setPreferredSpouseRelationship()`
- **Description:** Set the preferred spouse relationship for the given user and tree person.

### updatesourcedescription

- **Title:** Update Source Description
- **Method:** POST
- **Function:** `updateSourceDescription()`
- **Description:** Update a Source Description.

### updatesourcedescriptionstocollection

- **Title:** Update Source Descriptions To Collection
- **Method:** POST
- **Function:** `addSourcesToCollection()`
- **Description:** Add or move a set of source descriptions to this list of source descriptions in a user-defined collection.

### updateuserdefinedcollection

- **Title:** Update User Defined Collection
- **Method:** POST
- **Function:** `updateUserDefinedCollection()`
- **Description:** Update a user-defined collection.  The Source Folder resource defines the interface for a source folder. This resource is used to update a source folder. The default source folder is the folder without a name. If a folder isn't specified when a source is attached, the source will be put in the default folder.

### updateuserhistory

- **Title:** Update User History
- **Method:** POST
- **Function:** `updateUserHistory()`
- **Description:** Update a user's history. Only one Person at a time may be added to the history list.

---

## ❌ Missing Endpoints (42)

These endpoints need to be implemented. Implementation templates are provided below.

### allowpersonmerge

- **Title:** Allow Person Merge
- **Method:** OPTNS
- **URL:** `https://apibeta.familysearch.org/platform/tree/persons/{pid}/merges/{dpid}`
- **Description:** The OPTIONS method supplies information about the viability of this merge, using the Allow HTTP header. If this merge is viable, the Allow will indicate that both GET, POST may be applied. If the merge is available when the roles of the survivor and non-survivor are switched, a Link header will be supplied linking to the "merge mirror." When the merge is NOT viable, the Allow header will NOT include a GET or POST. The Warning header will contain details as to the reason the merge is not viable.

**Path Parameters:**

- `pid` (string) - required
- `dpid` (string) - required

**Response Codes:** 200, 404, 410, 429

**Implementation Template:**

```typescript
/**
 * Allow Person Merge
 *
 * The OPTIONS method supplies information about the viability of this merge, using the Allow HTTP header. If this merge is viable, the Allow will indicate that both GET, POST may be applied. If the merge is available when the roles of the survivor and non-survivor are switched, a Link header will be supplied linking to the "merge mirror." When the merge is NOT viable, the Allow header will NOT include a GET or POST. The Warning header will contain details as to the reason the merge is not viable.
 *
 * @param pid - pid
 * @param dpid - dpid
 * @returns Promise with response data
 */
export async function allowpersonmerge(
	sdk: FamilySearchSDK,
	pid: string,
	dpid: string
): Promise<any> {
	try {
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to allowpersonmerge:", error);
		throw error;
	}
}

```

---

### creatememorycomments

- **Title:** Create Memory Comments
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/comments`
- **Description:** Add comment(s) to a memory, or update existing comment(s). Comments to be updated are distinguished from comments to be added to the memory by the presence of an id on the comment.

**Path Parameters:**

- `mid` (string) - required

**Response Codes:** 204, 404

**Implementation Template:**

```typescript
/**
 * Create Memory Comments
 *
 * Add comment(s) to a memory, or update existing comment(s). Comments to be updated are distinguished from comments to be added to the memory by the presence of an id on the comment.
 *
 * @param mid - mid
 * @returns Promise with response data
 */
export async function creatememorycomments(
	sdk: FamilySearchSDK,
	mid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/memories/memories/${mid}/comments`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to creatememorycomments:", error);
		throw error;
	}
}

```

---

### creatememorypersona

- **Title:** Create Memory Persona
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/personas`
- **Description:** Create or update a memory persona.

**Path Parameters:**

- `mid` (string) - required

**Response Codes:** 201, 204, 400, 404

**Implementation Template:**

```typescript
/**
 * Create Memory Persona
 *
 * Create or update a memory persona.
 *
 * @param mid - mid
 * @returns Promise with response data
 */
export async function creatememorypersona(
	sdk: FamilySearchSDK,
	mid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/memories/memories/${mid}/personas`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to creatememorypersona:", error);
		throw error;
	}
}

```

---

### createpartneraccount

- **Title:** Create Partner Account
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/users/current/partner-account-created`
- **Description:** Create a partner account

**Response Codes:** 200

**Implementation Template:**

```typescript
/**
 * Create Partner Account
 *
 * Create a partner account
 *
 * @returns Promise with response data
 */
export async function createpartneraccount(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/users/current/partner-account-created`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to createpartneraccount:", error);
		throw error;
	}
}

```

---

### createrelationshipgedcomx

- **Title:** Create Relationship
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/tree/relationships`
- **Description:** Create a relationship.

**Response Codes:** 201, 429

**Implementation Template:**

```typescript
/**
 * Create Relationship
 *
 * Create a relationship.
 *
 * @returns Promise with response data
 */
export async function createrelationshipgedcomx(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/tree/relationships`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to createrelationshipgedcomx:", error);
		throw error;
	}
}

```

---

### createtree

- **Title:** Create Tree
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/trees`
- **Description:** Create a CET.  A CET is represented as a GedcomX FamilySearch extension {@code Tree}.

**Response Codes:** 201, 429

**Implementation Template:**

```typescript
/**
 * Create Tree
 *
 * Create a CET.  A CET is represented as a GedcomX FamilySearch extension {@code Tree}.
 *
 * @returns Promise with response data
 */
export async function createtree(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/trees`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to createtree:", error);
		throw error;
	}
}

```

---

### deletecomment

- **Title:** Delete Comment
- **Method:** DELETE
- **URL:** `https://apibeta.familysearch.org/platform/discussions/discussions/{did}/comments/{cmid}`
- **Description:** Delete a comment.

**Path Parameters:**

- `did` (string) - required
- `cmid` (string) - required

**Response Codes:** 204, 404

**Implementation Template:**

```typescript
/**
 * Delete Comment
 *
 * Delete a comment.
 *
 * @param did - did
 * @param cmid - cmid
 * @returns Promise with response data
 */
export async function deletecomment(
	sdk: FamilySearchSDK,
	did: string,
	cmid: string
): Promise<any> {
	try {
		const response = await sdk.delete<any>(`/platform/discussions/discussions/${did}/comments/${cmid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to deletecomment:", error);
		throw error;
	}
}

```

---

### deletememoryartifactcoverage

- **Title:** Delete Memory Artifact Coverage
- **Method:** DELETE
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/artifacts/{aid}/coverage`
- **Description:** Delete a memory artifact coverage.

**Path Parameters:**

- `mid` (string) - required
- `aid` (string) - required

**Response Codes:** 204

**Implementation Template:**

```typescript
/**
 * Delete Memory Artifact Coverage
 *
 * Delete a memory artifact coverage.
 *
 * @param mid - mid
 * @param aid - aid
 * @returns Promise with response data
 */
export async function deletememoryartifactcoverage(
	sdk: FamilySearchSDK,
	mid: string,
	aid: string
): Promise<any> {
	try {
		const response = await sdk.delete<any>(`/platform/memories/memories/${mid}/artifacts/${aid}/coverage`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to deletememoryartifactcoverage:", error);
		throw error;
	}
}

```

---

### deletememorycomment

- **Title:** Delete Memory Comment
- **Method:** DELETE
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/comments/{cmid}`
- **Description:** Delete a memory comment.

**Path Parameters:**

- `mid` (string) - required
- `cmid` (string) - required

**Response Codes:** 204, 404

**Implementation Template:**

```typescript
/**
 * Delete Memory Comment
 *
 * Delete a memory comment.
 *
 * @param mid - mid
 * @param cmid - cmid
 * @returns Promise with response data
 */
export async function deletememorycomment(
	sdk: FamilySearchSDK,
	mid: string,
	cmid: string
): Promise<any> {
	try {
		const response = await sdk.delete<any>(`/platform/memories/memories/${mid}/comments/${cmid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to deletememorycomment:", error);
		throw error;
	}
}

```

---

### deletememorypersona

- **Title:** Delete Memory Persona
- **Method:** DELETE
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/personas/{pid}`
- **Description:** Delete a memory persona.

**Path Parameters:**

- `mid` (string) - required
- `pid` (string) - required

**Response Codes:** 204, 301, 404, 410

**Implementation Template:**

```typescript
/**
 * Delete Memory Persona
 *
 * Delete a memory persona.
 *
 * @param mid - mid
 * @param pid - pid
 * @returns Promise with response data
 */
export async function deletememorypersona(
	sdk: FamilySearchSDK,
	mid: string,
	pid: string
): Promise<any> {
	try {
		const response = await sdk.delete<any>(`/platform/memories/memories/${mid}/personas/${pid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to deletememorypersona:", error);
		throw error;
	}
}

```

---

### deletetree

- **Title:** Delete Tree
- **Method:** DELETE
- **URL:** `https://apibeta.familysearch.org/platform/trees/{tid}`
- **Description:** Delete a Tree.

**Path Parameters:**

- `tid` (string) - required

**Response Codes:** 204, 404, 409, 429

**Implementation Template:**

```typescript
/**
 * Delete Tree
 *
 * Delete a Tree.
 *
 * @param tid - tid
 * @returns Promise with response data
 */
export async function deletetree(
	sdk: FamilySearchSDK,
	tid: string
): Promise<any> {
	try {
		const response = await sdk.delete<any>(`/platform/trees/${tid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to deletetree:", error);
		throw error;
	}
}

```

---

### deletetreepersonreference

- **Title:** Delete Tree Person Reference
- **Method:** DELETE
- **URL:** `https://apibeta.familysearch.org/platform/tree/persons/{pid}/tree-person-reference/{tprid}`
- **Description:** Deletes a specific tree person reference from a person.

**Path Parameters:**

- `pid` (string) - required
- `tprid` (string) - required

**Response Codes:** 200, 204, 301, 400, 404, 410, 429

**Implementation Template:**

```typescript
/**
 * Delete Tree Person Reference
 *
 * Deletes a specific tree person reference from a person.
 *
 * @param pid - pid
 * @param tprid - tprid
 * @returns Promise with response data
 */
export async function deletetreepersonreference(
	sdk: FamilySearchSDK,
	pid: string,
	tprid: string
): Promise<any> {
	try {
		const response = await sdk.delete<any>(`/platform/tree/persons/${pid}/tree-person-reference/${tprid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to deletetreepersonreference:", error);
		throw error;
	}
}

```

---

### findrelationship

- **Title:** Find Relationship
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/tree/persons/{pid}/relationships/{opid}`
- **Description:** The Relationship Finder resource is used to find how two persons in the tree are related.  For finding how the currently logged in
user is related to a person in the tree, pass in "CURRENT" for the first person Id. The later option requires an authenticated session.  To determine
which of the persons returned is the common ancestor the fs:displayProperties element will
contain a  "role" field that contains "commonAncestor" as a value.

**Path Parameters:**

- `pid` (string) - required
- `opid` (string) - required

**Response Codes:** 200, 204, 400

**Implementation Template:**

```typescript
/**
 * Find Relationship
 *
 * The Relationship Finder resource is used to find how two persons in the tree are related.  For finding how the currently logged in
user is related to a person in the tree, pass in "CURRENT" for the first person Id. The later option requires an authenticated session.  To determine
which of the persons returned is the common ancestor the fs:displayProperties element will
contain a  "role" field that contains "commonAncestor" as a value.
 *
 * @param pid - pid
 * @param opid - opid
 * @returns Promise with response data
 */
export async function findrelationship(
	sdk: FamilySearchSDK,
	pid: string,
	opid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/tree/persons/${pid}/relationships/${opid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to findrelationship:", error);
		throw error;
	}
}

```

---

### mergeperson

- **Title:** Merge Person
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/tree/persons/{pid}/merges/{dpid}`
- **Description:** This method performs a person merge as specified by a Person ID (survivor) and Duplicate Person ID along with the list of resources to be merged. All resources from the survivor person that need to be deleted must be specified. All resources that should be copied from the duplicate person to the survivor must be specified. If a resource is copied and a resource of the same type already exists on the survivor then that resource must be deleted from the survivor.

**Path Parameters:**

- `pid` (string) - required
- `dpid` (string) - required

**Response Codes:** 204, 404, 429

**Implementation Template:**

```typescript
/**
 * Merge Person
 *
 * This method performs a person merge as specified by a Person ID (survivor) and Duplicate Person ID along with the list of resources to be merged. All resources from the survivor person that need to be deleted must be specified. All resources that should be copied from the duplicate person to the survivor must be specified. If a resource is copied and a resource of the same type already exists on the survivor then that resource must be deleted from the survivor.
 *
 * @param pid - pid
 * @param dpid - dpid
 * @returns Promise with response data
 */
export async function mergeperson(
	sdk: FamilySearchSDK,
	pid: string,
	dpid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/tree/persons/${pid}/merges/${dpid}`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to mergeperson:", error);
		throw error;
	}
}

```

---

### performpersonmatchesbyexample

- **Title:** Read Person Matches by Example
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/tree/matches`
- **Description:** The Person Matches by Example resource returns a list of possible FamilySearch tree persons that match a person described by a GEDCOM X document
containing person details (POST). This resource is particularly useful for matching a person in an external tree to a person in the FamilySearch tree. The
Match by Tree Person Id resource should be used to find matches (possible duplicates) for a specific person already in the FamilySearch tree.

**Response Codes:** 200, 204, 400, 414, 429

**Implementation Template:**

```typescript
/**
 * Read Person Matches by Example
 *
 * The Person Matches by Example resource returns a list of possible FamilySearch tree persons that match a person described by a GEDCOM X document
containing person details (POST). This resource is particularly useful for matching a person in an external tree to a person in the FamilySearch tree. The
Match by Tree Person Id resource should be used to find matches (possible duplicates) for a specific person already in the FamilySearch tree.
 *
 * @returns Promise with response data
 */
export async function performpersonmatchesbyexample(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/tree/matches`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to performpersonmatchesbyexample:", error);
		throw error;
	}
}

```

---

### readpendingmodifications

- **Title:** Read Pending Modifications
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/pending-modifications`
- **Description:** The Pending Modifications resource describes the set of pending modifications that have been defined for the FamilySearch API, including the name of the modification, a description of the modification, whether the modification is enabled for the current request, and when the modification will be activated.

**Response Codes:** 200

**Implementation Template:**

```typescript
/**
 * Read Pending Modifications
 *
 * The Pending Modifications resource describes the set of pending modifications that have been defined for the FamilySearch API, including the name of the modification, a description of the modification, whether the modification is enabled for the current request, and when the modification will be activated.
 *
 * @returns Promise with response data
 */
export async function getpendingmodifications(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/pending-modifications`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getpendingmodifications:", error);
		throw error;
	}
}

```

---

### readplaceattributes

- **Title:** Read Place Description Attributes
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/places/description/{pdid}/attributes`
- **Description:** Read attributes of a place description.

**Path Parameters:**

- `pdid` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Place Description Attributes
 *
 * Read attributes of a place description.
 *
 * @param pdid - pdid
 * @returns Promise with response data
 */
export async function getplaceattributes(
	sdk: FamilySearchSDK,
	pdid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/places/description/${pdid}/attributes`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getplaceattributes:", error);
		throw error;
	}
}

```

---

### readplacedescriptionsgroup

- **Title:** Read Place Descriptions Group
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/places/groups/{pgid}`
- **Description:** Read a place descriptions group. A place descriptions group is an arbitrary grouping of place descriptions or other groups. Partners can use this resource to group place descriptions that are related, such as countries in North America. It doesn't impact the jurisdiction of the contained places. You can group place descriptions into one named resource without changing the jurisdiction of those contained places.

**Path Parameters:**

- `pgid` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Place Descriptions Group
 *
 * Read a place descriptions group. A place descriptions group is an arbitrary grouping of place descriptions or other groups. Partners can use this resource to group place descriptions that are related, such as countries in North America. It doesn't impact the jurisdiction of the contained places. You can group place descriptions into one named resource without changing the jurisdiction of those contained places.
 *
 * @param pgid - pgid
 * @returns Promise with response data
 */
export async function getplacedescriptionsgroup(
	sdk: FamilySearchSDK,
	pgid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/places/groups/${pgid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getplacedescriptionsgroup:", error);
		throw error;
	}
}

```

---

### readplacedescriptionwithrelated

- **Title:** Read Place Description With Related
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/places/description/{pdid}/related`
- **Description:** Read a place description with its related place descriptions. This resource is a representation of the place in a given time period, within a specific jurisdiction, with a specific official name. Place Descriptions have a unique, numeric identifier. The identifiers for the Place Description resource are in a different namespace than the identifier for the Place resource. For example, Place identifier 123 is not the same as Place Description 123. These unique identifiers can be used to associate places with their own data, providing a powerful way to link data together.

**Path Parameters:**

- `pdid` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Place Description With Related
 *
 * Read a place description with its related place descriptions. This resource is a representation of the place in a given time period, within a specific jurisdiction, with a specific official name. Place Descriptions have a unique, numeric identifier. The identifiers for the Place Description resource are in a different namespace than the identifier for the Place resource. For example, Place identifier 123 is not the same as Place Description 123. These unique identifiers can be used to associate places with their own data, providing a powerful way to link data together.
 *
 * @param pdid - pdid
 * @returns Promise with response data
 */
export async function getplacedescriptionwithrelated(
	sdk: FamilySearchSDK,
	pdid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/places/description/${pdid}/related`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getplacedescriptionwithrelated:", error);
		throw error;
	}
}

```

---

### readresearchtreepersons

- **Title:** Read CET Tree Person Ids
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/trees/{tid}/persons`
- **Description:** This operation retrieves the list of person ids in a CET. The list is returned as a Feed of Entry elements. Each Entry contains a person id in the id field.

**Path Parameters:**

- `tid` (string) - required

**Response Codes:** 200, 204, 400, 429

**Implementation Template:**

```typescript
/**
 * Read CET Tree Person Ids
 *
 * This operation retrieves the list of person ids in a CET. The list is returned as a Feed of Entry elements. Each Entry contains a person id in the id field.
 *
 * @param tid - tid
 * @returns Promise with response data
 */
export async function getresearchtreepersons(
	sdk: FamilySearchSDK,
	tid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/trees/${tid}/persons`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getresearchtreepersons:", error);
		throw error;
	}
}

```

---

### readsourcereferences

- **Title:** Read Source References
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/tree/source-references`
- **Description:** The Source References Query returns a collection of persons and relationships that reference a specific source description or a specific source, depending on which parameter is used. To see a list of all persons and relationships attached to a source such as a census record, use the source parameter. To see a list of all persons and relationships attached to a source description, use the description parameter.

**Response Codes:** 200, 204, 404, 429

**Implementation Template:**

```typescript
/**
 * Read Source References
 *
 * The Source References Query returns a collection of persons and relationships that reference a specific source description or a specific source, depending on which parameter is used. To see a list of all persons and relationships attached to a source such as a census record, use the source parameter. To see a list of all persons and relationships attached to a source description, use the description parameter.
 *
 * @returns Promise with response data
 */
export async function getsourcereferences(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/tree/source-references`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getsourcereferences:", error);
		throw error;
	}
}

```

---

### readtreechanges

- **Title:** Read Tree Changes
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/trees/{tid}/changes`
- **Description:** This operation retrieves the list of changes in a CET. The list is returned as a Feed of Entry elements. Each Entry contains a ChangeInfo element.

**Path Parameters:**

- `tid` (string) - required

**Response Codes:** 200, 204, 429

**Implementation Template:**

```typescript
/**
 * Read Tree Changes
 *
 * This operation retrieves the list of changes in a CET. The list is returned as a Feed of Entry elements. Each Entry contains a ChangeInfo element.
 *
 * @param tid - tid
 * @returns Promise with response data
 */
export async function gettreechanges(
	sdk: FamilySearchSDK,
	tid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/trees/${tid}/changes`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to gettreechanges:", error);
		throw error;
	}
}

```

---

### readtreematches

- **Title:** Read Tree Matches
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/trees/{tid}/matches`
- **Description:** Returns the matches for a CET. Allows filtering on the request to focus on the “best” historical record hints, person hints to other CETs or to the Shared Family Tree.

**Path Parameters:**

- `tid` (string) - required

**Response Codes:** 200, 204, 400, 429

**Implementation Template:**

```typescript
/**
 * Read Tree Matches
 *
 * Returns the matches for a CET. Allows filtering on the request to focus on the “best” historical record hints, person hints to other CETs or to the Shared Family Tree.
 *
 * @param tid - tid
 * @returns Promise with response data
 */
export async function gettreematches(
	sdk: FamilySearchSDK,
	tid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/trees/${tid}/matches`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to gettreematches:", error);
		throw error;
	}
}

```

---

### readtreepersonmatches

- **Title:** Read Person Matches by ID
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/tree/persons/{pid}/matches`
- **Description:** The Match by Tree Person Id endpoint defines the set of matches in the system for a person in the Family Tree.

**Path Parameters:**

- `pid` (string) - required

**Response Codes:** 200, 204, 301, 404, 410, 429

**Implementation Template:**

```typescript
/**
 * Read Person Matches by ID
 *
 * The Match by Tree Person Id endpoint defines the set of matches in the system for a person in the Family Tree.
 *
 * @param pid - pid
 * @returns Promise with response data
 */
export async function gettreepersonmatches(
	sdk: FamilySearchSDK,
	pid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/tree/persons/${pid}/matches`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to gettreepersonmatches:", error);
		throw error;
	}
}

```

---

### readuserdefinedcollectionsourcedescriptions

- **Title:** Read User Defined Collection Descriptions
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/sources/collections/{udcid}/descriptions`
- **Description:** Read the source descriptions in a user-defined collection.

**Path Parameters:**

- `udcid` (string) - required

**Response Codes:** 200, 204, 400, 404

**Implementation Template:**

```typescript
/**
 * Read User Defined Collection Descriptions
 *
 * Read the source descriptions in a user-defined collection.
 *
 * @param udcid - udcid
 * @returns Promise with response data
 */
export async function getuserdefinedcollectionsourcedescriptions(
	sdk: FamilySearchSDK,
	udcid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/sources/collections/${udcid}/descriptions`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getuserdefinedcollectionsourcedescriptions:", error);
		throw error;
	}
}

```

---

### readusersourcedescriptions

- **Title:** Read User Source Descriptions
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/sources/{uid}/collections/descriptions`
- **Description:** Read a list of all source descriptions in all user-defined collections owned by a specific user.

**Path Parameters:**

- `uid` (string) - required

**Response Codes:** 200, 301, 307, 400, 404

**Implementation Template:**

```typescript
/**
 * Read User Source Descriptions
 *
 * Read a list of all source descriptions in all user-defined collections owned by a specific user.
 *
 * @param uid - uid
 * @returns Promise with response data
 */
export async function getusersourcedescriptions(
	sdk: FamilySearchSDK,
	uid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/sources/${uid}/collections/descriptions`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getusersourcedescriptions:", error);
		throw error;
	}
}

```

---

### readvocabconceptdefinition

- **Title:** Read Vocabulary Concept Definition
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/vocab/concepts/{cvcid}/definition/{locale}`
- **Description:** Retrieve controlled vocabulary concept definition based on the specified concept id.

**Path Parameters:**

- `cvcid` (string) - required
- `locale` (string) - required

**Response Codes:** 200, 204

**Implementation Template:**

```typescript
/**
 * Read Vocabulary Concept Definition
 *
 * Retrieve controlled vocabulary concept definition based on the specified concept id.
 *
 * @param cvcid - cvcid
 * @param locale - locale
 * @returns Promise with response data
 */
export async function getvocabconceptdefinition(
	sdk: FamilySearchSDK,
	cvcid: string,
	locale: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/vocab/concepts/${cvcid}/definition/${locale}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getvocabconceptdefinition:", error);
		throw error;
	}
}

```

---

### readvocabconceptssearch

- **Title:** Search Controlled Vocabulary Terms
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/vocab/concepts/search`
- **Description:** The Controlled Vocabulary Concepts Search resource defines the set Controlled Vocabulary terms associated with a list of Controlled Vocabulary Concepts that match a set of search criteria.

**Response Codes:** 200, 204

**Implementation Template:**

```typescript
/**
 * Search Controlled Vocabulary Terms
 *
 * The Controlled Vocabulary Concepts Search resource defines the set Controlled Vocabulary terms associated with a list of Controlled Vocabulary Concepts that match a set of search criteria.
 *
 * @returns Promise with response data
 */
export async function getvocabconceptssearch(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/vocab/concepts/search`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getvocabconceptssearch:", error);
		throw error;
	}
}

```

---

### readvocabconceptv2

- **Title:** Read Vocabulary Concept V2
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/vocab/concepts/{cvcid}`
- **Description:** Read a vocabulary concept V2. The Controlled Vocabulary Concept resource defines the set of Controlled Vocabulary terms associated with a Controlled Vocabulary Concepts along with the concept's definition and attributes, specified by a concept id.

**Path Parameters:**

- `cvcid` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Vocabulary Concept V2
 *
 * Read a vocabulary concept V2. The Controlled Vocabulary Concept resource defines the set of Controlled Vocabulary terms associated with a Controlled Vocabulary Concepts along with the concept's definition and attributes, specified by a concept id.
 *
 * @param cvcid - cvcid
 * @returns Promise with response data
 */
export async function getvocabconceptv2(
	sdk: FamilySearchSDK,
	cvcid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/vocab/concepts/${cvcid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getvocabconceptv2:", error);
		throw error;
	}
}

```

---

### readvocablist

- **Title:** Read Controlled Vocabulary List
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/vocab/lists/{cvlid}`
- **Description:** Read a controlled vocabulary list.

**Path Parameters:**

- `cvlid` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Controlled Vocabulary List
 *
 * Read a controlled vocabulary list.
 *
 * @param cvlid - cvlid
 * @returns Promise with response data
 */
export async function getvocablist(
	sdk: FamilySearchSDK,
	cvlid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/vocab/lists/${cvlid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getvocablist:", error);
		throw error;
	}
}

```

---

### readvocabterm

- **Title:** Read Controlled Vocabulary Term
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/vocab/terms/{cvtid}`
- **Description:** Read a controlled vocabulary term.

**Path Parameters:**

- `cvtid` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Controlled Vocabulary Term
 *
 * Read a controlled vocabulary term.
 *
 * @param cvtid - cvtid
 * @returns Promise with response data
 */
export async function getvocabterm(
	sdk: FamilySearchSDK,
	cvtid: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/vocab/terms/${cvtid}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getvocabterm:", error);
		throw error;
	}
}

```

---

### readvocabtermtranslation

- **Title:** Read Controlled Vocabulary Term Translation
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/vocab/terms/{cvtid}/translations/{locale}`
- **Description:** Read a controlled vocabulary term translation.  The vocabulary term may be localized into many languages, but the term remains the same. Only one translation allowed per language.

**Path Parameters:**

- `cvtid` (string) - required
- `locale` (string) - required

**Response Codes:** 200, 404

**Implementation Template:**

```typescript
/**
 * Read Controlled Vocabulary Term Translation
 *
 * Read a controlled vocabulary term translation.  The vocabulary term may be localized into many languages, but the term remains the same. Only one translation allowed per language.
 *
 * @param cvtid - cvtid
 * @param locale - locale
 * @returns Promise with response data
 */
export async function getvocabtermtranslation(
	sdk: FamilySearchSDK,
	cvtid: string,
	locale: string
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/vocab/terms/${cvtid}/translations/${locale}`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to getvocabtermtranslation:", error);
		throw error;
	}
}

```

---

### searchtreepersons

- **Title:** Search Tree Persons
- **Method:** GET
- **URL:** `https://apibeta.familysearch.org/platform/tree/search`
- **Description:** This operation enables you to search tree persons using a variety of query parameters such as name, event dates and places, sex, and more. This operation returns person summaries that match the search criteria.

**Response Codes:** 200, 204, 400, 429

**Implementation Template:**

```typescript
/**
 * Search Tree Persons
 *
 * This operation enables you to search tree persons using a variety of query parameters such as name, event dates and places, sex, and more. This operation returns person summaries that match the search criteria.
 *
 * @returns Promise with response data
 */
export async function searchtreepersons(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.get<any>(`/platform/tree/search`);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to searchtreepersons:", error);
		throw error;
	}
}

```

---

### setcurrenttree

- **Title:** Set Current Tree Id
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/trees/current`
- **Description:** Set the id of the current tree.

**Response Codes:** 204, 429

**Implementation Template:**

```typescript
/**
 * Set Current Tree Id
 *
 * Set the id of the current tree.
 *
 * @returns Promise with response data
 */
export async function setcurrenttree(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/trees/current`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to setcurrenttree:", error);
		throw error;
	}
}

```

---

### updatechildandparentsrelationshipparentsorder

- **Title:** Set Parent Order
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/tree/child-and-parents-relationships/{caprid}/parents/order`
- **Description:** Set the ordering of parent1 and parent2 in a child and parents relationship.

**Path Parameters:**

- `caprid` (string) - required

**Response Codes:** 204, 400, 403, 404, 410

**Implementation Template:**

```typescript
/**
 * Set Parent Order
 *
 * Set the ordering of parent1 and parent2 in a child and parents relationship.
 *
 * @param caprid - caprid
 * @returns Promise with response data
 */
export async function updatechildandparentsrelationshipparentsorder(
	sdk: FamilySearchSDK,
	caprid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/tree/child-and-parents-relationships/${caprid}/parents/order`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatechildandparentsrelationshipparentsorder:", error);
		throw error;
	}
}

```

---

### updatecomments

- **Title:** Update Comments
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/discussions/discussions/{did}/comments`
- **Description:** Add comment(s) to a discussion, or update existing comment(s). Comments to be updated are distinguished from comments to be added to the discussion by the presence of an id on the comment.

**Path Parameters:**

- `did` (string) - required

**Response Codes:** 201, 204, 404

**Implementation Template:**

```typescript
/**
 * Update Comments
 *
 * Add comment(s) to a discussion, or update existing comment(s). Comments to be updated are distinguished from comments to be added to the discussion by the presence of an id on the comment.
 *
 * @param did - did
 * @returns Promise with response data
 */
export async function updatecomments(
	sdk: FamilySearchSDK,
	did: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/discussions/discussions/${did}/comments`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatecomments:", error);
		throw error;
	}
}

```

---

### updatecouplerelationshipspousesorder

- **Title:** Set Couple Relationship Spouses Order
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/tree/couple-relationships/{crid}/spouses/order`
- **Description:** Set the ordering of spouse1 and spouse2 in a relationship.

**Path Parameters:**

- `crid` (string) - required

**Response Codes:** 204, 400, 403, 404, 410

**Implementation Template:**

```typescript
/**
 * Set Couple Relationship Spouses Order
 *
 * Set the ordering of spouse1 and spouse2 in a relationship.
 *
 * @param crid - crid
 * @returns Promise with response data
 */
export async function updatecouplerelationshipspousesorder(
	sdk: FamilySearchSDK,
	crid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/tree/couple-relationships/${crid}/spouses/order`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatecouplerelationshipspousesorder:", error);
		throw error;
	}
}

```

---

### updatematchresolution

- **Title:** Update Match Resolution
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/tree/persons/{pid}/matches`
- **Description:** Certification Required

**Path Parameters:**

- `pid` (string) - required

**Response Codes:** 204, 301, 404, 410, 429

**Implementation Template:**

```typescript
/**
 * Update Match Resolution
 *
 * Certification Required
 *
 * @param pid - pid
 * @returns Promise with response data
 */
export async function updatematchresolution(
	sdk: FamilySearchSDK,
	pid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/tree/persons/${pid}/matches`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatematchresolution:", error);
		throw error;
	}
}

```

---

### updatememoryartifact

- **Title:** Update Memory Artifact
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/artifacts/{aid}`
- **Description:** Update a memory artifact. Currently, only story text can be updated.

**Path Parameters:**

- `mid` (string) - required
- `aid` (string) - required

**Response Codes:** 204

**Implementation Template:**

```typescript
/**
 * Update Memory Artifact
 *
 * Update a memory artifact. Currently, only story text can be updated.
 *
 * @param mid - mid
 * @param aid - aid
 * @returns Promise with response data
 */
export async function updatememoryartifact(
	sdk: FamilySearchSDK,
	mid: string,
	aid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/memories/memories/${mid}/artifacts/${aid}`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatememoryartifact:", error);
		throw error;
	}
}

```

---

### updatememorypersona

- **Title:** Update Memory Persona
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/memories/memories/{mid}/personas/{pid}`
- **Description:** Update a memory persona.

**Path Parameters:**

- `mid` (string) - required
- `pid` (string) - required

**Response Codes:** 204, 301, 404, 410

**Implementation Template:**

```typescript
/**
 * Update Memory Persona
 *
 * Update a memory persona.
 *
 * @param mid - mid
 * @param pid - pid
 * @returns Promise with response data
 */
export async function updatememorypersona(
	sdk: FamilySearchSDK,
	mid: string,
	pid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/memories/memories/${mid}/personas/${pid}`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatememorypersona:", error);
		throw error;
	}
}

```

---

### updatepartneraccount

- **Title:** Update Partner Account
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/users/current/partner-account-created`
- **Description:** Update a partner account

**Response Codes:** 204

**Implementation Template:**

```typescript
/**
 * Update Partner Account
 *
 * Update a partner account
 *
 * @returns Promise with response data
 */
export async function updatepartneraccount(
	sdk: FamilySearchSDK
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/users/current/partner-account-created`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatepartneraccount:", error);
		throw error;
	}
}

```

---

### updatetree

- **Title:** Update Tree
- **Method:** POST
- **URL:** `https://apibeta.familysearch.org/platform/trees/{tid}`
- **Description:** This post allows only one tree to be updated at a time.  The treeId in the URL must match the id of the tree in the request body. You can  modify the startingPersonId, hidden, private, name, description, ownerAccess and groupAccess fields using this POST operation. Passing an empty  string for an attribute will remove the value for that attribute. Hidden can only be set to false.

**Path Parameters:**

- `tid` (string) - required

**Response Codes:** 204, 404, 410, 429

**Implementation Template:**

```typescript
/**
 * Update Tree
 *
 * This post allows only one tree to be updated at a time.  The treeId in the URL must match the id of the tree in the request body. You can  modify the startingPersonId, hidden, private, name, description, ownerAccess and groupAccess fields using this POST operation. Passing an empty  string for an attribute will remove the value for that attribute. Hidden can only be set to false.
 *
 * @param tid - tid
 * @returns Promise with response data
 */
export async function updatetree(
	sdk: FamilySearchSDK,
	tid: string
): Promise<any> {
	try {
		const response = await sdk.post<any>(`/platform/trees/${tid}`, data);
		return response.data;
	} catch (error) {
		sdk["logger"].error("[FamilySearch SDK] Failed to updatetree:", error);
		throw error;
	}
}

```

---

## 🚫 Not Applicable (12)

- **api-reference-guide** - Documentation page
- **getauthorizationpage** - OAuth redirect page
- **headchildandparentrelationshiphistory** - HEAD request (metadata only)
- **headperson** - HEAD request (metadata only)
- **headpersonchangehistory** - HEAD request (metadata only)
- **json-schema** - Documentation page
- **readchildandparentsrelationshipheaders** - HEAD request (metadata only)
- **readcouplerelationshipchangehistoryheaders** - HEAD request (metadata only)
- **readcouplerelationshipheaders** - HEAD request (metadata only)
- **readdiscussionheaders** - HEAD request (metadata only)
- **readsourcedescriptionhead** - HEAD request (metadata only)
- **readtreepersonmatchesheaders** - HEAD request (metadata only)

