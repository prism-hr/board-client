import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;

@Injectable()
export class DepartmentResolver implements Resolve<DepartmentDTO> {

  constructor(private http: Http) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentDTO> {
    const id = route.params['id'];
    return this.http.get('/api/departments/' + id).map(res => res.json());
  }

}
