import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  selector: 'b-header-activity',
  template: `
<div [ngSwitch]="activity.activity">
      <div *ngSwitchCase="'NEW_BOARD_PARENT_ACTIVITY'">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          New board created in {{(activity.resource as BoardRepresentation).department.name}}
        </a>
      </div>
      <div *ngSwitchCase="'NEW_POST_PARENT_ACTIVITY'">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
         New post '{{activity.resource.name}}' in {{(activity.resource as PostRepresentation).board.department.name}} {{(activity.resource as PostRepresentation).board.name}}
        </a>
      </div>
      <div *ngSwitchCase="'SUSPEND_POST_ACTIVITY'">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          New change request for post {{activity.resource.name}}
        </a>
      </div>
      <div *ngSwitchCase="'CORRECT_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          Post {{activity.resource.name}} has been corrected
        </a>
      </div>
      <div *ngSwitchCase="'JOIN_DEPARTMENT_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          You have been added as a member of {{activity.resource.name}}
        </a>
      </div>
      <div *ngSwitchCase="'JOIN_BOARD_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          You have been added as a member of {{(activity.resource as BoardRepresentation).department.name}} {{activity.resource.name}}
        </a>
      </div>
      <div *ngSwitchCase="'ACCEPT_BOARD_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          Your board {{(activity.resource as BoardRepresentation).department.name}} {{activity.resource.name}} has been accepted
        </a>
      </div>
      <div *ngSwitchCase="'ACCEPT_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          Your post {{activity.resource.name}} has been accepted
        </a>
      </div>
      <div *ngSwitchCase="'PUBLISH_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          Your post {{activity.resource.name}} has been published
        </a>
      </div>
      <div *ngSwitchCase="'RETIRE_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
          Your post {{activity.resource.name}} has expired
        </a>
      </div>
      <div *ngSwitchCase="'PUBLISH_POST_MEMBER_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
         New post '{{activity.resource.name}}' in {{(activity.resource as PostRepresentation).board.department.name}} {{(activity.resource as PostRepresentation).board.name}}
        </a>
      </div>
      <div *ngSwitchCase="'JOIN_DEPARTMENT_REQUEST_ACTIVITY'" class="activity-item">
        <a [routerLink]="resourceLink.concat('users')" fragment="memberRequests" (click)="activityClicked(activity)">
          {{activity.userRole.user.givenName}} {{activity.userRole.user.surname}} has requested membership of {{activity.resource.name}}
        </a>
      </div>
      <div *ngSwitchCase="'REJECT_BOARD_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
         Your board {{(activity.resource as BoardRepresentation).department.name}} {{activity.resource.name}} has been rejected
        </a>
      </div>
      <div *ngSwitchCase="'RESTORE_BOARD_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
         Your board {{(activity.resource as BoardRepresentation).department.name}} {{activity.resource.name}} has been restored
        </a>
      </div>
      <div *ngSwitchCase="'REJECT_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
         Your post {{activity.resource.name}} has been rejected
        </a>
      </div>
      <div *ngSwitchCase="'REJECT_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="routerLink(activity.resource)" (click)="activityClicked(activity)">
         Your post {{activity.resource.name}} has been restored
        </a>
      </div>
      <div *ngSwitchCase="'RESPOND_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="resourceLink.concat('responses')" (click)="activityClicked(activity)">
          {{activity.resourceEvent.user.givenName}} {{activity.resourceEvent.user.surname}} has responded to {{activity.resource.name}}
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
    this.userService.dismissActivity(activity).subscribe(() => {
      this.dismissed.emit(activity);
    });
  }

  routerLink(resource: ResourceRepresentation<any>) {
    return this.resourceService.routerLink(resource);
  }
}
