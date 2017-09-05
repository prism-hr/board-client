import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
import {ResourceUserEditDialogComponent} from './resource-user-edit-dialog.component';
import ResourceRepresentation = b.ResourceRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;
import ResourceUserRepresentation = b.ResourceUserRepresentation;

@Component({
  templateUrl: 'resource-users.component.html',
  styleUrls: ['resource-users.component.scss']
})
export class ResourceUsersComponent implements OnInit {

  users: ResourceUserRepresentation[];
  resource: ResourceRepresentation<any>;
  loading: boolean;
  userForm: FormGroup;
  lastAdminRole: boolean;
  bulkMode: boolean;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dialog: MdDialog,
              private resourceService: ResourceService) {
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
    });
    this.route.data.subscribe(data => {
      this.users = data['users'];
      this.users.forEach(user => this.preprocessUser(user));
      this.calculateAdminsCount();
    });
  }

  createNewUser() {
    this.userForm['submitted'] = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    const userValue = this.userForm.get('user').value;
    const userDTO: ResourceUserDTO = {user: _.pick(userValue, ['id', 'givenName', 'surname', 'email'])};
    const roleDef = this.userForm.get('roleGroup').value;
    userDTO.roles = [{
      role: roleDef.role,
      expiryDate: roleDef.expiryDate,
      categories: [roleDef.category]
    }];

    this.resourceService.addUser(this.resource, userDTO)
      .subscribe(user => {
        this.loading = false;
        this.userForm['submitted'] = false;
        this.userForm.reset({roles: []});
        this.preprocessUser(user);
        this.users.push(user);
        this.calculateAdminsCount();
      });
  }

  openUserSettings(resourceUser) {
    const dialogRef = this.dialog.open(ResourceUserEditDialogComponent,
      {
        width: '80%',
        panelClass: 'user-settings',
        data: {resource: this.resource, lastAdminRole: this.lastAdminRole && this.isAdmin(resourceUser), resourceUser}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {action, resourceUser}: { action: string, resourceUser: ResourceUserRepresentation } = result;
        if (action === 'edited') {
          this.preprocessUser(resourceUser);
          const idx = this.users.findIndex(ru => ru.user.id === resourceUser.user.id);
          this.users.splice(idx, 1, resourceUser);
          this.calculateAdminsCount();
        } else if (action === 'deleted') {
          const idx = this.users.findIndex(ru => ru.user.id === resourceUser.user.id);
          this.users.splice(idx, 1);
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

  isAdmin(user: ResourceUserRepresentation) {
    return user.roles.findIndex(r => r.role === 'ADMINISTRATOR') > -1;
  }

  private preprocessUser(user: ResourceUserRepresentation) {
    const rolesOrder = ['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
    user.roles = user.roles.sort((a, b) => rolesOrder.indexOf(a.role) - rolesOrder.indexOf(b.role));
  }

  private calculateAdminsCount() {
    const adminsCount = this.users.filter(u => u.roles.map(ur => ur.role).indexOf('ADMINISTRATOR') > -1).length;
    this.lastAdminRole = this.resource.scope === 'DEPARTMENT' && adminsCount === 1;
  }

}
