import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DepartmentService} from './department.service';
import DepartmentDashboardRepresentation = b.DepartmentDashboardRepresentation;

@Injectable()
export class DepartmentDashboardResolver implements Resolve<DepartmentDashboardRepresentation> {

  constructor(private departmentService: DepartmentService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentDashboardRepresentation> {
    const department = route.parent.data.department;
    return this.departmentService.getDashboard(department);
  }

}
