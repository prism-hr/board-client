import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DepartmentService} from '../department.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRoleRepresentation = b.UserRoleRepresentation;

@Injectable()
export class DepartmentMembershipsResolverService implements Resolve<UserRoleRepresentation[]> {

  constructor(private departmentService: DepartmentService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UserRoleRepresentation[]> {
    const department: DepartmentRepresentation = route.parent.data['department'];
    return this.departmentService.getMemberships(department);
  }

}
