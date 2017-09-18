import {Injectable} from '@angular/core';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {ActivatedRouteSnapshot, CanActivate, ParamMap, Router} from '@angular/router';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {AuthenticationDialogComponent} from './authentication.dialog';
import {ResetPasswordDialogComponent} from './reset-password.dialog';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private dialog: MdDialog, private authService: AuthService, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.ensureAuthenticated(route.data.modalType || 'login').first();
  }

  ensureAuthenticated(modalType: string): Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      return Observable.of(true);
    } else {
      this.userService.logout().subscribe();
      const config = new MdDialogConfig();
      config.data = {showRegister: modalType === 'register'};
      const dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
      return dialogRef.afterClosed();
    }
  }

  requestSecuredEndpoint<T>(endpointCall: () => Observable<T>, paramMap: ParamMap): Observable<T> {
    const modal = paramMap.get('modal');
    return endpointCall()
      .catch((error: Response) => {
        if (error.status === 401) {
          return this.ensureAuthenticated(modal)
            .mergeMap(loggedIn => {
              if (loggedIn) {
                return endpointCall();
              } else {
                this.router.navigate(['/']);
                return Observable.of(null);
              }
            });
        }
      });
  }

  showInitialModalIfNecessary(paramMap: ParamMap): void {
    const modal = paramMap.get('modal');
    if (modal === 'register' || modal === 'login') {
      this.ensureAuthenticated(modal).subscribe();
    } else if (modal === 'resetPassword') {
      const config = new MdDialogConfig();
      config.data = {uuid: paramMap.get('uuid')};
      this.dialog.open(ResetPasswordDialogComponent, config);
    }
  }

}
