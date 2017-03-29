import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationDialog} from './authentication.dialog';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private dialog: MdDialog, private stormpath: Stormpath) {
  }

  canActivate(): Observable<boolean> {
    return this.ensureAuthenticated(false);
  }

  ensureAuthenticated(showRegister: boolean): Observable<boolean> {
    return this.stormpath.user$.flatMap(user => {
      if (!user) {
        const config = new MdDialogConfig();
        config.data = {showRegister};
        const dialogRef = this.dialog.open(AuthenticationDialog, config);
        return dialogRef.afterClosed();
      }
      return Observable.of(true);
    });
  }
}
