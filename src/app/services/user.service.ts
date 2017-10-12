import {Injectable, OnInit} from '@angular/core';
import {RequestOptionsArgs, Response} from '@angular/http';
import {RollbarService} from 'angular-rollbar';
import {AuthService, JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';
import {CustomJwtHttp} from '../authentication/jwt-http.service';
import {DefinitionsService} from './definitions.service';
import ActivityRepresentation = b.ActivityRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;
import UserPasswordDTO = b.UserPasswordDTO;
import UserPatchDTO = b.UserPatchDTO;
import UserRepresentation = b.UserRepresentation;

@Injectable()
export class UserService implements OnInit {
  user$: Observable<UserRepresentation>;
  userSource: ReplaySubject<UserRepresentation>;
  activities$: ReplaySubject<ActivityRepresentation[]>;
  activitiesSubscription: Subscription;

  constructor(private http: JwtHttp, private rollbar: RollbarService, private auth: AuthService,
              private definitionsService: DefinitionsService) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable();
    this.activities$ = new ReplaySubject<UserRepresentation>(1);
    (<CustomJwtHttp><any>this.http).getSessionsExpiredSubject()
      .subscribe(() => {
        this.logout();
      });
  }

  ngOnInit(): void {

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

  logout() {
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }
    this.auth.logout().toPromise()
      .then(() => {
        return this.loadUser();
      });
  }

  resetPassword(email: string): Observable<Response> {
    return this.http.post('/api/auth/resetPassword', {email});
  }

  loadUser(): Promise<UserRepresentation> {
    return new Promise(resolve => {
      const token = this.auth.getToken();
      if (token) {
        this.http.get('/api/user')
          .map(user => user.json())
          .subscribe((user: UserRepresentation) => {
            this.userSource.next(user);
            this.definitionsService.loadDefinitions()
              .then(definitions => {
                this.rollbar.configure({
                  payload: {
                    environment: definitions.profile,
                    person: {id: '' + user.id, email: user.email}
                  }
                });
              });
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

  patchPassword(userPasswordDTO: UserPasswordDTO): Observable<Response> {
    return this.http.patch('/api/user/password', userPasswordDTO);
  }

  getSuppressions(): Observable<UserNotificationSuppressionRepresentation[]> {
    return this.http.get('/api/user/suppressions').map(res => res.json());
  }

  setSuppression(resource: ResourceRepresentation<any>, suppressed: boolean, uuid?: string): Observable<Response> {
    const path = '/api/user/suppressions/' + resource.id + (uuid ? '?uuid=' + uuid : '');
    if (suppressed) {
      return this.http.post(path, {});
    }
    return this.http.delete(path);
  }

  setAllSuppressions(suppressed: boolean): Observable<Response> {
    if (suppressed) {
      return this.http.post('/api/user/suppressions', {});
    }
    return this.http.delete('/api/user/suppressions');
  }

  viewActivity(activity: ActivityRepresentation) {
    return this.http.get('/api/user/activities/' + activity.id).map(res => res.json());
  }

  dismissActivity(activity: ActivityRepresentation) {
    return this.http.delete('/api/user/activities/' + activity.id);
  }

  initializeUser() {
    return this.loadUser()
      .then(user => {
        if (user) {
          this.http.get('/api/user/activities')
            .subscribe(activities => {
              this.activities$.next(activities.json())
              this.activitiesSubscription = Observable
                .interval(50000)
                .startWith(0)
                .switchMap(() => this.http.get('/api/user/activities/refresh'))
                .subscribe(activities => this.activities$.next(activities.json()));
            });
        }
        return user;
      });
  }
}
