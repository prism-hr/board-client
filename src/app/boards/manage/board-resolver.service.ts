import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;

@Injectable()
export class BoardResolver implements Resolve<DepartmentDTO> {

  constructor(private http: Http) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.params['id'];
    if (id !== 'new') {
      return this.http.get('/api/boards/' + id).map(res => res.json());
    }
  }

}
