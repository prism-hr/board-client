import {Component, Input, OnChanges, OnInit} from '@angular/core';
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
  templateUrl: 'post-apply.component.html',
  styleUrls: ['post-apply.component.scss']
})
export class PostApplyComponent implements OnInit, OnChanges {
  @Input() post: PostRepresentation & {};
  user: UserRepresentation;
  canPursue: boolean;

  constructor(private dialog: MdDialog, private userService: UserService, private resourceService: ResourceService,
              private postService: PostService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
    this.canPursue = this.resourceService.canPursue(this.post);
  }

  ngOnChanges(changes: any) {
    this.canPursue = this.resourceService.canPursue(this.post);
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
      if (apply.forwardCandidates || apply.applyEmail) {
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
          }
          if (apply.applyDocument) {
            window.open(apply.applyDocument.cloudinaryUrl);
          } else if (apply.applyWebsite) {
            window.open(apply.applyWebsite);
          }
        }
      });
    })
  }
}
