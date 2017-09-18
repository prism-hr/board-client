import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from '../../authentication/auth-guard.service';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import PostRepresentation = b.PostRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-apply',
  template: `
    <div class="post-apply">
      <div class="post-apply-title">
        <h4>Apply</h4>
      </div>
      <div class="post-apply-content">
        <div *ngIf="!user">
          <button pButton type="button" (click)="authenticate()" label="Log in to apply" class="ui-button-success">
          </button>
        </div>
        <div *ngIf="user">
          <div *ngIf="!canPursue">
            <b-post-apply-request-membership
              [department]="post.board.department" (requested)="membershipRequested()">
            </b-post-apply-request-membership>
          </div>
          <div *ngIf="canPursue">
            <div *ngIf="post.applyEmail">
              <div *ngIf="!post.response">
                <b-post-apply-form [post]="post" (applied)="postApplied()"></b-post-apply-form>
              </div>
              <div *ngIf="post.response">
                You already responded to this post.
              </div>
            </div>
            <div *ngIf="!post.applyEmail">
              <a pButton type="button" href="{{'api/posts/referrals/' + post.referral.referral}}" target="_blank"
                 class="ui-button-success small" (click)="referralCodeUsed()" label="How to Apply"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['post-apply.component.scss']
})
export class PostApplyComponent implements OnInit, OnChanges {

  @Input() post: PostRepresentation & {};
  user: UserRepresentation;
  canPursue: boolean;

  constructor(private userService: UserService, private resourceService: ResourceService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canPursue = this.resourceService.canPursue(this.post);
  }

  authenticate() {
    this.authGuard.ensureAuthenticated('register').first() // open dialog if not authenticated
      .flatMap(authenticated => {
        if (!authenticated) {
          return Observable.of(null);
        }
        return this.reloadPost();
      })
      .subscribe();
  }

  membershipRequested() {
    this.reloadPost().subscribe();
  }

  postApplied() {
    this.reloadPost().subscribe();
  }

  referralCodeUsed() {
    this.reloadPost().subscribe();
  }

  private reloadPost() {
    return this.resourceService.getResource('POST', this.post.id, {reload: true});
  }
}
