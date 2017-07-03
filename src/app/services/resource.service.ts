import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {MdDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {JwtHttp} from 'ng2-ui-auth';
import {MenuItem} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';
import {ResourceCommentDialogComponent} from '../resource/resource-comment.dialog';
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
import ResourceUsersDTO = b.ResourceUsersDTO;
import DepartmentDTO = b.DepartmentDTO;
import ResourcePatchDTO = b.ResourcePatchDTO;
import Action = b.Action;

@Injectable()
export class ResourceService {

  constructor(private http: JwtHttp, private translate: TranslateService, private dialog: MdDialog) {
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

  executeAction(resource: ResourceRepresentation, action: string, resourcePatch: ResourcePatchDTO): Observable<ResourceRepresentation> {
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

  getActionView(resource: ResourceRepresentation): string {
    if (!resource.actions) {
      return 'EDIT'; // creating new resource
    }
    const actionNames = resource.actions.map(a => a.action);
    if (_.difference(['ACCEPT', 'SUSPEND', 'REJECT'], actionNames).length === 0) {
      return 'REVISE';
    }
    if (_.difference(['CORRECT'], actionNames).length === 0) {
      return 'CORRECT';
    }
    if (_.difference(['RESTORE'], actionNames).length === 0) {
      return 'RESTORE';
    }
    if (_.difference(['EDIT'], actionNames).length === 0) {
      return 'EDIT';
    }
    return 'VIEW';
  }

  getActionItems(resource: ResourceRepresentation, actionCallback: (post: ResourceRepresentation) => void): Observable<MenuItem[]> {
    const actions: Action[] = ['SUSPEND', 'REJECT', 'WITHDRAW', 'RESTORE', 'ACCEPT'];
    const availableActions = actions.filter(a => resource.actions.find(actionDef => actionDef.action === a));
    return this.translate.get('definitions.action')
      .map(actionTranslations => {
        return availableActions.map(action => {
          return {
            label: actionTranslations[action], command: () => {
              this.openActionDialog(resource, action, actionCallback);
            }
          };
        });
      });
  }

  openActionDialog(resource: ResourceRepresentation, action: Action, actionCallback: (post: ResourceRepresentation) => void) {
    const dialogRef = this.dialog.open(ResourceCommentDialogComponent, {data: {action, resource}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const requestBody: any = {};
        requestBody.comment = result.comment;
        this.executeAction(resource, action, requestBody)
          .subscribe(newPost => {
            actionCallback(newPost);
          });
      }
    });
  }


}
