import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PostDTO = b.PostDTO;
import PostPatchDTO = b.PostPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceEventDTO = b.ResourceEventDTO;
import ResourceEventRepresentation = b.ResourceEventRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import {AsyncSubject} from 'rxjs/AsyncSubject';

@Injectable()
export class DepartmentService {

  constructor(private http: JwtHttp) {
  }

  getMemberships(department: DepartmentRepresentation): Observable<ResourceEventRepresentation[]> {
    return this.http.get('/api/departments/' + department.id + '/memberships').map(res => res.json());
  }

}
