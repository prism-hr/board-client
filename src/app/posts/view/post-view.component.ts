import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../post.service';
import {ResourceService} from '../../services/resource.service';
import * as _ from 'lodash';
import PostRepresentation = b.PostRepresentation;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;

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

  constructor(private route: ActivatedRoute, private router: Router, private postService: PostService,
              private resourceService: ResourceService) {
  }

  ngOnInit() {
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

            this.publishedTimestamp = this.post.liveTimestamp as any;
            if (!this.publishedTimestamp) {
              const publishOperation = this.operations.reverse().find(o => o.action as any === 'PUBLISH');
              this.publishedTimestamp = _.get(publishOperation, 'createdTimestamp') as any;
            }
          });
      }
    });
  }

  gotoSettings() {
    this.router.navigate([this.post.board.department.handle, this.post.board.handle, this.post.id, 'settings']);
  }

  showLogin() {

  }

}
