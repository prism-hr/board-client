import {HttpClient} from '@angular/common/http';
import {Injectable, NgZone, OnInit} from '@angular/core';
import {AuthService} from 'ng2-ui-auth';
import * as Pusher from 'pusher-js';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {distinctUntilChanged} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {RollbarService} from '../rollbar/rollbar.service';
import {ResourceService} from './resource.service';
import ActivityRepresentation = b.ActivityRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PusherAuthenticationDTO = b.PusherAuthenticationDTO;
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
  departments$: ReplaySubject<DepartmentRepresentation[]>;
  pusher: Pusher;

  constructor(private http: HttpClient, private zone: NgZone, private rollbar: RollbarService, private auth: AuthService,
              private resourceService: ResourceService) {
    this.userSource = new ReplaySubject<UserRepresentation>(1);
    this.user$ = this.userSource.asObservable().pipe(distinctUntilChanged());
    this.activities$ = new ReplaySubject<ActivityRepresentation[]>(1);
    this.departments$ = new ReplaySubject<DepartmentRepresentation[]>(1);
    // TODO logout after token expired
    // (<CustomJwtHttp><any>this.http).getSessionsExpiredSubject()
    //   .subscribe(() => {
    //     this.logout();
    //   });

    this.pusher = this.zone.runOutsideAngular(() => {
      return new Pusher('ec7ba70c43883cc8964d', {
        cluster: 'eu',
        authorizer: (channel, options) => {
          return {
            authorize: (socketId, callback) => {
              const pusherAuthDTO: PusherAuthenticationDTO = {socket_id: socketId, channel_name: channel.name};
              this.http.post('/api/pusher/authenticate', pusherAuthDTO)
                .subscribe(authInfo => {
                  callback(false, authInfo);
                });
            }
          };
        }
      });
    });
  }

  ngOnInit(): void {

  }

  login(user: any): Promise<UserAuthenticationOutcome> {
    return this.auth.login(user)
      .toPromise()
      .then(() => {
        return this.initializeUser();
      });
  }

  signup(user: any): Promise<UserAuthenticationOutcome> {
    return this.auth.signup(user)
      .toPromise()
      .then((data) => {
        this.auth.setToken(data);
        return this.initializeUser();
      });
  }

  authenticate(name: string, userData?: any): Promise<UserAuthenticationOutcome> {
    return this.auth.authenticate(name, userData)
      .toPromise()
      .then(() => {
        return this.initializeUser();
      });
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  logout() {
    this.pusher.subscribeAll();
    this.auth.logout()
      .subscribe(() => {
        return this.loadUser();
      });
  }

  resetPassword(email: string) {
    return this.http.post('/api/auth/resetPassword', {email});
  }

  getInvitee(invitationUuid: string): Observable<UserRepresentation> {
    return this.http.get<UserRepresentation>('/api/auth/invitee/' + invitationUuid);
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

  initializeUser(): Promise<UserAuthenticationOutcome> {
    return this.loadUser()
      .then(user => {
        if (user) {
          const initialUserData = combineLatest(this.resourceService.getResources('DEPARTMENT'), this.http.get<ActivityRepresentation[]>('/api/user/activities/'))
            .map(([departments, activities]) => {
              this.departments$.next(departments);
              this.activities$.next(activities);
              return {departments, activities, user};
            }).share();

          initialUserData.subscribe(() => {
            this.zone.runOutsideAngular(() => {
              const channel = this.pusher.subscribe('presence-activities-' + user.id);
              channel.bind('activities', activities => {
                this.zone.run(() => {
                  this.activities$.next(activities);
                });
              });
            });
          });
          return initialUserData.toPromise();
        }
        return Promise.resolve({user});
      });
  }

}

export interface UserAuthenticationOutcome {
  user: UserRepresentation;
  departments?: DepartmentRepresentation[];
  activities?: ActivityRepresentation[];
}
