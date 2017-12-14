import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {difference} from 'lodash';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import {EntityFilter} from '../general/filter/filter.component';
import {Utils} from './utils';
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
import UniversityRepresentation = b.UniversityRepresentation;
import UserRepresentation = b.UserRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import UserRoleRepresentation = b.UserRoleRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Injectable()
export class ResourceService {

  private resourceSubjects: { [index: string]: { [index: number]: Subject<PostRepresentation> } } = {};

  constructor(private http: HttpClient) {
    const scopes: Scope[] = ['DEPARTMENT', 'BOARD', 'POST'];
    for (let scope of scopes) {
      this.resourceSubjects[scope] = {};
    }
  }

  getResourceByHandle(scope: Scope, handle: string): Observable<ResourceRepresentation<any>> {
    const params = new HttpParams().set('handle', handle);
    return this.http.get<ResourceRepresentation<any>>('/api/' + scope.toLowerCase() + 's/', {params})
      .catch((error: HttpErrorResponse) => {
        if (error.status === 403 || error.status === 404) {
          return Observable.of(<ResourceRepresentation<any>>{errorStatus: error.status});
        }
        throw error;
      })
      .pipe(tap(resource => {
        if (resource) {
          const subjects = this.resourceSubjects[scope];
          if (!subjects[resource.id]) {
            subjects[resource.id] = new ReplaySubject(1);
          }
          subjects[resource.id].next(resource);
        }
      }));
  }

  getResource(scope: Scope, id: number, options: { reload?: boolean } = {}): Observable<ResourceRepresentation<any>> {
    const subjects = this.resourceSubjects[scope];
    if (!subjects[id]) {
      subjects[id] = new ReplaySubject(1);
    }
    let directObservable;
    if (options.reload) {
      directObservable = this.http.get<ResourceRepresentation<any>>('/api/' + scope.toLowerCase() + 's/' + id)
        .catch((error: Response) => {
          if (error.status === 403 || error.status === 404) {
            return Observable.of(<ResourceRepresentation<any>>{errorStatus: error.status});
          }
          throw error;
        })
        .pipe(tap(resource => {
          subjects[id].next(resource);
        }));
    } else {
      directObservable = subjects[id].asObservable();
    }

    return directObservable;
  }

  resourceUpdated(resource: ResourceRepresentation<any>) {
    this.resourceSubjects[resource.scope][resource.id].next(resource);
  }

  getResources(scope: Scope, filter?: EntityFilter): Observable<ResourceRepresentation<any>[]> {
    const resourceCol = scope.toLowerCase() + 's';
    return this.http.get<ResourceRepresentation<any>[]>('/api/' + resourceCol, {params: this.generateFilterParams(filter)});
  }

  lookupResources(scope: Scope, query: string): Observable<ResourceRepresentation<any>[]> {
    const params = new HttpParams().set('query', query);
    const resourceCol = Utils.pluralize(scope.toLowerCase());
    return this.http.get<ResourceRepresentation<any>[]>('/api/' + resourceCol, {params});
  }

  getPosts(filter?: EntityFilter): Observable<PostRepresentation[]> {
    return this.http.get<PostRepresentation[]>('/api/posts', {params: this.generateFilterParams(filter)});
  }

  getBoards(filter?: EntityFilter): Observable<BoardRepresentation[]> {
    return this.http.get<BoardRepresentation[]>('/api/boards', {params: this.generateFilterParams(filter)});
  }

