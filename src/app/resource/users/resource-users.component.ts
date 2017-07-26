import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
import {ResourceUserEditDialogComponent} from './resource-user-edit-dialog.component';
import {MdDialog} from '@angular/material';
import * as _ from 'lodash';
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;

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
        email: ['', [Validators.required, ValidationService.emailValidator]],
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
    const formValue = this.userForm.value;
    const userDTO: ResourceUserDTO = {user: _.pick(formValue.user, ['id', 'givenName', 'surname', 'email'])};
    userDTO.roles = formValue.roles.map(r => ({
      role: r,
      expiryDate: formValue.roleDefinitions[r].expiryDate,
      categories: formValue.roleDefinitions[r].categories
    }));
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

  removeUser(resourceUser) {
    this.resourceService.removeUser(this.resource, resourceUser.user)
      .subscribe(() => {
        this.loading = false;
        const idx = this.users.indexOf(resourceUser);
        this.users.splice(idx, 1);
        this.calculateAdminsCount();
      });
  }

  openUserSettings(resourceUser) {
    const dialogRef = this.dialog.open(ResourceUserEditDialogComponent,
      {data: {resource: this.resource, lastAdminRole: this.lastAdminRole && this.isAdmin(resourceUser), resourceUser}});
    dialogRef.afterClosed().subscribe((savedResourceUser: ResourceUserRepresentation) => {
      if (savedResourceUser) {
        this.preprocessUser(savedResourceUser);
        const idx = this.users.findIndex(ru => ru.user.id === savedResourceUser.user.id);
        this.users.splice(idx, 1, savedResourceUser);
        this.calculateAdminsCount();
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
