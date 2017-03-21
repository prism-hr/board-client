import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Http, URLSearchParams} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;

@Injectable()
export class DepartmentResolver implements Resolve<DepartmentDTO> {

  constructor(private http: Http) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentDTO> {
    const id = route.params['id'];
    if(id) {
      return this.http.get('/api/departments/' + id).map(res => res.json());
    }
    const departmentHandle = route.parent.params['departmentHandle'];
    const params = new URLSearchParams();
    params.set("handle", departmentHandle);
    return this.http.get('/api/departments', {search: params}).map(res => res.json());
  }

}
