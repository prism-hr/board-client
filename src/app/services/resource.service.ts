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
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ResourceService {

  constructor(private http: JwtHttp) {
  }

  getPosts(): Observable<PostRepresentation[]> {
    return this.http.get('/api/posts').map(res => res.json());
  }

  getPublicBoards(): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards?includePublicBoards=true').map(res => res.json());
  }

  getBoards(query?: string): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards' + (query ? '?query=' + query : '')).map(res => res.json());
  }

  getDepartments(query?: string): Observable<DepartmentRepresentation[]> {
    return this.http.get('/api/departments' + (query ? '?query=' + query : '')).map(res => res.json());
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

  getDepartmentBoards(departmentId: number): Observable<BoardRepresentation[]> {
    return this.http.get('/api/departments/' + departmentId + '/boards').map(res => res.json());
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

  executeAction(resource: ResourceRepresentation<any>, action: Action,
                resourcePatch: ResourcePatchDTO<any>): Observable<ResourceRepresentation<any>> {
    return this.http.post('/api/' + resource.scope.toLowerCase() + 's/' + resource.id + '/actions/' + action.toLowerCase(), resourcePatch)
      .map(res => res.json());
  }

  updateResourceUser(resource: ResourceRepresentation<any>, user: UserRepresentation, resourceUserDTO: ResourceUserDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.put('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id, resourceUserDTO).map(res => res.json());
  }

  addUser(resource: ResourceRepresentation<any>, user: ResourceUserDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users', user).map(res => res.json());
  }

  addUsersInBulk(resource: ResourceRepresentation<any>, usersBulk: ResourceUsersDTO) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users/bulk', usersBulk);
  }

  lookupUsers(resource: ResourceRepresentation<any>, query: string): Observable<UserRepresentation[]> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get('/api/' + resourceCol + '/' + resource.id + '/lookupUsers?query=' + query).map(res => res.json());
  }

  removeUser(resource: ResourceRepresentation<any>, user: UserRepresentation) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.delete('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id);
  }

  lookupOrganizations(query: string) {
    return this.http.get('/api/posts/organizations?query=' + query).map(res => res.json());
  }

  canEdit(resource: ResourceRepresentation<any>) {
    return !!resource.actions.find(a => a.action === 'EDIT');
  }

  canPursue(resource: ResourceRepresentation<any>) {
    return !!resource.actions.find(a => a.action === 'PURSUE');
  }

  getActionView(resource: ResourceRepresentation<any>): ResourceActionView {
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

  getActions(resource: ResourceRepresentation<any>): Action[] {
    const actions: Action[] = ['SUSPEND', 'REJECT', 'WITHDRAW', 'RESTORE', 'ACCEPT'];
    return actions.filter(a => resource.actions.find(actionDef => actionDef.action === a));
  }

  routerLink(resource: ResourceRepresentation<any>): any[] {
    if (resource.scope === 'DEPARTMENT') {
      return ['/', (<DepartmentRepresentation>resource).handle];
    } else if (resource.scope === 'BOARD') {
      const board: BoardRepresentation = resource;
      return ['/', board.department.handle, board.handle];
    } else if (resource.scope === 'POST') {
      const post: PostRepresentation = resource;
      return ['/', post.board.department.handle, post.board.handle, post.id];
    }
  }

}

export type ResourceActionView = 'VIEW' | 'EDIT' | 'REVISE' | 'CORRECT' | 'CREATE';
