import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;

@Injectable()
export class BoardsResolver implements Resolve<BoardRepresentation[] | BoardRepresentation> {

  constructor(private resourceService: ResourceService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BoardRepresentation[] | BoardRepresentation> {
    const boardId = route.paramMap.get('boardId');
    const departmentId = route.paramMap.get('departmentId');
    if (boardId) {
      return this.resourceService.getResource('BOARD', +boardId, {reload: true});
    } else if (departmentId) {
      return this.resourceService.getResources('BOARD', {parentId: +departmentId});
    }
    return this.resourceService.getResources('BOARD');
  }

}
