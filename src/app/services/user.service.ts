import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {StompRService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {RollbarService} from '../rollbar/rollbar.service';
import {stompConfig} from './stomp.config';
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

  constructor(private http: HttpClient, private stompRService: StompRService,
              private rollbar: RollbarService, private auth: AuthService) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable();
    this.activities$ = new ReplaySubject<ActivityRepresentation[]>(1);
    // TODO logout after token expired
    // (<CustomJwtHttp><any>this.http).getSessionsExpiredSubject()
    //   .subscribe(() => {
    //     this.logout();
    //   });
  }

  ngOnInit(): void {

  }

  login(user: any): Promise<UserRepresentation> {
    return this.auth.login(user)
      .toPromise()
      .then(() => {
        return this.initializeUser();
      });
  }

  signup(user: any): Promise<UserRepresentation> {
    return this.auth.signup(user)
      .toPromise()
      .then((data) => {
        this.auth.setToken(data);
        return this.initializeUser();
      });
  }

  authenticate(name: string, userData?: any): Promise<UserRepresentation> {
    return this.auth.authenticate(name, userData)
      .toPromise()
      .then(() => {
        return this.initializeUser();
      });
  }

  logout() {
    this.stompRService.disconnect();
    this.auth.logout().toPromise()
      .then(() => {
        return this.loadUser();
      });
  }

  resetPassword(email: string) {
    return this.http.post('/api/auth/resetPassword', {email});
  }

  loadUser(): Promise<UserRepresentation> {
    return new Promise(resolve => {
      const token = this.auth.getToken();
      if (token) {
        this.http.get('/api/user')
          .subscribe((user: UserRepresentation) => {
            this.userSource.next(user);
            this.rollbar.configure({
              payload: {
                person: {id: '' + user.id, email: user.email}
              }
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
      .map(user => {
        this.loadUser();
        return user;
      });
  }

  patchPassword(userPasswordDTO: UserPasswordDTO) {
    return this.http.patch('/api/user/password', userPasswordDTO);
  }

  getSuppressions(): Observable<UserNotificationSuppressionRepresentation[]> {
    return this.http.get<UserNotificationSuppressionRepresentation[]>('/api/user/suppressions');
  }

  setSuppression(resource: ResourceRepresentation<any>, suppressed: boolean, uuid?: string) {
    const path = '/api/user/suppressions/' + resource.id + (uuid ? '?uuid=' + uuid : '');
    if (suppressed) {
      return this.http.post(path, {});
    }
    return this.http.delete(path);
  }

  setAllSuppressions(suppressed: boolean) {
    if (suppressed) {
      return this.http.post('/api/user/suppressions', {});
    }
    return this.http.delete('/api/user/suppressions');
  }

  viewActivity(activity: ActivityRepresentation) {
    return this.http.get('/api/user/activities/' + activity.id);
  }

  dismissActivity(activity: ActivityRepresentation) {
    return this.http.delete('/api/user/activities/' + activity.id);
  }

  isUserInitializationPending() {
    return this.stompRService.state.getValue() === 0; // StompState is CLOSED
  }

  initializeUser() {
    return this.loadUser()
      .then(user => {
        if (user) {
          const config = {...stompConfig};
          config.headers = {
            Authorization: 'Bearer ' + this.auth.getToken()
          };
          this.stompRService.config = config;
          this.stompRService.initAndConnect();
          let stomp_subscription = this.stompRService.subscribe('/api/user/activities');

          stomp_subscription.subscribe((message: Message) => {
            this.activities$.next(JSON.parse(message.body));
          });
        }
        return user;
      });
  }

}
