import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {MatDialogConfig} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {from, Observable} from 'rxjs';
import {switchMap} from 'rxjs/internal/operators';
import {map} from 'rxjs/operators';
import {UserAuthenticationOutcome, UserService} from '../services/user.service';
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
    let observable: Observable<boolean | UserAuthenticationOutcome>;

    if (uuid || resetPasswordUuid || unsubscribeUuid) {
      this.userService.logout();
    }

    if (uuid || resetPasswordUuid) {
      // removing UUID from URL
      let path: string = Utils.removeURLParameter(this.location.path(), 'uuid');
      path = Utils.removeURLParameter(path, 'resetPasswordUuid');
      // we have to replace current state as well as redirect (redirection will happen after current method is finished)
      this.location.replaceState(path);
      this.router.navigate([path.slice(1)], {replaceUrl: true, fragment: route.fragment});
    }

    if (resetPasswordUuid) {
      const config = new MatDialogConfig();
      config.data = {resetPasswordUuid};
      const dialogRef = this.dialog.open(ResetPasswordDialogComponent, config);
      observable = dialogRef.afterClosed()
        .pipe(
          switchMap(passwordChanged => {
            if (passwordChanged) {
              return this.authGuard.ensureAuthenticated({initialView: 'LOGIN'})
            }
          }),
          map(() => true)); // activate no matter if password was successfully changed
    } else if (uuid) {
      observable = this.authGuard.ensureAuthenticated({uuid});
    } else {
      observable = from(this.userService.initializeUser());
    }
    return observable
      .pipe(map(result => !!result));
  }

}
