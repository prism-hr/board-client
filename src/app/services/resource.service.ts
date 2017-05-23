import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {URLSearchParams} from '@angular/http';
import {JwtHttp} from 'ng2-ui-auth';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import Scope = b.Scope;
import UserRepresentation = b.UserRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import BoardDTO = b.BoardDTO;
import ResourceUserBulkDTO = b.ResourceUserBulkDTO;

@Injectable()
export class ResourceService {

  constructor(private http: JwtHttp) {
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

  getResourceUsers(scope: string, id: number): Observable<ResourceUserRepresentation[]> {
    return this.http.get('/api/' + scope + 's' + '/' + id + '/users').map(res => res.json());
  }

  getBoardPosts(boardId: number): Observable<PostRepresentation[]> {
    return this.http.get('/api/boards/' + boardId + '/posts').map(res => res.json());
  }

  postBoard(board: BoardDTO) {
    return this.http.post('/api/boards', board).map(res => res.json());
  }

  patchBoard(id: number, board: BoardPatchDTO): Observable<BoardRepresentation> {
    return this.http.patch('/api/boards/' + id, board).map(res => res.json());
  }

  patchDepartment(id: number, department: DepartmentPatchDTO): Observable<DepartmentRepresentation> {
    return this.http.patch('/api/departments/' + id, department).map(res => res.json());
  }

  addUserRole(resource: ResourceRepresentation, user: UserRepresentation, role: string) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.put('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id + '/roles/' + role, {});
  }

  removeUserRole(resource: ResourceRepresentation, user: UserRepresentation, role: string) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.delete('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id + '/roles/' + role, {});
  }

  addUser(resource: ResourceRepresentation, user: ResourceUserDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users', user).map(res => res.json());
  }

  addUsersInBulk(resource: ResourceRepresentation, usersBulk: ResourceUserBulkDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users/bulk', usersBulk);
  }

  removeUser(resource: ResourceRepresentation, user: UserRepresentation) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.delete('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id);
  }

  canEdit(resource: ResourceRepresentation) {
    return !!resource.actions.find(a => a.action as any === 'EDIT');
  }

  canAudit(resource: ResourceRepresentation) {
    return !!resource.actions.find(a => a.action as any === 'AUDIT');
  }

}
