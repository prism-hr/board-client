import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import BoardRepresentation = b.BoardRepresentation;
import {ResourceService} from '../../services/resource.service';

@Component({
  template: `
    <section class="section">
      <div *ngIf="board">
        <b-board-header [board]="board"></b-board-header>
        <p-tabMenu *ngIf="canEdit" [model]="items" class="inside-tabs"></p-tabMenu>
        <router-outlet></router-outlet>
      </div>
      <div *ngIf="!board">
        The board is unavailable.
      </div>
    </section>
  `,
  styles: []
})
export class BoardTabsComponent implements OnInit {
  board: BoardRepresentation;
  items: MenuItem[];
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.board = data['board'];
      if(this.board) {
        this.canEdit = this.resourceService.canEdit(this.board);
        const boardPath = ['/', this.board.department.university.handle, this.board.department.handle, this.board.handle];
        this.items = [
          {
            label: 'View',
            routerLink: boardPath,
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Edit',
            routerLink: [...boardPath, 'edit'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Users',
            routerLink: [...boardPath, 'users'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Badge',
            routerLink: [...boardPath, 'badge'],
            routerLinkActiveOptions: {exact: true}
          }];
      }
    });
  }
}
