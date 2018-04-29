import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
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
import MemberDTO = b.MemberDTO;

@Injectable()
export class PostService {

  constructor(private http: HttpClient, private resourceService: ResourceService) {
  }

  create(board: BoardRepresentation, post: PostDTO): Observable<PostRepresentation> {
    return this.http.post('/api/boards/' + board.id + '/posts', post);
  }

  update(post: PostRepresentation, postPatch: PostPatchDTO): Observable<PostRepresentation> {
    return this.http.patch('/api/posts/' + post.id, postPatch)
      .pipe(tap(post => {
        this.resourceService.resourceUpdated(post);
      }));
  }

  respond(post: PostRepresentation, eventDTO: ResourceEventDTO): Observable<ResourceEventRepresentation> {
    return this.http.post('/api/posts/' + post.id + '/respond', eventDTO);
  }

  requestDepartmentMembership(department: DepartmentRepresentation, memberDTO: MemberDTO, canPursue: boolean) {
    if (canPursue) {
      return this.http.put('/api/departments/' + department.id + '/memberRequests', memberDTO);
    } else {
      return this.http.post('/api/departments/' + department.id + '/memberRequests', memberDTO);
    }
  }

  getResponses(post: PostRepresentation, filter?: EntityFilter): Observable<ResourceEventRepresentation[]> {
    let params = new HttpParams();
    if (filter && filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }
    return this.http.get<ResourceEventRepresentation[]>('/api/posts/' + post.id + '/responses', {params});
  }

  lookupOrganizations(text: string) {
    let params = new HttpParams().set('query', text);
    return this.http.get('/api/posts/organizations', {params});
  }

}
