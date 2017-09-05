import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Injectable()
export class ResourceUsersResolver implements Resolve<UserRolesRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UserRolesRepresentation> {
    const resourceScope = route.parent.data['resourceScope'];
    const resource: DepartmentRepresentation = route.parent.data[resourceScope];
    return this.resourceService.getResourceUsers(resourceScope, resource.id);
  }

}
