import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthenticationDialogComponent} from './authentication.dialog';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private dialog: MdDialog, private stormpath: Stormpath) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.ensureAuthenticated(false);
  }

  ensureAuthenticated(showRegister: boolean): Observable<boolean> {
    return this.stormpath.user$.flatMap(user => {
      if (!user) {
        const config = new MdDialogConfig();
        config.data = {showRegister};
        const dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
        return dialogRef.afterClosed();
      }
      return Observable.of(true);
    });
  }
}
