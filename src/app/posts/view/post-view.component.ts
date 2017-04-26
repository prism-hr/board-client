import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../post.service';
import {MenuItem} from 'primeng/primeng';
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  board: BoardRepresentation;
  post: PostRepresentation;
  actions: MenuItem[];

  constructor(private route: ActivatedRoute, private router: Router, private postService: PostService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
      this.board = data['board'];
      this.postService.getActionItems(this.post, this.board)
        .subscribe(actions => this.actions = actions);
    });
  }

  gotoSettings() {
    this.router.navigate(['settings'], {relativeTo: this.route});
  }

}
