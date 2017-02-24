import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationDialog} from './authentication.dialog';
import {MdDialogConfig, MdDialogRef, MdDialog} from '@angular/material';
import {Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private dialog: MdDialog, private stormpath: Stormpath) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.stormpath.user$.flatMap(user => {
      if (!user) {
        let dialogRef: MdDialogRef<AuthenticationDialog>;
        let config = new MdDialogConfig();
        dialogRef = this.dialog.open(AuthenticationDialog, config);
        return dialogRef.afterClosed();
      }
      return Observable.of(true);
    });
  }
}
