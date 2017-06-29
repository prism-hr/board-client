import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import PostRepresentation = b.PostRepresentation;
import PostPatchDTO = b.PostPatchDTO;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;

@Injectable()
export class PostService {

  constructor(private http: JwtHttp) {
  }

  create(board: BoardRepresentation, post: PostDTO): Observable<PostRepresentation> {
    return this.http.post('/api/boards/' + board.id + '/posts', post).map(res => res.json());
  }

  update(post: PostRepresentation, postPatch: PostPatchDTO): Observable<PostRepresentation> {
    return this.http.patch('/api/posts/' + post.id, postPatch).map(res => res.json());
  }

  loadOperations(post: PostRepresentation): Observable<ResourceOperationRepresentation[]> {
    return this.http.get('/api/posts/' + post.id + '/operations').map(res => res.json());
  }

}
