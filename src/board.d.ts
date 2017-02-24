// Generated using typescript-generator version 1.17.284 on 2017-02-24 14:59:54.

declare namespace b {

    interface BoardWithDepartmentDTO {
        department?: DepartmentDTO;
        board?: BoardDTO;
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

    interface DocumentDTO {
        cloudinaryId?: string;
        cloudinaryUrl?: string;
        fileName?: string;
    }

}
