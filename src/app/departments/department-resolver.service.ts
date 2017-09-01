import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class DepartmentResolver implements Resolve<DepartmentRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentRepresentation> {
    const departmentHandle = route.parent.params['departmentHandle'];
    return this.resourceService.getResourceByHandle('DEPARTMENT', departmentHandle);
  }

}
