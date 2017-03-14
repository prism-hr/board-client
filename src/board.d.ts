// Generated using typescript-generator version 1.17.284 on 2017-03-13 18:35:27.

declare namespace b {

  interface BoardDTO {
    id?: number;
    name?: string;
    purpose?: string;
    department?: DepartmentDTO;
    settings?: BoardSettingsDTO;
  }

  interface BoardSettingsDTO {
    postCategories?: string[];
  }

  interface DepartmentDTO {
    id?: number;
    name?: string;
    documentLogo?: DocumentDTO;
    memberCategories?: string[];
  }

  interface DocumentDTO {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

  interface BoardRepresentation {
    id?: number;
    name?: string;
    purpose?: string;
    department?: DepartmentRepresentation;
    postCategories?: string[];
  }

  interface DepartmentRepresentation {
    id?: number;
    name?: string;
    documentLogo?: DocumentRepresentation;
    boards?: BoardRepresentation[];
    memberCategories?: string[];
  }

  interface DocumentRepresentation {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

}
