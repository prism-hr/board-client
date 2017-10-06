import {Injectable} from '@angular/core';
import {Response, URLSearchParams} from '@angular/http';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {EntityFilter} from '../general/filter/filter.component';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PostDTO = b.PostDTO;
import PostPatchDTO = b.PostPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceEventDTO = b.ResourceEventDTO;
import ResourceEventRepresentation = b.ResourceEventRepresentation;
import UserRoleDTO = b.UserRoleDTO;

@Injectable()
export class PostService {

  constructor(private http: JwtHttp, private resourceService: ResourceService) {
  }

  create(board: BoardRepresentation, post: PostDTO): Observable<PostRepresentation> {
    return this.http.post('/api/boards/' + board.id + '/posts', post).map(res => res.json());
  }

  update(post: PostRepresentation, postPatch: PostPatchDTO): Observable<PostRepresentation> {
    return this.http.patch('/api/posts/' + post.id, postPatch).map(res => res.json())
      .do(post => {
        this.resourceService.resourceUpdated(post);
      });
  }

  respond(post: PostRepresentation, eventDTO: ResourceEventDTO): Observable<ResourceEventRepresentation> {
    return this.http.post('/api/posts/' + post.id + '/respond', eventDTO).map(res => res.json());
  }

  requestDepartmentMembership(department: DepartmentRepresentation, userRoleDTO: UserRoleDTO, canPursue: boolean): Observable<Response> {
    if (canPursue) {
      return this.http.put('/api/departments/' + department.id + '/memberRequests', userRoleDTO);
    } else {
      return this.http.post('/api/departments/' + department.id + '/memberRequests', userRoleDTO);
    }
  }

  getResponses(post: PostRepresentation, filter?: EntityFilter): Observable<ResourceEventRepresentation[]> {
    const params = new URLSearchParams();
    if (filter && filter.searchTerm) {
      params.set('searchTerm', filter.searchTerm);
    }
    return this.http.get('/api/posts/' + post.id + '/responses', {search: params}).map(res => res.json());
  }

}
