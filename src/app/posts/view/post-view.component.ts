import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../post.service';
import {ResourceService} from '../../services/resource.service';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {AuthGuard} from '../../authentication/auth-guard.service';
import {UserService} from '../../services/user.service';
import PostRepresentation = b.PostRepresentation;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  post: PostRepresentation;
  operations: ResourceOperationRepresentation[];
  operationsLoading: boolean;
  publishedTimestamp: string;
  today: Date;
  user$: Observable<UserRepresentation | boolean>;

  constructor(private route: ActivatedRoute, private userService: UserService, private postService: PostService,
              private resourceService: ResourceService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.today = new Date();
    this.route.data.subscribe(data => {
      this.post = data['post'];

      const canAudit = this.resourceService.canAudit(this.post);
      if (canAudit) {
        this.operationsLoading = true;
        this.postService.loadOperations(this.post)
          .subscribe(operations => {
            this.operations = operations;
            this.operationsLoading = false;

            this.publishedTimestamp = <any>this.post.liveTimestamp;
            if (!this.publishedTimestamp) {
              const publishOperation = this.operations.reverse().find(o => o.action as any === 'PUBLISH');
              this.publishedTimestamp = _.get(publishOperation, 'createdTimestamp') as any;
            }
          });
      }
    });
  }

  showLogin() {
    this.authGuard.ensureAuthenticated().first() // open dialog if not authenticated
      .subscribe(authenticated => {
        if (!authenticated) {
          return;
        }
        this.resourceService.getPost(this.post.id)
          .subscribe(post => {
            this.route.data.subscribe(data => {
              data['post'] = post;
              (<any>this.route.data).next(data);
            });
          });
      });
  }

}
