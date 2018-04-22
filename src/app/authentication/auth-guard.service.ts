import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRouteSnapshot, CanActivate, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {first} from 'rxjs/operators';
import {UserAuthenticationOutcome, UserService} from '../services/user.service';
import {AuthenticationDialogComponent, AuthenticationDialogData, AuthenticationView} from './authentication.dialog';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private dialog: MatDialog, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.ensureAuthenticated({initialView: route.data.modalView}).first()
      .map(outcome => !!outcome);
  }

  ensureAuthenticated(options: { initialView?: AuthenticationView, uuid?: string }): Observable<UserAuthenticationOutcome> {
    if (this.userService.isAuthenticated()) {
      return this.userService.user$.map(user => ({user})).pipe(first());
    } else {
      this.userService.logout();
      const inviteeObservable = options.uuid ? this.userService.getInvitee(options.uuid) : Observable.of(null);
      return inviteeObservable
        .switchMap(user => {
          const config = new MatDialogConfig<AuthenticationDialogData>();
          const initialView = options.initialView || (user && user.registered ? 'LOGIN' : 'REGISTER');
          config.data = {initialView: initialView, uuid: options.uuid, user};
          config.disableClose = !!user;
          const dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
          return dialogRef.afterClosed();
        });
    }
  }

  requestSecuredEndpoint<T>(endpointCall: () => Observable<T>): Observable<T> {
    return endpointCall()
      .catch((error: Response) => {
        if (error.status === 401) {
          return this.ensureAuthenticated({})
            .mergeMap(loggedIn => {
              if (loggedIn) {
                return endpointCall();
              } else {
                this.router.navigate(['/']);
                return Observable.of(null);
              }
            });
        }
        throw error;
      });
  }

}
