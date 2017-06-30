import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;


@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: BoardRepresentation;
  canEdit: boolean;
  posts: PostRepresentation[];

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.canEdit = this.resourceService.canEdit(this.board);
    });
    this.resourceService.getBoardPosts(this.board.id)
      .subscribe(posts => this.posts = posts);
  }

}
