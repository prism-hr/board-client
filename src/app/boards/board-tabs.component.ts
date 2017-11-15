import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/components/common/menuitem';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;

@Component({
  template: `
    <section *ngIf="board" class="section">
      <div *ngIf="!errorStatus">
        <b-board-header [board]="board"></b-board-header>
        <p-tabMenu *ngIf="canEdit" [model]="items" class="inside-tabs"></p-tabMenu>
        <router-outlet></router-outlet>
      </div>
      <div *ngIf="errorStatus">
        <div *ngIf="errorStatus === 404">
          The board you were looking for does not exist.
        </div>
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

  get errorStatus(): number {
    return this.board && (<any>this.board).errorStatus;
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.board = data['board'];
      if (this.board) {
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
