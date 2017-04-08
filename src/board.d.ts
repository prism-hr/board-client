// Generated using typescript-generator version 1.17.284 on 2017-04-07 13:31:21.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface BoardDTO {
    name?: string;
    purpose?: string;
    handle?: string;
    postCategories?: string[];
    department?: DepartmentDTO;
  }

  interface BoardPatchDTO {
    name?: string;
    purpose?: string;
    handle?: string;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentDTO {
    id?: number;
    name?: string;
    documentLogo?: DocumentDTO;
    handle?: string;
    memberCategories?: string[];
  }

  interface DocumentDTO {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

  interface LocationDTO {
    name?: string;
    domicile?: string;
    googleId?: string;
    latitude?: number;
    longitude?: number;
  }

  interface PostDTO {
    name?: string;
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: RelationWithDepartment;
    existingRelationExplanation?: string;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
  }

  interface ResourceFilterDTO {
    scope?: Scope;
    id?: number;
    handle?: string;
    parentId?: number;
    orderStatement?: string;
  }

  interface BoardRepresentation extends ResourceRepresentation {
    purpose?: string;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentRepresentation extends ResourceRepresentation {
    documentLogo?: DocumentRepresentation;
    handle?: string;
    boards?: BoardRepresentation[];
    memberCategories?: string[];
  }

  interface DocumentRepresentation {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

  interface LocationRepresentation {
    name?: string;
    domicile?: string;
    googleId?: string;
    latitude?: number;
    longitude?: number;
  }

  interface PostRepresentation extends ResourceRepresentation {
    description?: string;
    organizationName?: string;
    location?: LocationRepresentation;
    existingRelation?: RelationWithDepartment;
    existingRelationExplanation?: string;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentRepresentation;
    applyEmail?: string;
    board?: BoardRepresentation;
  }

  interface ResourceRepresentation {
    id?: number;
    name?: string;
    state?: State;
    actions?: Action[];
  }

  const enum Action {
    VIEW,
    EDIT,
    EXTEND,
    ACCEPT,
    SUSPEND,
    CORRECT,
    REJECT,
    RESTORE,
    WITHDRAW,
  }

  const enum State {
    DRAFT,
    SUSPENDED,
    ACCEPTED,
    REJECTED,
    WITHDRAWN,
    PREVIOUS,
  }

  const enum PostVisibility {
    PUBLIC,
    PRIVATE,
    PART_PRIVATE,
  }

  const enum RelationWithDepartment {
    FRIENDS,
    FAMILY,
    AFFAIR,
    COINCIDENCE,
  }

  const enum Scope {
    DEPARTMENT,
    BOARD,
    POST,
  }

}
