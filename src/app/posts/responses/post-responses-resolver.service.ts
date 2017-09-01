import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import {PostService} from '../post.service';
import ResourceEventRepresentation = b.ResourceEventRepresentation;
import PostRepresentation = b.PostRepresentation;

@Injectable()
export class PostResponsesResolver implements Resolve<ResourceEventRepresentation[]> {

  constructor(private postService: PostService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ResourceEventRepresentation[]> {
    const post: PostRepresentation = route.parent.data['post'];
    return this.postService.getResponses(post);
  }

}
