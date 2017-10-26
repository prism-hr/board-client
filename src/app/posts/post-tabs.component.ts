import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ResourceService} from '../services/resource.service';
import PostRepresentation = b.PostRepresentation;

@Component({
  template: `
    <section class="section">
      <div *ngIf="post">
        <b-post-header [post]="post"></b-post-header>
        <p-tabMenu *ngIf="canEdit" [model]="items" class="inside-tabs"></p-tabMenu>
        <router-outlet></router-outlet>
      </div>
      <div *ngIf="!post">
        The post is unavailable
      </div>
    </section>
  `,
  styles: []
})
export class PostTabsComponent implements OnInit {
  post: PostRepresentation;
  items: MenuItem[];
  canEdit: boolean;
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap
      .flatMap(params => {
        return params.get('postId') ? this.resourceService.getResource('POST', +params.get('postId')) : Observable.of(null);
      })
      .subscribe(post => {
        this.post = post;
        if (this.post) {
          this.canEdit = this.resourceService.canEdit(this.post);
          const postPath = ['/', this.post.board.department.university.handle, this.post.board.department.handle, this.post.board.handle,
            this.post.id];
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
        }
      });
  }
}
