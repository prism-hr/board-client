import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;
import UserPatchDTO = b.UserPatchDTO;
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;

@Component({
  selector: 'b-account-notifications',
  template: `
    <ul class="board-block">
      <li *ngFor="let notification of notifications" class="board-subscription-item" fxLayout="row"
          fxLayoutAlign="space-between center">
        <div class="board-description">
          <h3><a [routerLink]="">{{notification.resource.name}}</a></h3>
          <h6><a [routerLink]="">{{notification.resource['department'].name}}</a></h6>
        </div>
        <div class="board-subscription-switch">
          <p-toggleButton [(ngModel)]="notification.enabled" styleClass="ui-button-info" onLabel="On"
                          offLabel="Off" (onChange)="notificationChanged(notification)" [disabled]="loading"></p-toggleButton>
        </div>
      </li>
    </ul>

    <hr class="hr">

    <div class="subscription-all" fxLayout="row" fxLayoutAlign="space-between center">
      <h3>All boards</h3>
      <p-toggleButton [(ngModel)]="allEnabled" styleClass="ui-button-info" onLabel="On" offLabel="Off"
                      (onChange)="allNotificationsChanged()" [disabled]="loading"></p-toggleButton>
    </div>
  `,
  styleUrls: ['./account-notifications.component.scss']
})
export class AccountNotificationsComponent implements OnChanges {

  @Input() suppressions: any;
  notifications: ExtendedSuppressionRepresentation[];
  allEnabled: boolean;
  loading: boolean;

  constructor(private userService: UserService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.notifications = this.suppressions;
    this.notifications.forEach(n => n.enabled = !n.suppressed);
    this.refreshAllButtonValue();
  }

  notificationChanged(suppression: ExtendedSuppressionRepresentation) {
    suppression.suppressed = !suppression.enabled;
    this.loading = true;
    this.userService.setSuppression(suppression.resource, suppression.suppressed)
      .subscribe(() => {
        this.loading = false;
        this.refreshAllButtonValue();
      });
  }

  allNotificationsChanged() {
    this.loading = true;
    this.userService.setAllSuppressions(!this.allEnabled)
      .subscribe(() => {
        this.notifications.forEach(n => {
          n.enabled = this.allEnabled;
          n.suppressed = !n.enabled;
        });
        this.loading = false;
      });
  }

  private refreshAllButtonValue() {
    this.allEnabled = this.notifications.every(n => n.enabled);
  }

}

interface ExtendedSuppressionRepresentation extends UserNotificationSuppressionRepresentation {
  enabled: boolean;
}
