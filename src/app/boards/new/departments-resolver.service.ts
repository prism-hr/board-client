import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class DepartmentsResolver implements Resolve<DepartmentRepresentation[] | DepartmentRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepartmentRepresentation[] | DepartmentRepresentation> {
    const departmentId = route.paramMap.get('departmentId');
    if (departmentId) {
      return this.resourceService.getResource('DEPARTMENT', +departmentId, {reload: true});
    }
    return this.resourceService.getResources('DEPARTMENT');
  }

}
