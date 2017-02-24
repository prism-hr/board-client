import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import BoardDTO = b.BoardDTO;

@Injectable()
export class BoardsResolver implements Resolve<BoardDTO> {

  constructor(private http: Http) {
  }

  resolve(): Observable<any>|Promise<any>|any {
    return this.http.get('/api/boards').map(res => res.json());
  }

}
