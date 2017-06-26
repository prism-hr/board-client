import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {PostService} from '../post.service';
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'b-post-actions-box',
  templateUrl: 'post-actions-box.component.html',
  styleUrls: ['post-actions-box.component.scss']
})
export class PostActionsBoxComponent implements OnChanges {
  @Input() post: any;
  actionView: string;
  actions: MenuItem[];

  constructor(private router: Router, private snackBar: MdSnackBar, private postService: PostService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateActionItems();
  }

  gotoSettings() {
    return this.router.navigate([this.post.board.department.handle, this.post.board.handle, this.post.id, 'settings']);
  }

  private generateActionItems() {
    this.actionView = this.postService.getActionView(this.post);
    this.postService.getActionItems(this.post, post => {
      Object.assign(this.post, post);
      this.generateActionItems();
      this.snackBar.open('Your action was executed successfully.', null, {duration: 3000});
    })
      .subscribe(actions => {
        this.actions = actions;
      });
  }
}
