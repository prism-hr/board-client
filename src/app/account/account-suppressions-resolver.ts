import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;

@Injectable()
export class AccountSuppressionsResolver implements Resolve<UserNotificationSuppressionRepresentation[]> {

  constructor(private userService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UserNotificationSuppressionRepresentation[]> {
    return this.userService.getSuppressions();
  }

}
