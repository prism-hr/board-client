import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, URLSearchParams} from '@angular/http';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Injectable()
export class ResourceService {

  constructor(protected http: Http) {
  }

  getPosts(): Observable<PostRepresentation[]> {
    return this.http.get('/api/posts').map(res => res.json());
  }

  getBoards(): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards').map(res => res.json());
  }

  getDepartments(): Observable<DepartmentRepresentation[]> {
    return this.http.get('/api/departments').map(res => res.json());
  }

  getPost(id: number): Observable<PostRepresentation[]> {
    return this.http.get('/api/posts/' + id).map(res => res.json());
  }

  getBoard(departmentHandle: string, boardHandle: string): Observable<BoardRepresentation[]> {
    const params = new URLSearchParams();
    params.set('handle', departmentHandle + '/' + boardHandle);
    return this.http.get('/api/boards', {search: params}).map(res => res.json());
  }

  getDepartment(handle: string): Observable<DepartmentRepresentation[]> {
    const params = new URLSearchParams();
    params.set('handle', handle);
    return this.http.get('/api/departments', {search: params}).map(res => res.json());
  }

  patchBoard(id: number, board: BoardPatchDTO): Observable<BoardRepresentation> {
    return this.http.patch('/api/boards/' + id, board).map(res => res.json());
  }

  patchDepartment(id: number, department: DepartmentPatchDTO): Observable<DepartmentRepresentation> {
    return this.http.patch('/api/departments/' + id, department).map(res => res.json());
  }

  canEdit(resource: ResourceRepresentation) {
    return !!resource.actions.find(a => a.action as any === 'EDIT');
  }

  canAudit(resource: ResourceRepresentation) {
    return !!resource.actions.find(a => a.action as any === 'AUDIT');
  }

}
