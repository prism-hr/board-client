import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from '../authentication/auth-guard.service';
import {PostService} from './post.service';
import PostRepresentation = b.PostRepresentation;

@Injectable()
export class PostResolver implements Resolve<PostRepresentation> {

  constructor(private authGuard: AuthGuard, private postService: PostService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PostRepresentation> {
    const id = +route.params['postId'];
    return this.authGuard.requestSecuredEndpoint(
      () => this.postService.getPost(id, {reload: true, returnComplete: true}), route.paramMap);
  }

}
