// Generated using typescript-generator version 1.17.284 on 2017-04-06 13:37:21.

declare namespace b {

  interface ActionDTO {
    action?: Action;
    nextState?: State;
  }

  interface BoardDTO extends ResourceDTO<BoardDTO> {
    purpose?: string;
    department?: DepartmentDTO;
    settings?: BoardSettingsDTO;
  }

  interface BoardSettingsDTO {
    handle?: string;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentDTO extends ResourceDTO<DepartmentDTO> {
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

  interface PostDTO extends ResourceDTO<PostDTO> {
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: RelationWithDepartment;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
  }

  interface ResourceDTO<R> {
    id?: number;
    name?: string;
  }

  interface AbstractResourceRepresentation {
    id?: number;
    name?: string;
    state?: State;
    roles?: Role[];
    actions?: Action[];
  }

  interface BoardRepresentation extends AbstractResourceRepresentation {
    purpose?: string;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
  }

  interface DepartmentRepresentation extends AbstractResourceRepresentation {
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

  interface PostRepresentation extends AbstractResourceRepresentation {
    description?: string;
    organizationName?: string;
    location?: LocationRepresentation;
    existingRelation?: RelationWithDepartment;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentRepresentation;
    applyEmail?: string;
    board?: BoardRepresentation;
  }

  const enum Action {
    VIEW,
    EDIT,
    POST_TO,
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

  const enum Role {
    ADMINISTRATOR,
    CONTRIBUTOR,
    PUBLIC,
  }

}
