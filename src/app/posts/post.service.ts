import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import PostRepresentation = b.PostRepresentation;

@Injectable()
export class PostService {

  constructor() {
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

}
