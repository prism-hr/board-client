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
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-apply',
  template: `
    <div class="post-apply">
      <div *ngIf="!post?.responded" class="post-apply-content">
        <div *ngIf="!documentUrl && !websiteUrl">
          <button pButton type="button" (click)="apply(post)" label="Apply" class="ui-button-success small"></button>
        </div>
        <div *ngIf="documentUrl">
          <a pButton type="button" href="{{documentUrl}}" download class="ui-button-success small" label="Download apply instructions"></a>
        </div>
        <div *ngIf="websiteUrl">
          <a pButton type="button" href="{{websiteUrl}}" target="_blank" class="ui-button-success small" label="Open apply website"></a>
        </div>
      </div>
      <div *ngIf="post?.responded">
        You already responded to this post.
      </div>
    </div>
  `,
  styleUrls: ['post-apply.component.scss']
})
export class PostApplyComponent implements OnInit {
  @Input() post: PostRepresentation & {};
  user: UserRepresentation;
  websiteUrl: string;
  documentUrl: string;

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
        return this.postService.getPost(this.post.id, true);
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
        return result ? this.postService.getPost(this.post.id, true) : Observable.of(null);
      })
      .subscribe(post => {
        if (post) {
          this.apply(post);
        }
      });
  }

  doRespond() {
    this.postService.getPostApply(this.post).subscribe(apply => {
      let respondPrompt: Observable<any>;
      if (apply.applyEmail) {
        const config = new MdDialogConfig();
        config.data = {apply, post: this.post};
        const dialogRef = this.dialog.open(PostApplyDialogComponent, config);
        respondPrompt = dialogRef.afterClosed();
      } else {
        respondPrompt = Observable.of(true);
      }
      respondPrompt.subscribe((result: boolean) => {
        if (result) {
          if (apply.applyEmail) {
            this.post.responded = true;
          } else if (apply.applyDocument) {
            this.documentUrl = apply.applyDocument.cloudinaryUrl;
          } else if (apply.applyWebsite) {
            this.websiteUrl = apply.applyWebsite;
          }
        }
      });
    })
  }
}
