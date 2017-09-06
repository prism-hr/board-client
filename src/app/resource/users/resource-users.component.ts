import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {MenuItem} from 'primeng/primeng';
import {DepartmentService} from '../../departments/department.service';
import {ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
import {ResourceUserEditDialogComponent} from './resource-user-edit-dialog.component';
import ResourceRepresentation = b.ResourceRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import UserRoleRepresentation = b.UserRoleRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Component({
  templateUrl: 'resource-users.component.html',
  styleUrls: ['resource-users.component.scss']
})
export class ResourceUsersComponent implements OnInit {

  users: UserRolesRepresentation;
  members: UserRoleRepresentation[];
  resource: ResourceRepresentation<any>;
  loading: boolean;
  userForm: FormGroup;
  lastAdminRole: boolean;
  bulkMode: boolean;
  usersTabs: UserTabItem[];
  activeUsersTab: UserTabItem;
  usersTabIndex = 0;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dialog: MdDialog,
              private resourceService: ResourceService, private departmentService: DepartmentService) {
    this.userForm = this.fb.group({
      user: this.fb.group({
        id: [],
        givenName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
        surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
        email: ['', [Validators.required, ValidationUtils.emailValidator]],
      })
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.resource = data[resourceScope];
      if (this.resource.scope === 'DEPARTMENT') {
        this.departmentService.getMembers(this.resource)
          .subscribe(members => {
            this.members = members;
          });
      }
    });
    this.route.data.subscribe(data => {
      this.users = data['users'];
      this.calculateAdminsCount();
    });

    this.usersTabs = [
      {label: 'Staff', icon: 'fa-bar-chart', collectionName: 'users', roleType: 'STAFF'},
      {label: 'Members', icon: 'fa-calendar', collectionName: 'members', roleType: 'MEMBER'},
      {label: 'Membership Requests', icon: 'fa-book', collectionName: 'memberRequests'}
    ];
    this.activeUsersTab = this.usersTabs[0];
  }

  createNewUser() {
    this.userForm['submitted'] = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    const userValue = this.userForm.get('user').value;
    const roleDef = this.userForm.get('roleGroup').value;
    const userDTO: UserRoleDTO = {
      role: roleDef.role,
      expiryDate: roleDef.expiryDate,
      categories: [roleDef.category],
      user: _.pick(userValue, ['id', 'givenName', 'surname', 'email'])
    };

    this.resourceService.addUser(this.resource, userDTO)
      .subscribe(user => {
        this.loading = false;
        this.userForm['submitted'] = false;
        this.userForm.reset();
        if (user.role !== 'MEMBER') { // only staff members collection should be updated
          this.users.users.push(user);
          this.calculateAdminsCount();
        }
      });
  }

  openUserSettings(userRole: UserRoleRepresentation, roleType: 'STAFF' | 'MEMBER') {
    const dialogRef = this.dialog.open(ResourceUserEditDialogComponent,
      {
        width: '80%',
        panelClass: 'user-settings',
        data: {resource: this.resource, lastAdminRole: this.lastAdminRole && userRole.role === 'ADMINISTRATOR', userRole, roleType}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {action, userRole}: { action: string, userRole: UserRoleRepresentation } = result;
        const usersCollection = this.users[this.activeUsersTab.collectionName];
        if (action === 'edited') {
          const idx = usersCollection.findIndex(ru => ru.user.id === userRole.user.id);
          usersCollection.splice(idx, 1, userRole);
          this.calculateAdminsCount();
        } else if (action === 'deleted') {
          const idx = usersCollection.findIndex(ru => ru.user.id === userRole.user.id);
          usersCollection.splice(idx, 1);
          this.calculateAdminsCount();
        }
      }
    });
  }

  closeBulkMode($event) {
    if ($event === 'refresh') {
      this.resourceService.getResourceUsers(this.resource.scope.toLowerCase(), this.resource.id)
        .subscribe(users => {
          this.users = users;
          this.bulkMode = false;
        });
    } else {
      this.bulkMode = false;
    }
  }

  respondToMemberRequest(userRole: UserRoleRepresentation, state: string) {
    this.departmentService.respondToMemberRequest(this.resource, userRole.user, state)
      .subscribe(() => {
        const idx = this.users.memberRequests.indexOf(userRole);
        this.users.memberRequests.splice(idx, 1);
      });
  }

  private calculateAdminsCount() {
    const adminsCount = this.users.users
      .filter(u => u.role === 'ADMINISTRATOR').length;
    this.lastAdminRole = adminsCount === 1;
  }
}

interface UserTabItem extends MenuItem {
  collectionName: string;
  roleType?: 'STAFF' | 'MEMBER';
}
