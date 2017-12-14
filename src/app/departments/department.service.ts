import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EntityFilter} from '../general/filter/filter.component';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) {
  }

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {});
  }

  searchPrograms(department: DepartmentRepresentation, filter?: EntityFilter): Observable<string[]> {
    let params = new HttpParams();
    if (filter && filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }
    return this.http.get<string[]>('/api/departments/' + department.id + '/programs', {params});
  }


}
