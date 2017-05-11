import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import PostRepresentation = b.PostRepresentation;
import {ResourceService} from '../services/resource.service';

@Injectable()
export class PostResolver implements Resolve<PostRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PostRepresentation> {
    const id = +route.params['postId'];
    return this.resourceService.getPost(id);
  }

}
