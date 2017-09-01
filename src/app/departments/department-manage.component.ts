import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  template: `
    <section class="section">
      <p-tabMenu *ngIf="canEdit" [model]="items"></p-tabMenu>
      <router-outlet></router-outlet>
    </section>
  `,
  styles: []
})
export class DepartmentManageComponent implements OnInit {
  department: DepartmentRepresentation;
  items: MenuItem[];
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.canEdit = this.resourceService.canEdit(this.department);
      const departmentPath = ['/', this.department.handle];
      this.items = [
        {label: 'View', routerLink: departmentPath, routerLinkActiveOptions: {exact: true}},
        {label: 'Edit', routerLink: [...departmentPath, 'edit'], routerLinkActiveOptions: {exact: true}},
        {label: 'Users', routerLink: [...departmentPath, 'users'], routerLinkActiveOptions: {exact: true}},
        {label: 'Memberships', routerLink: [...departmentPath, 'memberships'], routerLinkActiveOptions: {exact: true}}];
    });
  }

}
