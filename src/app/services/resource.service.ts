import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import DepartmentPatchDTO = b.DepartmentPatchDTO;

@Injectable()
export class ResourceService {

  constructor(protected http: Http) {
  }

  getBoards(): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards').map(res => res.json());
  }

  getDepartments(): Observable<DepartmentRepresentation[]> {
    return this.http.get('/api/departments').map(res => res.json());
  }

  patchDepartment(id: number, department: DepartmentPatchDTO): Observable<DepartmentRepresentation> {
    return this.http.patch('/api/departments/' + id, department).map(res => res.json());
  }

}
