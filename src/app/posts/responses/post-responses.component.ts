import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import PostRepresentation = b.PostRepresentation;
import ResourceEventRepresentation = b.ResourceEventRepresentation;
import {EntityFilter} from '../../general/filter/filter.component';
import {PostService} from '../post.service';

@Component({
  templateUrl: 'post-responses.component.html',
  styleUrls: ['post-responses.component.scss']
})
export class PostResponsesComponent implements OnInit {

  post: PostRepresentation;
  responses: ResourceEventRepresentation[];
  filter: EntityFilter;

  constructor(private route: ActivatedRoute, private title: Title, private postService: PostService) {
  }

  ngOnInit() {
    this.route.data
      .subscribe(parentData => {
        this.post = parentData['post'];
        this.title.setTitle(this.post.name + ' - Responses');
        this.loadResponses();
      });
  }

  responsesFilterApplied(filter) {
    this.filter = filter;
    this.loadResponses();
  }

  private loadResponses() {
    this.responses = null;
    this.postService.getResponses(this.post, this.filter)
      .subscribe(responses => {
        this.responses = responses;
      });
  }


}
