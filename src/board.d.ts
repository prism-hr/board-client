// Generated using typescript-generator version 1.17.284 on 2017-03-27 10:33:28.

declare namespace b {

  interface BoardDTO {
    id?: number;
    name?: string;
    purpose?: string;
    department?: DepartmentDTO;
    settings?: BoardSettingsDTO;
  }

  interface BoardSettingsDTO {
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
    id?: number;
    name?: string;
    description?: string;
    organizationName?: string;
    location?: LocationDTO;
    existingRelation?: string;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentDTO;
    applyEmail?: string;
  }

  interface BoardRepresentation {
    id?: number;
    name?: string;
    purpose?: string;
    handle?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
    defaultPostVisibility?: PostVisibility;
    roles?: Role[];
  }

  interface DepartmentRepresentation {
    id?: number;
    name?: string;
    documentLogo?: DocumentRepresentation;
    handle?: string;
    boards?: BoardRepresentation[];
    memberCategories?: string[];
    roles?: Role[];
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

  interface PostRepresentation {
    id?: number;
    name?: string;
    description?: string;
    organizationName?: string;
    location?: LocationRepresentation;
    existingRelation?: string;
    postCategories?: string[];
    memberCategories?: string[];
    applyWebsite?: string;
    applyDocument?: DocumentRepresentation;
    applyEmail?: string;
    board?: BoardRepresentation;
    roles?: Role[];
  }

  const enum PostVisibility {
    PUBLIC,
    PRIVATE,
    PART_PRIVATE,
  }

  const enum Role {
    ADMINISTRATOR,
    CONTRIBUTOR,
  }

}
