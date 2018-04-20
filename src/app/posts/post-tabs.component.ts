import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/components/common/menuitem';
import {Observable} from 'rxjs/Observable';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;

@Component({
  template: `
    <section *ngIf="post" class="section">
      <div *ngIf="!errorStatus">
        <div class="grid__flex view-template">
          <div class="main-content">
            <b-post-header [post]="post"></b-post-header>
            <b-tabMenu *ngIf="canEdit" [model]="items" class="inside-tabs"></b-tabMenu>
            <router-outlet></router-outlet>
          </div>
          <div class="logo-content">
            <!--// TODO kuba check why logo it's not showing-->
            <div *ngIf="post.board.documentLogo" mat-card-avatar>
              <b-image [publicId]="post.board.documentLogo?.cloudinaryId"
                       gravity="north_west" height="150" width="200" crop="mfit"></b-image>
            </div>
            <h3>
              <a [routerLink]="['/', post.board.department.university.handle, post.board.department.handle, post.board.handle]">
                {{post.board.name}}
              </a>
              <small>from</small>
              <a [routerLink]="['/', post.board.department.university.handle, post.board.department.handle]">
                {{post.board.department.name}}
              </a>
            </h3>
          </div>
        </div>
      </div>
      <div *ngIf="errorStatus">
        <div *ngIf="errorStatus === 403">
          The post you were looking for is no longer available.
        </div>
        <div *ngIf="errorStatus === 404">
          The post you were looking for does not exist.
        </div>
        <div *ngIf="board">
          View
          <a [routerLink]="['/', board.department.university.handle, board.department.handle, board.handle]">
            {{board.name}}
          </a>
          board to see more posts.
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class PostTabsComponent implements OnInit {
  post: PostRepresentation;
  board: BoardRepresentation;
  items: MenuItem[];
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  get errorStatus(): number {
    return this.post && (<any>this.post).errorStatus;
  }

  ngOnInit() {
    this.route.paramMap
      .flatMap(params => {
        return params.get('postId') ? this.resourceService.getResource('POST', +params.get('postId')) : Observable.of(null);
      })
      .subscribe(post => {
        this.post = post;
        if (this.post.id) {
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

    this.route.data.subscribe(parentData => {
      this.board = parentData['board'];
    });
  }
}
