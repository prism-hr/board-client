import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../services/resource.service';
import DepartmentDTO = b.DepartmentDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class ResourceUsersResolver implements Resolve<ResourceUserRepresentation[]> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ResourceUserRepresentation[]> {
    const resourceScope = route.parent.data['resourceScope'];
    const resource: DepartmentRepresentation = route.parent.data[resourceScope];
    return this.resourceService.getResourceUsers(resourceScope, resource.id);
  }

}
