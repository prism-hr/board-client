import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationDialogComponent} from './authentication.dialog';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {AuthService} from 'ng2-ui-auth';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private dialog: MdDialog, private authService: AuthService) {
  }

  canActivate(): Observable<boolean> {
    return this.ensureAuthenticated(false).first();
  }

  ensureAuthenticated(showRegister: boolean): Observable<boolean> {
    if (this.authService.getToken()) {
      return Observable.of(true);
    } else {
      const config = new MdDialogConfig();
      config.data = {showRegister};
      const dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
      return dialogRef.afterClosed();
    }
  }
}
