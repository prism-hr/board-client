import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../../services/resource.service';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;

@Injectable()
export class BoardResolver implements Resolve<BoardDTO> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BoardDTO> {
    const departmentHandle = route.parent.params['departmentHandle'];
    const boardHandle = route.params['boardHandle'];
    return this.resourceService.getBoard(departmentHandle, boardHandle);
  }

}
