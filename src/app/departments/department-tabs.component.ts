import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  template: `
    <section *ngIf="department" class="section">
      <div *ngIf="!errorStatus">
        <b-department-header [department]="department"></b-department-header>
        <p-tabMenu *ngIf="canEdit" [model]="items" class="inside-tabs"></p-tabMenu>
        <router-outlet></router-outlet>
      </div>
      <div *ngIf="errorStatus">
        <div *ngIf="errorStatus === 404">
          The department you were looking for does not exist.
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class DepartmentTabsComponent implements OnInit {
  department: DepartmentRepresentation;
  items: MenuItem[];
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  get errorStatus(): number {
    return this.department && (<any>this.department).errorStatus;
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.canEdit = this.resourceService.canEdit(this.department);
      const departmentPath = ['/', this.department.university.handle, this.department.handle];
      this.items = [
        {label: 'View', routerLink: departmentPath, routerLinkActiveOptions: {exact: true}},
        {label: 'Edit', routerLink: [...departmentPath, 'edit'], routerLinkActiveOptions: {exact: true}},
        {label: 'Users', routerLink: [...departmentPath, 'users'], routerLinkActiveOptions: {exact: true}}];
    });
  }

}
