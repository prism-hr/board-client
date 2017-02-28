// Generated using typescript-generator version 1.17.284 on 2017-02-28 21:31:30.

declare namespace b {

  interface DepartmentBoardDTO {
    department?: DepartmentDTO;
    board?: BoardDTO;
  }

  interface BoardRepresentation {
    id?: number;
    name?: string;
    purpose?: string;
    department?: DepartmentRepresentation;
  }

  interface DepartmentDTO {
    id?: number;
    name?: string;
    documentLogo?: DocumentDTO;
  }

  interface BoardDTO {
    id?: number;
    name?: string;
    purpose?: string;
  }

  interface DepartmentRepresentation {
    id?: number;
    name?: string;
    documentLogo?: DocumentRepresentation;
  }

  interface DocumentDTO {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

  interface DocumentRepresentation {
    cloudinaryId?: string;
    cloudinaryUrl?: string;
    fileName?: string;
  }

}
