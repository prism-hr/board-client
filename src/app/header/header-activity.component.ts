import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
      <div *ngSwitchCase="'CORRECT_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          The post {{activity.resource.name}} has been corrected. Please revise it
        </a>
      </div>
      <div *ngSwitchCase="'JOIN_DEPARTMENT_REQUEST_ACTIVITY'" class="activity-item">
        <a [routerLink]="resourceLink.concat('users')" fragment="memberRequests" (click)="activityClicked(activity)">
          {{activity.userRole.user.givenName}} {{activity.userRole.user.surname}} has requested membership for
          {{activity.resource.name}}
        </a>
      </div>
      <div *ngSwitchDefault class="activity-item">
        Unhandled activity: {{activity.activity}}
      </div>
    </div>`,
  styleUrls: ['./header.component.scss']
})
export class HeaderActivityComponent implements OnInit {

  @Input() activity: ActivityRepresentation & {};
  @Output() dismissed: EventEmitter<ActivityRepresentation> = new EventEmitter();
  resourceLink: any[];

  constructor(private userService: UserService, private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    const resource = this.activity.resource;
    this.resourceLink = this.resourceService.routerLink(resource);
  }

  activityClicked(activity: ActivityRepresentation) {
    // this.userService.dismissActivity(activity).subscribe(() => {
    // });
    this.dismissed.emit(activity);
  }

  routerLink(resource: ResourceRepresentation<any>) {
    return this.resourceService.routerLink(resource);
  }
}
