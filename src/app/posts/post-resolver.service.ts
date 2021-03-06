import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from '../authentication/auth-guard.service';
import {ResourceService} from '../services/resource.service';
import PostRepresentation = b.PostRepresentation;

@Injectable()
export class PostResolver implements Resolve<PostRepresentation> {

  constructor(private authGuard: AuthGuard, private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PostRepresentation> {
    const id = +route.params['postId'];
    return this.authGuard.requestSecuredEndpoint(
      () => this.resourceService.getResource('POST', id, {reload: true}), route.paramMap);

  }

}
