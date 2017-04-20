// Generated using typescript-generator version 1.23.311 on 2017-04-19 15:51:41.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface BoardDTO {
    name?: string;
    purpose?: string;
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
    memberCategories?: string[];
  }

  interface DepartmentPatchDTO {
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

  interface PostPatchDTO {
    name?: string;
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
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
    scope?: Scope;
    name?: string;
    state?: State;
    actions?: ResourceAction[];
  }

  interface ResourceAction extends Comparable<ResourceAction> {
    action?: Action;
    scope?: Scope;
    state?: State;
  }

  interface Comparable<T> {
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
    PENDING,
    SUSPENDED,
    ACCEPTED,
    EXPIRED,
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
