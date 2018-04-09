import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class DepartmentResolver implements Resolve<DepartmentRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentRepresentation> {
    const departmentId = route.params['departmentId'];
    const universityHandle = route.params['universityHandle'];
    const departmentHandle = route.params['departmentHandle'];
    if (departmentId) {
      return this.resourceService.getResource('DEPARTMENT', departmentId);
    } else if (universityHandle && departmentHandle) {
      return this.resourceService.getResourceByHandle('DEPARTMENT', universityHandle + '/' + departmentHandle);
    }
    return of(null);
  }

}
