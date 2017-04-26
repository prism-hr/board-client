import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  post: PostRepresentation;
  availableActions: Action[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
      this.availableActions = this.post ? this.post.actions.map(a => a.action) : [];
    });
  }

}
