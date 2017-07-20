import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import * as _ from 'lodash';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import Action = b.Action;
import BoardDTO = b.BoardDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentDTO = b.DepartmentDTO;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PostRepresentation = b.PostRepresentation;
import ResourcePatchDTO = b.ResourcePatchDTO;
import ResourceRepresentation = b.ResourceRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import ResourceUsersDTO = b.ResourceUsersDTO;
import UserRepresentation = b.UserRepresentation;

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

  getDepartments(query?: string): Observable<DepartmentRepresentation[]> {
    return this.http.get('/api/departments' + (query ? '?query=' + query : '')).map(res => res.json());
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

  postDepartment(department: DepartmentDTO) {
    return this.http.post('/api/departments', department).map(res => res.json());
  }

  patchDepartment(id: number, department: DepartmentPatchDTO): Observable<DepartmentRepresentation> {
    return this.http.patch('/api/departments/' + id, department).map(res => res.json());
  }

  executeAction(resource: ResourceRepresentation, action: Action, resourcePatch: ResourcePatchDTO): Observable<ResourceRepresentation> {
    return this.http.post('/api/' + resource.scope.toLowerCase() + 's/' + resource.id + '/actions/' + action.toLowerCase(), resourcePatch)
      .map(res => res.json());
  }

  updateResourceUser(resource: ResourceRepresentation, user: UserRepresentation, resourceUserDTO: ResourceUserDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.put('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id, resourceUserDTO).map(res => res.json());
  }

  addUser(resource: ResourceRepresentation, user: ResourceUserDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users', user).map(res => res.json());
  }

  addUsersInBulk(resource: ResourceRepresentation, usersBulk: ResourceUsersDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users/bulk', usersBulk);
  }

  lookupUsers(resource: ResourceRepresentation, query: string): Observable<UserRepresentation[]> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get('/api/' + resourceCol + '/' + resource.id + '/lookupUsers?query=' + query).map(res => res.json());
  }

  removeUser(resource: ResourceRepresentation, user: UserRepresentation) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.delete('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id);
  }

  canEdit(resource: ResourceRepresentation) {
    return !!resource.actions.find(a => a.action === 'EDIT');
  }

  canAudit(resource: ResourceRepresentation) {
    return !!resource.actions.find(a => a.action === 'AUDIT');
  }

  getActionView(resource: ResourceRepresentation): ResourceActionView {
    const actionNames = resource.actions.map(a => a.action);
    if (_.difference(['ACCEPT', 'SUSPEND', 'REJECT'], actionNames).length === 0) {
      return 'REVISE';
    }
    if (_.difference(['CORRECT'], actionNames).length === 0) {
      return 'CORRECT';
    }
    if (_.difference(['EDIT'], actionNames).length === 0) {
      return 'EDIT';
    }
    return 'VIEW';
  }

  getActions(resource: ResourceRepresentation): Action[] {
    const actions: Action[] = ['SUSPEND', 'REJECT', 'WITHDRAW', 'RESTORE', 'ACCEPT'];
    return actions.filter(a => resource.actions.find(actionDef => actionDef.action === a));
  }

}

export type ResourceActionView = 'VIEW' | 'EDIT' | 'REVISE' | 'CORRECT' | 'CREATE';
