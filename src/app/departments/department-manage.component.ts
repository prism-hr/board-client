import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  template: `
  <section class="section">
    <md-card>
      <md-card-header class="header-full">
        <md-card-title>
          <div fxFill fxLayout="row" fxLayoutAlign="space-between center" class="full">
            <h2>{{department.name}}</h2>
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
export class DepartmentManageComponent implements OnInit {
  department: DepartmentRepresentation;
  items: MenuItem[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.items = [{label: 'Edit', routerLink: ['/', this.department.handle, 'edit'], routerLinkActiveOptions: {exact: true}},
        {label: 'Users', routerLink: ['/', this.department.handle, 'users'], routerLinkActiveOptions: {exact: true}}];
    });
    this.route.url.subscribe(url => {
      console.log(url);
    })
  }

}
