import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import {Observable} from 'rxjs/Observable';

export class FakeResourceService {

  getBoards(): Observable<BoardRepresentation[]> {
    return undefined;
  }

  getDepartments(): Observable<DepartmentRepresentation[]> {
    return undefined;
  }

  patchDepartment(id: number, department: b.DepartmentPatchDTO): Observable<DepartmentRepresentation> {
    return Observable.of({});
  }

}
