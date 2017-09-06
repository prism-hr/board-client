import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
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

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.today = new Date();
    this.route.paramMap
      .flatMap(map => {
        return this.resourceService.getResource('POST', +map.get('postId'));
      })
      .subscribe(post => {
        this.post = post;
        this.canEdit = this.resourceService.canEdit(this.post);
        this.publishedTimestamp = <any>this.post.liveTimestamp;
      });
  }

  openChangeDetails(operation) {
    this.selectedOperation = operation;
    this.showOperationDetails = true;
  }
}
