import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class BoardsService {

  constructor(private http: Http) {
  }

  getGroupedBoards(): Observable<DepartmentRepresentation[]> {
    return this.http.get('/api/groupedBoards').map(res => res.json());
  }

}
