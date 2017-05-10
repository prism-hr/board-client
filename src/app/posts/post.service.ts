import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {MenuItem} from 'primeng/primeng';
import PostRepresentation = b.PostRepresentation;
import PostPatchDTO = b.PostPatchDTO;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;

@Injectable()
export class PostService {

  constructor(private http: Http, private router: Router, private translate: TranslateService, private snackBar: MdSnackBar) {
  }

  getActionView(post: PostRepresentation): string {
    if (!post.actions) {
      return 'EDIT'; // creating new post
    }
    const actionNames = post.actions.map(a => a.action as any as string);
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

  create(board: BoardRepresentation, post: PostDTO) {
    return this.http.post('/api/boards/' + board.id + '/posts', post);
  }

  update(post: PostRepresentation, postPatch: PostPatchDTO) {
    return this.http.patch('/api/posts/' + post.id, postPatch);
  }

  executeAction(post: PostRepresentation, action: string, postPatch: PostPatchDTO) {
    return this.http.post('/api/posts/' + post.id + '/' + action.toLowerCase(), postPatch);
  }

  loadOperations(post: PostRepresentation): Observable<ResourceOperationRepresentation[]> {
    return this.http.get('/api/posts/' + post.id + '/operations').map(res => res.json());
  }

  getActionItems(post: PostRepresentation): Observable<MenuItem[]> {
    const availableActions = ['SUSPEND', 'REJECT', 'WITHDRAW', 'RESTORE']
      .filter(a => post.actions.find(actionDef => actionDef.action as any === a));
    return this.translate.get('definitions.action')
      .map(actionTranslations => {
        return availableActions.map(a => {
          return {
            label: actionTranslations[a], command: () => {
              this.executeAction(post, a, {})
                .subscribe(() => {
                  this.router.navigate([post.board.department.handle, post.board.handle])
                    .then(() => {
                      this.snackBar.open('Your action was executed successfully.', null, {duration: 500});
                    });
                });
            }
          };
        });
      });
  }

}
