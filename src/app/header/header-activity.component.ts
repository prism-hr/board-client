import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  selector: 'b-header-activity',
  template: `
    <div [ngSwitch]="activity.activity">
      <div *ngSwitchCase="'JOIN_DEPARTMENT_REQUEST_ACTIVITY'" class="activity-item">
        <a [routerLink]="resourceLink.concat('users')" fragment="memberRequests" (click)="activityClicked(activity)">
          {{activity.userRole.user.givenName}} {{activity.userRole.user.surname}} has requested membership of {{resource.name}}
        </a>
      </div>
      <div *ngSwitchCase="'RESPOND_POST_ACTIVITY'" class="activity-item">
        <a [routerLink]="resourceLink.concat('responses')" (click)="activityClicked(activity)">
          {{activity.resourceEvent.user.givenName}} {{activity.resourceEvent.user.surname}} has responded to {{resource.name}}
        </a>
      </div>

      <!-- ELSE -->
      <div class="activity-item">
        <a [routerLink]="routerLink(resource)" (click)="activityClicked(activity)">
          <span *ngSwitchCase="'NEW_BOARD_PARENT_ACTIVITY'">
            New board created in {{parentResource.name}}
          </span>
          <span *ngSwitchCase="'NEW_BOARD_PARENT_ACTIVITY'">
            New board created in {{parentResource.name}}
          </span>
          <span *ngSwitchCase="'NEW_POST_PARENT_ACTIVITY'">
            New post '{{resource.name}}' in {{grandParentResource.name}} {{parentResource.name}}
          </span>
          <span *ngSwitchCase="'SUSPEND_POST_ACTIVITY'">
            New change request for post {{resource.name}}
          </span>
          <span *ngSwitchCase="'CORRECT_POST_ACTIVITY'">
            Post {{resource.name}} has been corrected
          </span>
          <span *ngSwitchCase="'JOIN_DEPARTMENT_ACTIVITY'">
            You have been added as a member of {{resource.name}}
          </span>
          <span *ngSwitchCase="'JOIN_BOARD_ACTIVITY'">
            You have been added as a member of {{parentResource.name}} {{resource.name}}
          </span>
          <span *ngSwitchCase="'ACCEPT_BOARD_ACTIVITY'">
            Your board {{parentResource.name}} {{resource.name}} has been accepted
          </span>
          <span *ngSwitchCase="'ACCEPT_POST_ACTIVITY'">
            Your post {{resource.name}} has been accepted
          </span>
          <span *ngSwitchCase="'PUBLISH_POST_ACTIVITY'">
            Your post {{resource.name}} has been published
          </span>
          <span *ngSwitchCase="'RETIRE_POST_ACTIVITY'">
            Your post {{resource.name}} has expired
          </span>
          <span *ngSwitchCase="'PUBLISH_POST_MEMBER_ACTIVITY'">
            New post '{{resource.name}}' in {{grandParentResource.name}} {{parentResource.name}}
          </span>
          <span *ngSwitchCase="'REJECT_BOARD_ACTIVITY'">
            Your board {{parentResource.name}} {{resource.name}} has been rejected
          </span>
          <span *ngSwitchCase="'RESTORE_BOARD_ACTIVITY'">
            Your board {{parentResource.name}} {{resource.name}} has been restored
          </span>
          <span *ngSwitchCase="'REJECT_POST_ACTIVITY'">
            Your post {{resource.name}} has been rejected
          </span>
          <span *ngSwitchCase="'RESTORE_POST_ACTIVITY'">
            Your post {{resource.name}} has been restored
          </span>
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

  get resource() {
    return this.activity.resource;
  }

  get parentResource() {
    if (this.resource.scope === 'POST') {
      return (<PostRepresentation>this.resource).board;
    } else if (this.resource.scope === 'BOARD') {
      return (<BoardRepresentation>this.resource).department;
    }
  }

  get grandParentResource() {
    if (this.resource.scope === 'POST') {
      return (<PostRepresentation>this.resource).board.department;
    }
  }

  get post() {
    return this.activity.resource;
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