  getResourceUsers(resource: ResourceRepresentation<any>, filter?: EntityFilter): Observable<UserRolesRepresentation> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get('/api/' + resourceCol + '/' + resource.id + '/users',
      {params: this.generateFilterParams(filter)});
  }

  postBoard(department: DepartmentRepresentation, board: BoardDTO) {
    return this.http.post<BoardRepresentation>('/api/departments/' + department.id + '/boards', board);
  }

  patchBoard(id: number, board: BoardPatchDTO): Observable<BoardRepresentation> {
    return this.http.patch('/api/boards/' + id, board);
  }

  postDepartment(university: UniversityRepresentation, department: DepartmentDTO) {
    return this.http.post('/api/universities/' + university.id + '/departments/', department);
  }

  patchDepartment(id: number, department: DepartmentPatchDTO): Observable<DepartmentRepresentation> {
    return this.http.patch('/api/departments/' + id, department);
  }

  executeAction(resource: ResourceRepresentation<any>, action: Action,
                resourcePatch: ResourcePatchDTO<any>): Observable<ResourceRepresentation<any>> {
    return this.http.post('/api/' + resource.scope.toLowerCase() + 's/' + resource.id + '/actions/' + action.toLowerCase(), resourcePatch)
      .pipe(tap(resource => {
        this.resourceUpdated(resource);
      }));
  }

  updateResourceUser(resource: ResourceRepresentation<any>, user: UserRepresentation, userRoleDTO: UserRoleDTO): Observable<UserRoleRepresentation> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.put('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id, userRoleDTO);
  }

  addUser(resource: ResourceRepresentation<any>, user: UserRoleDTO): Observable<UserRoleRepresentation> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post('/api/' + resourceCol + '/' + resource.id + '/users', user);
  }

  addUsersInBulk(resource: ResourceRepresentation<any>, users: UserRoleDTO[]): Observable<number> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.post<number>('/api/' + resourceCol + '/' + resource.id + '/users/bulk', users);
  }

  lookupUsers(resource: ResourceRepresentation<any>, query: string): Observable<UserRepresentation[]> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get<UserRepresentation[]>('/api/' + resourceCol + '/' + resource.id + '/lookupUsers?query=' + query);
  }

  loadOperations(resource: ResourceRepresentation<any>): Observable<ResourceOperationRepresentation[]> {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.get<ResourceOperationRepresentation[]>('/api/' + resourceCol + '/' + resource.id + '/operations');
  }

  removeUser(resource: ResourceRepresentation<any>, user: UserRepresentation) {
    const resourceCol = (<any>resource.scope).toLowerCase() + 's';
    return this.http.delete('/api/' + resourceCol + '/' + resource.id + '/users/' + user.id);
  }

  lookupOrganizations(query: string) {
    return this.http.get('/api/posts/organizations?query=' + query);
  }

  getArchiveQuarters(scope: Scope): Observable<string[]> {
    const resourceCol = scope.toLowerCase() + 's';
    return this.http.get<string[]>('/api/' + resourceCol + '/archiveQuarters');
  }

  canEdit(resource: ResourceRepresentation<any>) {
    return !!resource.actions.find(a => a.action === 'EDIT');
  }

  canPursue(resource: ResourceRepresentation<any>) {
    return !!resource.actions.find(a => a.action === 'PURSUE');
  }

  getActionView(resource: ResourceRepresentation<any>): ResourceActionView {
    const actionNames = resource.actions.map(a => a.action);
    if (difference(['ACCEPT', 'REJECT'], actionNames).length === 0) {
      return 'REVIEW';
    }
    if (difference(['CORRECT'], actionNames).length === 0) {
      return 'REVISE';
    }
    if (difference(['EDIT'], actionNames).length === 0) {
      return 'EDIT';
    }
    return 'VIEW';
  }

  getActions(resource: ResourceRepresentation<any>): Action[] {
    let actions: Action[];
    switch (resource.state) {
      case 'DRAFT': {
        actions = ['REJECT', 'WITHDRAW'];
        break;
      }
      case 'SUSPENDED': {
        actions = ['ACCEPT', 'REJECT', 'WITHDRAW'];
        break;
      }
      case 'PENDING': {
        actions = ['REJECT', 'WITHDRAW'];
        break;
      }
      case 'ACCEPTED': {
        actions = ['REJECT', 'WITHDRAW'];
        break;
      }
      case 'EXPIRED': {
        actions = ['REJECT', 'WITHDRAW'];
        break;
      }
      case 'REJECTED': {
        actions = ['RESTORE', 'WITHDRAW'];
        break;
      }
      case 'WITHDRAWN': {
        actions = ['RESTORE'];
        break;
      }
      case 'ARCHIVED': {
        actions = ['RESTORE'];
        break;
      }
    }

    return actions.filter(a => resource.actions.find(actionDef => actionDef.action === a));
  }

  routerLink(resource: ResourceRepresentation<any>): any[] {
    if (resource.scope === 'DEPARTMENT') {
      const department: DepartmentRepresentation = resource;
      return ['/', department.university.handle, department.handle];
    } else if (resource.scope === 'BOARD') {
      const board: BoardRepresentation = resource;
      return ['/', board.department.university.handle, board.department.handle, board.handle];
    } else if (resource.scope === 'POST') {
      const post: PostRepresentation = resource;
      return ['/', post.board.department.university.handle, post.board.department.handle, post.board.handle, post.id];
    }
  }

  private generateFilterParams(filter: EntityFilter) {
    let params = new HttpParams();
    if (filter && filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }
    if (filter && filter.state) {
      params = params.set('state', filter.state);
    }
    if (filter && filter.quarter) {
      params = params.set('quarter', filter.quarter);
    }
    if (filter && filter.includePublic) {
      params = params.set('includePublic', filter.includePublic.toString());
    }
    if (filter && filter.parentId) {
      params = params.set('parentId', filter.parentId.toString());
    }
    return params;
  }
}

export type ResourceActionView = 'VIEW' | 'EDIT' | 'REVIEW' | 'REVISE' | 'CREATE';
