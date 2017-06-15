import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthenticationDialogComponent} from './authentication.dialog';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {AuthService} from 'ng2-ui-auth';
import {ResourceService} from '../services/resource.service';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private dialog: MdDialog, private authService: AuthService,
              private resourceService: ResourceService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.ensureAuthenticated(route.data.showRegister).first();
  }

  ensureAuthenticated(showRegister?: boolean): Observable<boolean> {
    if (this.authService.getToken()) {
      return Observable.of(true);
    } else {
      const config = new MdDialogConfig();
      config.data = {showRegister};
      const dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
      return dialogRef.afterClosed();
    }
  }

  requestSecuredEndpoint<T>(endpointCall: () => Observable<T>): Observable<T> {
    return endpointCall()
      .catch(error => {
        if (error.status === 401) {
          return this.ensureAuthenticated()
            .mergeMap(loggedIn => {
              if (loggedIn) {
                return endpointCall();
              } else {
                this.router.navigate(['/']);
              }
            });
        }
      });
  }
}
