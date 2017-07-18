import {Injectable} from '@angular/core';
import {RequestOptionsArgs, Response} from '@angular/http';
import {AuthService, JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserRepresentation = b.UserRepresentation;
import UserPatchDTO = b.UserPatchDTO;
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;

@Injectable()
export class UserService {

  public user$: Observable<UserRepresentation>;
  public userSource: ReplaySubject<UserRepresentation>;

  constructor(private http: JwtHttp, private auth: AuthService) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable();
    this.loadUser();
  }

  login(user: any, opts?: RequestOptionsArgs): Promise<UserRepresentation> {
    return this.auth.login(user, opts)
      .toPromise()
      .then((response: Response) => {
        this.auth.setToken(response.json().token);
        return this.loadUser();
      });
  }

  signup(user: any, opts?: RequestOptionsArgs): Promise<UserRepresentation> {
    return this.auth.signup(user, opts)
      .toPromise()
      .then((response: Response) => {
        this.auth.setToken(response.json().token);
        return this.loadUser();
      });
  }

  logout(): Observable<void> {
    return this.auth.logout()
      .do(() => {
        this.loadUser();
      });
  }

  authenticate(name: string, userData?: any): Promise<UserRepresentation> {
    return this.auth.authenticate(name, userData)
      .toPromise()
      .then((response: Response) => {
        this.auth.setToken(response.json().token);
        return this.loadUser();
      });
  }

  resetPassword(email: string): Observable<Response> {
    return this.http.post('/api/auth/resetPassword', {email});
  }

  loadUser() {
    return new Promise((resolve) => {
      const token = this.auth.getToken();
      if (token) {
        this.http.get('/api/user')
          .map(user => user.json())
          .subscribe(user => {
            this.userSource.next(user);
            resolve(user);
          });
      } else {
        this.userSource.next(null);
        resolve(null);
      }
    });

  }

  patchUser(userPatch: UserPatchDTO): Observable<UserRepresentation> {
    return this.http.patch('/api/user', userPatch)
      .map(res => res.json())
      .map(user => {
        this.loadUser();
        return user;
      });
  }

  getSuppressions(): Observable<UserNotificationSuppressionRepresentation[]> {
    return this.http.get('/api/user/suppressions').map(res => res.json());
  }

  setSuppression(resource: ResourceRepresentation, suppressed: boolean): Observable<Response> {
    if (suppressed) {
      return this.http.post('/api/user/suppressions/' + resource.id, {});
    }
    return this.http.delete('/api/user/suppressions/' + resource.id);
  }

  setAllSuppressions(suppressed: boolean): Observable<Response> {
    if (suppressed) {
      return this.http.post('/api/user/suppressions', {});
    }
    return this.http.delete('/api/user/suppressions');
  }
}
