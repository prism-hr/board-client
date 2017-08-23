import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MetaService} from '@ngx-meta/core';
import * as _ from 'lodash';
import {ResourceService} from '../../services/resource.service';
import {PostService} from '../post.service';
import PostRepresentation = b.PostRepresentation;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  post: PostRepresentation;
  canEdit: boolean;
  operations: ResourceOperationRepresentation[];
  operationsLoading: boolean;
  publishedTimestamp: string;
  today: Date;
  showOperationDetails: boolean;
  selectedOperation: ResourceOperationRepresentation;

  constructor(private meta: MetaService, private route: ActivatedRoute, private postService: PostService,
              private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.today = new Date();
    this.route.paramMap
      .flatMap(map => {
        return this.postService.getPost(+map.get('postId'));
      })
      .subscribe(post => {
        this.post = post;
        this.meta.setTitle(this.post.name);
        this.meta.setTag('description', this.post.summary);
        if (this.post.board.documentLogo) {
          this.meta.setTag('og:image', this.post.board.documentLogo.cloudinaryUrl);
        }

        this.canEdit = this.resourceService.canEdit(this.post);
        if (this.canEdit) {
          this.operationsLoading = true;
          this.postService.loadOperations(this.post)
            .subscribe(operations => {
              this.operations = operations;
              this.operationsLoading = false;

              this.publishedTimestamp = <any>this.post.liveTimestamp;
              if (!this.publishedTimestamp) {
                const operationsCopy = _.clone(this.operations);
                const publishOperation = operationsCopy.reverse().find(o => o.action as any === 'PUBLISH');
                this.publishedTimestamp = _.get(publishOperation, 'createdTimestamp') as any;
              }
            });
        }
      });
  }

  openChangeDetails(operation) {
    this.selectedOperation = operation;
    this.showOperationDetails = true;
  }
}
