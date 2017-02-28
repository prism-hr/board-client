import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;

@Injectable()
export class BoardsService {

  constructor(private http: Http) {
  }

  getBoards(): Observable<BoardRepresentation[]> {
    return this.http.get('/api/boards').map(res => res.json());
  }

}
