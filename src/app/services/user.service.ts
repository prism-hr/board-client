import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {Stormpath} from 'angular-stormpath';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserRepresentation = b.UserRepresentation;
import UserPatchDTO = b.UserPatchDTO;

@Injectable()
export class UserService {

  public user$: Observable<UserRepresentation | boolean>;
  public userSource: ReplaySubject<UserRepresentation | boolean>;

  constructor(private http: Http, private stormpath: Stormpath) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable();
    stormpath.user$
      .flatMap(stormpathUser => {
        if (stormpathUser) {
          return http.get('/api/user').map(user => user.json());
        }
        return Observable.of(false);
      })
      .subscribe(user => {
        this.userSource.next(user);
      });
  }

  update(userPatch: UserPatchDTO): Observable<UserRepresentation> {
    return this.http.patch('/api/user', userPatch)
      .map(res => res.json())
      .map(user => {
        this.userSource.next(user);
        return user;
      });
  }

}
