import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MetaService} from '@ngx-meta/core';
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
  publishedTimestamp: string;
  today: Date;
  showOperationDetails: boolean;
  selectedOperation: ResourceOperationRepresentation;

  constructor(private meta: MetaService, private route: ActivatedRoute, private resourceService: ResourceService,
              private postService: PostService) {
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
        this.publishedTimestamp = <any>this.post.liveTimestamp;
      });
  }

  openChangeDetails(operation) {
    this.selectedOperation = operation;
    this.showOperationDetails = true;
  }
}
