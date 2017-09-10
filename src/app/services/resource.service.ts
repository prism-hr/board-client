import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import * as _ from 'lodash';
import {JwtHttp} from 'ng2-ui-auth';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import Action = b.Action;
import BoardDTO = b.BoardDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentDTO = b.DepartmentDTO;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PostRepresentation = b.PostRepresentation;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;
import ResourcePatchDTO = b.ResourcePatchDTO;
import ResourceRepresentation = b.ResourceRepresentation;
import Scope = b.Scope;
import UserRepresentation = b.UserRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import UserRoleRepresentation = b.UserRoleRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Injectable()
export class ResourceService {

  private resourceSubjects: { [index: string]: { [index: number]: Subject<PostRepresentation> } } = {};

  constructor(private http: JwtHttp) {
    const scopes: Scope[] = ['DEPARTMENT', 'DEPARTMENT', 'POST'];
    for (let scope of scopes) {
      this.resourceSubjects[scope] = {};
    }
  }

  getResourceByHandle(scope: Scope, handle: string): Observable<ResourceRepresentation<any>> {
    const params = new URLSearchParams();
    params.set('handle', handle);
    return this.http.get('/api/' + scope.toLowerCase() + 's/', {search: params}).map(res => res.json())
      .do(resource => {
        const subjects = this.resourceSubjects[scope];
        if (!subjects[resource.id]) {
          subjects[resource.id] = new ReplaySubject(1);
        }
        subjects[resource.id].next(resource);
      });
  }

// FIXME use take(1) or first() instead of returnComplete
  getResource(scope: Scope, id: number, options: { reload?: boolean } = {}): Observable<ResourceRepresentation<any>> {
    const subjects = this.resourceSubjects[scope];
    if (!subjects[id]) {
      subjects[id] = new ReplaySubject(1);
    }
    let directObservable;
    if (options.reload) {
      directObservable = this.http.get('/api/' + scope.toLowerCase() + 's/' + id).map(res => res.json())
        .do(post => {
          subjects[id].next(post);
        });
    } else {
      directObservable = subjects[id].asObservable();
    }

    return directObservable;
  }

  resourceUpdated(resource: ResourceRepresentation<any>) {
    this.resourceSubjects[resource.scope][resource.id].next(resource);
  }

  getPosts(): Observable<PostRepresentation[]> {
    return this.http.get('/api/posts').map(res => res.json());
  }

  getPublicBoards(): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards?includePublicBoards=true').map(res => res.json());
  }

  getBoards(searchTerm?: string): Observable<BoardRepresentation[]> {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    }
    return this.http.get('/api/boards', {search: params}).map(res => res.json());
  }

  getDepartments(searchTerm?: string): Observable<DepartmentRepresentation[]> {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    }
    return this.http.get('/api/departments', {search: params}).map(res => res.json());
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

  getResourceUsers(scope: string, id: number): Observable<UserRolesRepresentation> {
    return this.http.get('/api/' + scope + 's' + '/' + id + '/users').map(res => res.json());
  }

  getBoardPosts(boardId: number, includePublicPosts: boolean): Observable<PostRepresentation[]> {
    return this.http.get('/api/boards/' + boardId + '/posts?includePublicPosts=' + includePublicPosts).map(res => res.json());
  }

  getDepartmentBoards(departmentId: number, includePublicBoards: boolean): Observable<BoardRepresentation[]> {
    return this.http.get('/api/departments/' + departmentId + '/boards/?includePublicBoards=' + includePublicBoards).map(res => res.json());
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

  updateResourceUser(resource: ResourceRepresentation<any>, user: UserRepresentation, userRoleDTO: UserRoleDTO): Observable<UserRoleRepresentation> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.put('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id, userRoleDTO).map(res => res.json());
  }

  addUser(resource: ResourceRepresentation<any>, user: UserRoleDTO): Observable<UserRoleRepresentation> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users', user).map(res => res.json());
  }

  addUsersInBulk(resource: ResourceRepresentation<any>, users: UserRoleDTO[]): Observable<number> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users/bulk', users).map(res => res.json());
  }

  lookupUsers(resource: ResourceRepresentation<any>, query: string): Observable<UserRepresentation[]> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get('/api/' + resourceCol + '/' + resource.id + '/lookupUsers?query=' + query).map(res => res.json());
  }

  loadOperations(resource: ResourceRepresentation<any>): Observable<ResourceOperationRepresentation[]> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get('/api/' + resourceCol + '/' + resource.id + '/operations').map(res => res.json());
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
