import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;
import UserRoleRepresentation = b.UserRoleRepresentation;

@Injectable()
export class DepartmentService {

  constructor(private http: JwtHttp) {
  }

  getMemberRequests(department: DepartmentRepresentation): Observable<UserRoleRepresentation[]> {
    return this.http.get('/api/departments/' + department.id + '/memberRequests').map(res => res.json());
  }

  getMembers(department: DepartmentRepresentation): Observable<UserRoleRepresentation[]> {
    return this.http.get('/api/departments/' + department.id + '/members').map(res => res.json());
  }

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {}).map(res => res.json());
  }

}
