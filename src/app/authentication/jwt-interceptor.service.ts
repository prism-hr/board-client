import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigService, SharedService} from 'ng2-ui-auth';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class CustomJwtInterceptor implements HttpInterceptor {
  constructor(private shared: SharedService,
              private config: ConfigService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {authHeader, authToken} = this.config.options;
    const token = this.shared.getToken();
    const isAuthenticated = this.shared.isAuthenticated();
    const newReq = isAuthenticated && !req.headers.has(authHeader)
      ? req.clone({setHeaders: {[authHeader]: `${authToken} ${token}`}})
      : req;
    return next.handle(newReq)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if(event.headers.has('Authorization')) {
              const newToken = event.headers.get('Authorization').replace('Bearer ', '');
              this.shared.setToken(newToken);
            }
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // redirect to the login route
              // or show a modal
            }
          }
        }));

  }

}
