import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {PostService} from '../post.service';
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  selector: 'b-post-actions-box',
  templateUrl: 'post-actions-box.component.html',
  styleUrls: ['post-actions-box.component.scss']
})
export class PostActionsBoxComponent implements OnChanges {
  @Input() post: any;
  actionView: string;
  actions: MenuItem[];

  constructor(private router: Router, private postService: PostService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.actionView = this.postService.getActionView(this.post);
    this.postService.getActionItems(this.post)
      .subscribe(actions => {
        this.actions = actions;
      });
  }

  gotoSettings() {
    this.router.navigate([this.post.board.department.handle, this.post.board.handle, this.post.id, 'settings']);
  }
}
