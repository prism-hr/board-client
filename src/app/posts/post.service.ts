import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PostDTO = b.PostDTO;
import PostPatchDTO = b.PostPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceEventDTO = b.ResourceEventDTO;
import ResourceEventRepresentation = b.ResourceEventRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import {AsyncSubject} from 'rxjs/AsyncSubject';

@Injectable()
export class PostService {

  private postSubjects: { [index: number]: Subject<PostRepresentation> } = {};

  constructor(private http: JwtHttp) {
  }

  getPost(id: number, options: {returnComplete?: boolean, reload?: boolean} = {}): Observable<PostRepresentation> {
    if (!this.postSubjects[id]) {
      this.postSubjects[id] = new ReplaySubject(1);
    }
    let directObservable;
    if(options.reload) {
      directObservable = this.http.get('/api/posts/' + id).map(res => res.json())
        .do(post => {
          this.postSubjects[id].next(post);
        });
    } else {
      directObservable = new AsyncSubject();
      this.postSubjects[id].subscribe(post => {
        directObservable.next(post);
        directObservable.complete();
      })
    }
    if (options.returnComplete) {
      return directObservable;
    }

    if(options.reload) {
      directObservable.subscribe(); // force http request
    }
    return this.postSubjects[id].asObservable();
  }

  create(board: BoardRepresentation, post: PostDTO): Observable<PostRepresentation> {
    return this.http.post('/api/boards/' + board.id + '/posts', post).map(res => res.json());
  }

  update(post: PostRepresentation, postPatch: PostPatchDTO): Observable<PostRepresentation> {
    return this.http.patch('/api/posts/' + post.id, postPatch).map(res => res.json())
      .do(post => {
        this.postSubjects[post.id].next(post);
      });
  }

  respond(post: PostRepresentation, eventDTO: ResourceEventDTO): Observable<ResourceEventRepresentation> {
    return this.http.post('/api/posts/' + post.id + '/respond', eventDTO).map(res => res.json());
  }

  requestDepartmentMembership(department: DepartmentRepresentation, userRoleDTO: UserRoleDTO): Observable<Response> {
    return this.http.post('/api/departments/' + department.id + '/memberships', userRoleDTO);
  }

}
