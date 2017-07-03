import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  template: `
  <section class="section">
    <md-card>
      <md-card-header class="header-full">
        <md-card-title>
          <div fxFill fxLayout="row" fxLayoutAlign="space-between center" class="full">
            <h2>{{board.name}}</h2>
          </div>
        </md-card-title>
      </md-card-header>
      <p-tabMenu [model]="items"></p-tabMenu>
      <router-outlet></router-outlet>
    </md-card>
  </section>
`,
  styles: []
})
export class BoardManageComponent implements OnInit {
  board: BoardRepresentation;
  items: MenuItem[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.board = data['board'];
      this.items = [
        {
          label: 'Edit',
          routerLink: ['/', this.board.department.handle, this.board.handle, 'edit'],
          routerLinkActiveOptions: {exact: true}
        },
        {
          label: 'Users',
          routerLink: ['/', this.board.department.handle, this.board.handle, 'users'],
          routerLinkActiveOptions: {exact: true}
        }];
    });
    this.route.url.subscribe(url => {
      console.log(url);
    })
  }
}
