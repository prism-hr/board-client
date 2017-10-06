import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {EntityFilter} from '../general/filter/filter.component';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Injectable()
export class DepartmentService {

  constructor(private http: JwtHttp) {
  }

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {}).map(res => res.json());
  }

  searchPrograms(department: DepartmentRepresentation, filter?: EntityFilter): Observable<string[]> {
    const params = new URLSearchParams();
    if (filter && filter.searchTerm) {
      params.set('searchTerm', filter.searchTerm);
    }
    return this.http.get('/api/departments/' + department.id + '/programs', {search: params}).map(res => res.json());
  }


}
