import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import ActivityRepresentation = b.ActivityRepresentation;

@Component({
  selector: 'b-header-activity',
  template: `
    <div [ngSwitch]="activity.activity" [ngClass]="{viewed: activity.viewed}">
      <div *ngSwitchCase="'JOIN_DEPARTMENT_REQUEST_ACTIVITY'" class="activity-inner">
        <a [routerLink]="resourceLink + '/users'" fragment="memberRequests"
           (click)="activityClicked(activity)" class="activity-w-icon user">
          <b-image *ngIf="activity.image" [publicId]="activity.image"
                   gravity="face" width="50" height="50" radius="max" crop="thumb"></b-image>
          <div class="avatar" *ngIf="!activity.image">
            <span><i class="fa-user"></i></span>
          </div>
          <div class="activity-copy">
            <b>{{activity.givenName}} {{activity.surname}}</b>
            <span>has requested membership of <b>{{resourceName}}</b></span>
            <p>{{activity.createdTimestamp | date: 'short' }}</p>
          </div>
        </a>
        <button pButton type="button" (click)="activityDismissed(activity)" icon="fa-close"></button>
      </div>
      <div *ngSwitchCase="'RESPOND_POST_ACTIVITY'" class="activity-inner">
        <a [routerLink]="resourceLink + '/responses'"
           (click)="activityClicked(activity)" class="activity-w-icon user">
          <div class="avatar">
            <span><i class="fa-user"></i></span>
          </div>
          <div class="activity-copy">
            Someone
            (<b>{{'definitions.gender.' + activity.gender | translate}},
            {{'definitions.ageRange.' + activity.ageRange | translate}}</b>)
            <span *ngIf="activity.location">
              from <b>{{activity.location}}</b>
            </span>
            <span>has responded to <b>{{resourceName}}</b></span>
            <p>{{activity.createdTimestamp | date: 'short' }}</p>
          </div>
        </a>
        <button pButton type="button" (click)="activityDismissed(activity)" icon="fa-close"></button>
      </div>

      <!-- ELSE -->
      <div *ngIf="activity.activity != 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' && activity.activity != 'RESPOND_POST_ACTIVITY'"
           class="activity-inner">
        <a [routerLink]="resourceLink" (click)="activityClicked(activity)">
          <div class="activity-w-icon">
            <div class="logo-holder-activity" [ngClass]="{'default-logo': !activity.image}">
              <b-image [publicId]="activity.image"
                       gravity="face" width="50" height="50" crop="thumb"></b-image>
            </div>
            <div class="activity-copy">
              <span *ngSwitchCase="'NEW_BOARD_PARENT_ACTIVITY'">
                New board created in <b>{{activity.department}}</b>
              </span>
              <span *ngSwitchCase="'NEW_POST_PARENT_ACTIVITY'">
                New post <b>'{{activity.post}}'</b> in {{activity.department}} {{activity.board}}
              </span>
              <span *ngSwitchCase="'SUSPEND_POST_ACTIVITY'">
                New revision request for post <b>{{activity.post}}</b>
              </span>
              <span *ngSwitchCase="'CORRECT_POST_ACTIVITY'">
                Post <b>{{activity.post}}</b> has been revised
              </span>
              <span *ngSwitchCase="'JOIN_DEPARTMENT_ACTIVITY'">
                You have been added as a member of <b>{{activity.department}}</b>
              </span>
              <span *ngSwitchCase="'JOIN_BOARD_ACTIVITY'">
                You have been added as a member of <b>{{activity.department}} {{activity.board}}</b>
              </span>
              <span *ngSwitchCase="'ACCEPT_BOARD_ACTIVITY'">
                Your board <b>{{activity.board}}</b> in <b>{{activity.department}}</b> has been accepted
              </span>
              <span *ngSwitchCase="'ACCEPT_POST_ACTIVITY'">
                Your post <b>{{activity.post}}</b> has been accepted
              </span>
              <span *ngSwitchCase="'PUBLISH_POST_ACTIVITY'">
                Your post <b>{{activity.post}}</b> has been published
              </span>
              <span *ngSwitchCase="'RETIRE_POST_ACTIVITY'">
                Your post <b>{{activity.post}}</b> has expired
              </span>
              <span *ngSwitchCase="'PUBLISH_POST_MEMBER_ACTIVITY'">
                New post <b>'{{activity.post}}'</b> in <b>{{activity.department}} {{activity.board}}</b>
              </span>
              <span *ngSwitchCase="'REJECT_BOARD_ACTIVITY'">
                Your board <b>{{activity.board}}</b> in <b>{{activity.department}}</b> has been rejected
              </span>
              <span *ngSwitchCase="'RESTORE_BOARD_ACTIVITY'">
                Your board <b>{{activity.board}}</b> in <b>{{activity.department}} </b> has been restored
              </span>
              <span *ngSwitchCase="'REJECT_POST_ACTIVITY'">
                Your post <b>{{activity.post}}</b> has been rejected
              </span>
              <span *ngSwitchCase="'RESTORE_POST_ACTIVITY'">
                Your post <b>{{activity.post}}</b> has been restored
              </span>
              <span *ngSwitchCase="'CREATE_TASK_ACTIVITY'">
                You have pending tasks for your department <b>{{activity.department}}</b>
              </span>
              <p *ngIf="activity.activity != 'JOIN_DEPARTMENT_REQUEST_ACTIVITY' && activity.activity != 'RESPOND_POST_ACTIVITY'">
                {{activity.createdTimestamp | date: 'short' }}
              </p>
            </div>
          </div>
        </a>
        <button pButton type="button" (click)="activityDismissed(activity)" icon="fa-close"></button>
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
  @Output() viewed: EventEmitter<ActivityRepresentation> = new EventEmitter();
  resourceLink: string;

  constructor(private userService: UserService, private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.resourceLink = '/' + this.activity.resourceHandle;
  }

  activityClicked(activity: ActivityRepresentation) {
    this.userService.viewActivity(activity).subscribe(() => {
      activity.viewed = true;
      this.viewed.emit(activity);
    });
  }

  activityDismissed(activity: ActivityRepresentation) {
    this.userService.dismissActivity(activity).subscribe(() => {
      this.dismissed.emit(activity);
    });
  }

  get resourceName() {
    const scope = this.activity.resourceScope;
    return this.activity[scope.toLowerCase()];
  }
}
