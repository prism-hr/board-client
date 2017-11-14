import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {AuthGuard} from './auth-guard.service';
import {ResetPasswordDialogComponent} from './reset-password.dialog';

@Injectable()
export class InitializeGuard implements CanActivate {


  constructor(private dialog: MatDialog, private authGuard: AuthGuard, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = route.queryParamMap;
    const modalType = params.get('modal');
    const uuid = params.get('uuid');
    let observable: Observable<boolean>;

    if (modalType) {
      this.userService.logout();
    } else {
      this.userService.initializeUser();
    }

    if (modalType === 'resetPassword') {
      const config = new MatDialogConfig();
      config.data = {uuid};
      const dialogRef = this.dialog.open(ResetPasswordDialogComponent, config);
      observable = dialogRef.afterClosed()
        .flatMap(passwordChanged => {
          if (passwordChanged) {
            return this.authGuard.ensureAuthenticated({modalType: 'login'})
          }
          return Observable.of(true);
        }).map(() => true); // activate no matter if password was successfully changed

    } else if (modalType === 'register' || modalType === 'login') {
      observable = this.authGuard.ensureAuthenticated({modalType, uuid});
    } else {
      observable = Observable.of(true);
    }
    return observable;
  }

}
