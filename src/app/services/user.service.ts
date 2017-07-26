import {Injectable} from '@angular/core';
import {RequestOptionsArgs, Response} from '@angular/http';
import {AuthService, JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import ActivityRepresentation = b.ActivityRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;
import UserPatchDTO = b.UserPatchDTO;
import UserRepresentation = b.UserRepresentation;

@Injectable()
export class UserService {

  public user$: Observable<UserRepresentation>;
  public userSource: ReplaySubject<UserRepresentation>;
  public activities$: ReplaySubject<ActivityRepresentation[]>;

  constructor(private http: JwtHttp, private auth: AuthService) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable();
    this.activities$ = new ReplaySubject<UserRepresentation>(1);
    this.initializeUser();
  }

  login(user: any, opts?: RequestOptionsArgs): Promise<UserRepresentation> {
    return this.auth.login(user, opts)
      .toPromise()
      .then((response: Response) => {
        this.auth.setToken(response.json().token);
        return this.initializeUser();
      });
  }

  signup(user: any, opts?: RequestOptionsArgs): Promise<UserRepresentation> {
    return this.auth.signup(user, opts)
      .toPromise()
      .then((response: Response) => {
        this.auth.setToken(response.json().token);
        return this.initializeUser();
      });
  }

  authenticate(name: string, userData?: any): Promise<UserRepresentation> {
    return this.auth.authenticate(name, userData)
      .toPromise()
      .then((response: Response) => {
        this.auth.setToken(response.json().token);
        return this.initializeUser();
      });
  }

  logout(): Observable<void> {
    return this.auth.logout()
      .do(() => {
        this.loadUser();
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

  setSuppression(resource: ResourceRepresentation<any>, suppressed: boolean): Observable<Response> {
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

  dismissActivity(activity: ActivityRepresentation) {
    return this.http.delete('/api/user/activities/' + activity.id);
  }

  private initializeUser() {
    this.http.get('/api/user/activities')
      .subscribe(activities => this.activities$.next(activities.json()));
    Observable
      .interval(50000)
      .startWith(0)
      .switchMap(() => this.http.get('/api/user/activities/refresh'))
      .subscribe(activities => this.activities$.next(activities.json()));
    return this.loadUser();
  }
}
