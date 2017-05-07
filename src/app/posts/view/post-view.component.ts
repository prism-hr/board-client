import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../post.service';
import {MenuItem} from 'primeng/primeng';
import PostRepresentation = b.PostRepresentation;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  post: PostRepresentation;
  actions: MenuItem[];

  constructor(private route: ActivatedRoute, private router: Router, private postService: PostService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
      this.postService.getActionItems(this.post)
        .subscribe(actions => this.actions = actions);
    });
  }

  gotoSettings() {
    this.router.navigate([this.post.board.department.handle, this.post.board.handle, this.post.id, 'settings']);
  }

}
