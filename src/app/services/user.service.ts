import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {RequestOptionsArgs, Response} from '@angular/http';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {AuthService, JwtHttp} from 'ng2-ui-auth';
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

  public user$: Observable<UserRepresentation>;
  public userSource: ReplaySubject<UserRepresentation>;

  constructor(private http: JwtHttp, private auth: AuthService) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable();
    this.loadUser();
  }

  login(user: any, opts?: RequestOptionsArgs): Observable<Response> {
    return this.auth.login(user, opts)
      .do((response: Response) => {
        this.loadUser();
        console.log('login');
      });
  }

  signup(user: any, opts?: RequestOptionsArgs): Observable<Response> {
    return this.auth.signup(user, opts)
      .do((response: Response) => {
        this.auth.setToken(response.json().token);
        this.loadUser();
      });
  }

  logout(): Observable<void> {
    return this.auth.logout()
      .do(() => {
        this.loadUser();
      });
  }

  authenticate(name: string, userData?: any): Observable<Response> {
    return this.auth.authenticate(name, userData)
      .do((response: Response) => {
        this.auth.setToken(response.json().token);
        this.loadUser();
      });
  }

  resetPassword(email: string): Observable<Response> {
    return this.http.post('/api/auth/resetPassword', {email})
      .do((response: Response) => {
        console.log('password reset');
      });
  }

  loadUser() {
    const token = this.auth.getToken();
    if (token) {
      return this.http.get('/api/user')
        .map(user => user.json())
        .subscribe(user => this.userSource.next(user));
    }
    this.userSource.next(null);
  }

  update(userPatch: UserPatchDTO): Observable<UserRepresentation> {
    return this.http.patch('/api/user', userPatch)
      .map(res => res.json())
      .map(user => {
        this.loadUser();
        return user;
      });
  }

}
