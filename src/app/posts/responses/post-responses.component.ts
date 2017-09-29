import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import PostRepresentation = b.PostRepresentation;
import ResourceEventRepresentation = b.ResourceEventRepresentation;

@Component({
  templateUrl: 'post-responses.component.html',
  styleUrls: ['post-responses.component.scss']
})
export class PostResponsesComponent implements OnInit {

  post: PostRepresentation;
  responses: ResourceEventRepresentation[];

  constructor(private route: ActivatedRoute, private title: Title) {
  }

  ngOnInit() {
    this.route.parent.data
      .map(data => {
        return data['post'];
      })
      .flatMap(post => {
        return this.route.data.map(data => {
          return [post, data['responses']];
        });
      })
      .subscribe(([post, responses]) => {
        this.post = post;
        this.title.setTitle(this.post.name + ' - Responses');
        this.responses = responses;
      });
  }

}
