import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Http, URLSearchParams} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;

@Injectable()
export class BoardResolver implements Resolve<BoardDTO> {

  constructor(private http: Http) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BoardDTO> {
    const id = route.params['boardId'];
    if (id) {
      return this.http.get('/api/boards/' + id).map(res => res.json());
    }
    const departmentHandle = route.parent.params['departmentHandle'];
    const boardHandle = route.params['boardHandle'];
    const params = new URLSearchParams();
    params.set("handle", departmentHandle + '/' + boardHandle);
    return this.http.get('/api/boards', {search: params}).map(res => res.json());
  }

}
