import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class ResourceService {

  constructor(private http: Http) {
  }

  getBoards(): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards').map(res => res.json());
  }

  getDepartments(): Observable<DepartmentRepresentation[]> {
    return this.http.get('/api/departments').map(res => res.json());
  }

}
