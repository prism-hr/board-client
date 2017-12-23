import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {MatDialogConfig} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {Utils} from '../services/utils';
import {AuthGuard} from './auth-guard.service';
import {ResetPasswordDialogComponent} from './reset-password.dialog';

@Injectable()
export class InitializeGuard implements CanActivate {

  constructor(private location: Location, private router: Router, private dialog: MatDialog, private authGuard: AuthGuard,
              private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = route.queryParamMap;
    const uuid = params.get('uuid');
    const resetPasswordUuid = params.get('resetPasswordUuid');
    const unsubscribeUuid = params.get('unsubscribeUuid');
    let observable: Observable<boolean>;

    if (uuid || resetPasswordUuid || unsubscribeUuid) {
      this.userService.logout();
    }

    if (uuid || resetPasswordUuid) {
      // removing UUID from URL
      let path: string = Utils.removeURLParameter(this.location.path(), 'uuid');
      path = Utils.removeURLParameter(path, 'resetPasswordUuid');
      // we have to replace current state as well as redirect (redirection will happen after current method is finished)
      this.location.replaceState(path);
      state.url = path;
      this.router.navigate([path.slice(1)]);
    } else {
      if (this.userService.isUserInitializationPending()) {
        this.userService.initializeUser();
      }
    }

    if (resetPasswordUuid) {
      const config = new MatDialogConfig();
      config.data = {resetPasswordUuid};
      const dialogRef = this.dialog.open(ResetPasswordDialogComponent, config);
      observable = dialogRef.afterClosed()
        .flatMap(passwordChanged => {
          if (passwordChanged) {
            return this.authGuard.ensureAuthenticated({initialView: 'LOGIN'})
          }
          return Observable.of(true);
        }).map(() => true); // activate no matter if password was successfully changed
    } else if (uuid) {
      observable = this.authGuard.ensureAuthenticated({uuid});
    } else {
      observable = Observable.of(true);
    }
    return observable;
  }

}
