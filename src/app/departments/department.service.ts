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

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {}).map(res => res.json());
  }

}
