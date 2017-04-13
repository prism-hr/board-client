import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Http, URLSearchParams} from '@angular/http';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class DepartmentResolver implements Resolve<DepartmentRepresentation> {

  constructor(private http: Http) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentRepresentation> {
    const id = route.params['id'];
    if (id) {
      return this.http.get('/api/departments/' + id).map(res => res.json());
    }
    const departmentHandle = route.parent.params['departmentHandle'];
    const params = new URLSearchParams();
    params.set('handle', departmentHandle);
    return this.http.get('/api/departments', {search: params}).map(res => res.json());
  }

}
