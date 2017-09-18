import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from './auth-guard.service';
import {ResetPasswordDialogComponent} from './reset-password.dialog';

@Injectable()
export class RedirectGuard implements CanActivate {


  constructor(private dialog: MdDialog, private authGuard: AuthGuard) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = route.queryParamMap;
    const modalType = params.get('modal');
    let observable: Observable<boolean>;
    if (modalType === 'resetPassword') {
      const config = new MdDialogConfig();
      config.data = {uuid: params.get('uuid')};
      const dialogRef = this.dialog.open(ResetPasswordDialogComponent, config);
      observable = dialogRef.afterClosed().map(() => true); // activate no matter if password was successfully changed
    } else if (modalType) {
      observable = this.authGuard.ensureAuthenticated(modalType);
    } else {
      observable = Observable.of(true);
    }
    return observable;
  }

}
