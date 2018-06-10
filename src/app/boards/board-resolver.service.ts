import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;

@Injectable()
export class BoardResolver implements Resolve<BoardRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BoardRepresentation> {
    const universityHandle = route.params['universityHandle'];
    const departmentHandle = route.params['departmentHandle'];
    const boardHandle = route.params['boardHandle'];
    return this.resourceService.getResourceByHandle('BOARD', universityHandle + '/' + departmentHandle + '/' + boardHandle);
  }

}
