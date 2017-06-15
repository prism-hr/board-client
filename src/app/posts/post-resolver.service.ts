import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../services/resource.service';
import {AuthGuard} from '../authentication/auth-guard.service';
import DepartmentDTO = b.DepartmentDTO;
import PostRepresentation = b.PostRepresentation;

@Injectable()
export class PostResolver implements Resolve<PostRepresentation> {

  constructor(private authGuard: AuthGuard, private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PostRepresentation> {
    const id = +route.params['postId'];
    return this.authGuard.requestSecuredEndpoint(() => this.resourceService.getPost(id));
  }

}
