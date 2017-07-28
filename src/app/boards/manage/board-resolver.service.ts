import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;

@Injectable()
export class BoardResolver implements Resolve<BoardRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BoardRepresentation> {
    const departmentHandle = route.parent.params['departmentHandle'];
    const boardHandle = route.params['boardHandle'];
    return this.resourceService.getBoard(departmentHandle, boardHandle);
  }

}
