import {Component, Input, OnInit} from '@angular/core';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from '../../authentication/auth-guard.service';
import {DepartmentRequestMembershipDialogComponent} from '../../departments/request-membership/department-request-membership.dialog';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import {PostService} from '../post.service';
import {PostApplyDialogComponent} from './post-apply.dialog';
import PostRepresentation = b.PostRepresentation;
import ResourceEventRepresentation = b.ResourceEventRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-apply',
  template: `
    <div class="post-apply">
      <div *ngIf="!post?.response" class="post-apply-content">
        <!--<div *ngIf="!post.applyDocument && !post.applyWebsite">-->
        <button pButton type="button" (click)="apply(post)" label="Apply" class="ui-button-success"></button>
        <!--</div>-->
        <!--<div *ngIf="post.applyDocument">-->
        <!--<a pButton type="button" href="{{post.applyDocument.cloudinaryUrl}}" download class="ui-button-success small"-->
        <!--label="Download apply instructions"></a>-->
        <!--</div>-->
        <!--<div *ngIf="post.applyWebsite">-->
        <!--<a pButton type="button" href="{{post.applyWebsite}}" target="_blank" class="ui-button-success small"-->
        <!--label="Open apply website"></a>-->
        <!--</div>-->
      </div>
      <div *ngIf="post?.response">
        You already responded to this post.
      </div>
    </div>
  `,
  styleUrls: ['post-apply.component.scss']
})
export class PostApplyComponent implements OnInit {
  @Input() post: PostRepresentation & {};
  user: UserRepresentation;

  constructor(private dialog: MdDialog, private userService: UserService, private resourceService: ResourceService,
              private postService: PostService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  apply(post: PostRepresentation) {
    if (!this.user) {
      this.showLogin();
    } else if (!this.resourceService.canPursue(post)) {
      this.requestMembership();
    } else {
      this.doRespond();
    }
  }

  showLogin() {
    this.authGuard.ensureAuthenticated().first() // open dialog if not authenticated
      .flatMap(authenticated => {
        if (!authenticated) {
          return Observable.of(null);
        }
        return this.resourceService.getResource('POST', this.post.id, {returnComplete: true, reload: true});
      })
      .subscribe(post => {
        if (post) {
          this.apply(post);
        }
      });
  }

  requestMembership() {
    const config = new MdDialogConfig();
    config.data = {department: this.post.board.department};
    const dialogRef = this.dialog.open(DepartmentRequestMembershipDialogComponent, config);
    dialogRef.afterClosed()
      .flatMap((result: boolean) => {
        return result ? this.resourceService.getResource('POST', this.post.id, {returnComplete: true, reload: true}) : Observable.of(null);
      })
      .subscribe(post => {
        if (post) {
          this.apply(post);
        }
      });
  }

  doRespond() {
    if (this.post.applyEmail) {
      const config = new MdDialogConfig();
      config.data = {post: this.post};
      const dialogRef = this.dialog.open(PostApplyDialogComponent, config);
      dialogRef.afterClosed()
        .subscribe((response: ResourceEventRepresentation) => {
          this.post.response = response;
        });
    } else {
      window.open('api/posts/referrals/' + this.post.referral, '_blank');
    }
  }
}
