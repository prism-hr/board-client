import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ResourceService} from '../services/resource.service';
import {PostService} from './post.service';
import PostRepresentation = b.PostRepresentation;

@Component({
  template: `
    <section class="section">
      <p-tabMenu *ngIf="canEdit" [model]="items"></p-tabMenu>
      <router-outlet></router-outlet>
    </section>
  `,
  styles: []
})
export class PostTabComponent implements OnInit {
  post: PostRepresentation;
  items: MenuItem[];
  canEdit: boolean;
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private postService: PostService, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap
      .flatMap(params => {
        return params.get('postId') ? this.postService.getPost(+params.get('postId')) : Observable.of(null);
      })
      .subscribe(post => {
        this.post = post;
        this.canEdit = this.resourceService.canEdit(this.post);
        const postPath = ['/', this.post.board.department.handle, this.post.board.handle, this.post.id];
        this.items = [
          {
            label: 'View',
            routerLink: postPath,
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Edit',
            routerLink: [...postPath, 'edit'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Responses',
            routerLink: [...postPath, 'responses'],
            routerLinkActiveOptions: {exact: true}
          }];
      });
  }
}
