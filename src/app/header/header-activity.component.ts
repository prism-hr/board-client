import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  selector: 'b-header-activity',
  template: `
    <div [ngSwitch]="activity.activity">
      <div *ngSwitchCase="'SUSPEND_POST_ACTIVITY'">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          New change request for post {{activity.resource.name}}
        </a>
      </div>
      <div *ngSwitchCase="'CORRECT_POST_ACTIVITY'">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          The post {{activity.resource.name}} has been corrected. Please revise it
        </a>
      </div>
      <div *ngSwitchCase="'JOIN_DEPARTMENT_REQUEST_ACTIVITY'">
        {{activity.userRole.user.givenName}} {{activity.userRole.user.surname}} has requested membership for
        {{activity.resource.name}}
        <button pButton class="ui-button-success" label="Accept"></button>
        <button pButton class="ui-button-warning" label="Reject"></button>
      </div>
      <div *ngSwitchDefault>
        Unhandled activity: {{activity.activity}}
      </div>
    </div>`,
  styleUrls: ['./header.component.scss']
})
export class HeaderActivityComponent implements OnInit {

  @Input() activity: ActivityRepresentation & {};

  constructor(private userService: UserService, private resourceService: ResourceService) {
  }

  ngOnInit(): void {
  }

  activityClicked(activity: ActivityRepresentation) {
    this.userService.dismissActivity(activity).subscribe();
  }

  routerLink(resource: ResourceRepresentation<any>) {
    return this.resourceService.routerLink(resource);
  }
}