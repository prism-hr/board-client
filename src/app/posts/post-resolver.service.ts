import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import PostRepresentation = b.PostRepresentation;

@Injectable()
export class PostResolver implements Resolve<PostRepresentation> {

  constructor(private http: Http) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PostRepresentation> {
    const id = route.params['postId'];
    return this.http.get('/api/posts/' + id).map(res => res.json());
  }

}
