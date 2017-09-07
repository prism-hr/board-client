import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;
import UserRoleRepresentation = b.UserRoleRepresentation;
import {URLSearchParams} from '@angular/http';

@Injectable()
export class DepartmentService {

  constructor(private http: JwtHttp) {
  }

  getMemberRequests(department: DepartmentRepresentation): Observable<UserRoleRepresentation[]> {
    return this.http.get('/api/departments/' + department.id + '/memberRequests').map(res => res.json());
  }

  getMembers(department: DepartmentRepresentation, searchTerm: string): Observable<UserRoleRepresentation[]> {
    const params = new URLSearchParams();
    params.set('searchTerm', searchTerm);
    return this.http.get('/api/departments/' + department.id + '/members', {search: params}).map(res => res.json());
  }

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {}).map(res => res.json());
  }

}
