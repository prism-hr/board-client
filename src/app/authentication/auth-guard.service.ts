import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRouteSnapshot, CanActivate, ParamMap, Router} from '@angular/router';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {AuthenticationDialogComponent, AuthenticationDialogData} from './authentication.dialog';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private dialog: MatDialog, private authService: AuthService, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.ensureAuthenticated({modalType: route.data.modalType || 'Login'}).first();
  }

  ensureAuthenticated(options: { modalType: string, uuid?: string }): Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      return Observable.of(true);
    } else {
      this.userService.logout();
      const config = new MatDialogConfig();
      const dialogData: AuthenticationDialogData = {showRegister: options.modalType === 'Register', uuid: options.uuid};
      config.data = dialogData;
      const dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
      return dialogRef.afterClosed();
    }
  }

  requestSecuredEndpoint<T>(endpointCall: () => Observable<T>, paramMap: ParamMap): Observable<T> {
    const modalType = paramMap.get('modal');
    return endpointCall()
      .catch((error: Response) => {
        if (error.status === 401) {
          return this.ensureAuthenticated({modalType})
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
