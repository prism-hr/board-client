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
      <div *ngSwitchCase="'JOIN_DEPARTMENT_REQUEST_ACTIVITY'" class="activity-inner">
        <a [routerLink]="resourceLink.concat('users')" fragment="memberRequests"
           (click)="activityClicked(activity)" class="activity-w-icon">
          <b-image [publicId]="activity.userRole.user.documentImage?.cloudinaryId"
                   gravity="face" width="50" height="50" radius="max" crop="thumb"></b-image>
          <div class="activity-copy">
            <b>{{activity.userRole.user.givenName}} {{activity.userRole.user.surname}}</b>
            <span>has requested membership of <b>{{resource.name}}</b></span>
            <p>{{activity.createdTimestamp | date: 'short' }}</p>
          </div>
        </a>
      </div>
      <div *ngSwitchCase="'RESPOND_POST_ACTIVITY'" class="activity-inner">
        <a [routerLink]="resourceLink.concat('responses')"
           (click)="activityClicked(activity)" class="activity-w-icon">
          <b-image [publicId]="activity.resourceEvent.user.documentImage?.cloudinaryId"
                   gravity="face" width="50" height="50" radius="max" crop="thumb"></b-image>
          <div class="activity-copy">
            <b>{{activity.resourceEvent.user.givenName}} {{activity.resourceEvent.user.surname}}</b>
            <span>has responded to <b>{{resource.name}}</b></span>
            <p>{{activity.createdTimestamp | date: 'short' }}</p>
          </div>
        </a>
      </div>

      <!-- ELSE -->
      <div class="activity-inner">
        <a [routerLink]="routerLink(resource)" (click)="activityClicked(activity)">
          <div class="activity-w-icon"
               *ngIf="activity.activity != 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' && activity.activity != 'RESPOND_POST_ACTIVITY'">
            <b-image [publicId]="resource.department.documentLogo?.cloudinaryId"
                     gravity="face" width="50" height="50" crop="thumb"></b-image>
            <div class="activity-copy">
              <span *ngSwitchCase="'NEW_BOARD_PARENT_ACTIVITY'">
                New board created in <b>{{parentResource.name}}</b>
              </span>
              <span *ngSwitchCase="'NEW_POST_PARENT_ACTIVITY'">
                New post <b>'{{resource.name}}'</b> in {{grandParentResource.name}} {{parentResource.name}}
              </span>
              <span *ngSwitchCase="'SUSPEND_POST_ACTIVITY'">
                New change request for post <b>{{resource.name}}</b>
              </span>
              <span *ngSwitchCase="'CORRECT_POST_ACTIVITY'">
                Post <b>{{resource.name}}</b> has been corrected
              </span>
              <span *ngSwitchCase="'JOIN_DEPARTMENT_ACTIVITY'">
                You have been added as a member of <b>{{resource.name}}</b>
              </span>
              <span *ngSwitchCase="'JOIN_BOARD_ACTIVITY'">
                You have been added as a member of <b>{{parentResource.name}} {{resource.name}}</b>
              </span>
              <span *ngSwitchCase="'ACCEPT_BOARD_ACTIVITY'">
                Your board <b>{{resource.name}}</b> in <b>{{parentResource.name}}</b> has been accepted
              </span>
              <span *ngSwitchCase="'ACCEPT_POST_ACTIVITY'">
                Your post <b>{{resource.name}}</b> has been accepted
              </span>
              <span *ngSwitchCase="'PUBLISH_POST_ACTIVITY'">
                Your post <b>{{resource.name}}</b> has been published
              </span>
              <span *ngSwitchCase="'RETIRE_POST_ACTIVITY'">
                Your post <b>{{resource.name}}</b> has expired
              </span>
              <span *ngSwitchCase="'PUBLISH_POST_MEMBER_ACTIVITY'">
                New post <b>'{{resource.name}}'</b> in <b>{{grandParentResource.name}} {{parentResource.name}}</b>
              </span>
              <span *ngSwitchCase="'REJECT_BOARD_ACTIVITY'">
                Your board <b>{{parentResource.name}}</b> in <b>{{resource.name}}</b> has been rejected
              </span>
              <span *ngSwitchCase="'RESTORE_BOARD_ACTIVITY'">
                Your board <b>{{resource.name}}</b> in <b>{{parentResource.name}} </b> has been restored
              </span>
              <span *ngSwitchCase="'REJECT_POST_ACTIVITY'">
                Your post <b>{{resource.name}}</b> has been rejected
              </span>
              <span *ngSwitchCase="'RESTORE_POST_ACTIVITY'">
                Your post <b>{{resource.name}}</b> has been restored
              </span>
              <p *ngIf="activity.activity != 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' && activity.activity != 'RESPOND_POST_ACTIVITY'">
                {{activity.createdTimestamp | date: 'short' }}
              </p>
            </div>
          </div>
        </a>
      </div>

      <div *ngSwitchDefault class="activity">
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
