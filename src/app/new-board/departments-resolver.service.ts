import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;

@Injectable()
export class DepartmentsResolver implements Resolve<DepartmentDTO> {

  constructor(private http: Http) {
  }

  resolve(): Observable<any>|Promise<any>|any {
    return this.http.get('/api/departments').map(res => res.json());
  }

}
