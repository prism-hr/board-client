import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/components/common/menuitem';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  template: `
    <section *ngIf="department" class="section">
      <div *ngIf="!errorStatus">
        <div class="grid">
          <div class="grid__item medium-up--six-eighths">
            <b-department-header [department]="department"></b-department-header>
            <p-tabMenu *ngIf="canEdit" [model]="items" class="inside-tabs"></p-tabMenu>
            <router-outlet></router-outlet>
          </div>
          <div class="grid__item medium-up--two-eighths">
            <b-image [publicId]="department.documentLogo?.cloudinaryId" height="150" width="200" crop="mfit"></b-image>
          </div>
        </div>
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
      if (this.department.id) {
        this.canEdit = this.resourceService.canEdit(this.department);
        const departmentPath = ['/', this.department.university.handle, this.department.handle];
        this.items = [
          {
            label: 'View',
            title: 'View department',
            routerLink: departmentPath,
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Edit',
            title: 'Change department settings',
            routerLink: [...departmentPath, 'edit'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Posts',
            title: 'View posts',
            routerLink: [...departmentPath, 'posts'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Staff',
            title: 'Specify staff members',
            routerLink: [...departmentPath, 'users', 'staff'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Members',
            title: 'Specify members',
            routerLink: [...departmentPath, 'users', 'members'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Badge',
            title: 'Deploy department badge to your website',
            routerLink: [...departmentPath, 'badge'],
            routerLinkActiveOptions: {exact: true}
          },
          {
            label: 'Subscription',
            routerLink: [...departmentPath, 'subscription'],
            routerLinkActiveOptions: {exact: true}
          }];
      }
    });
  }

}
