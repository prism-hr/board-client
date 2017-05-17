import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import UserRepresentation = b.UserRepresentation;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import Role = b.Role;

@Component({
  templateUrl: 'resource-users.component.html',
  styleUrls: ['resource-users.component.scss']
})
export class ResourceUsersComponent implements OnInit {

  users: ResourceUserRepresentation[];
  resource: ResourceRepresentation;
  availableRoles: Role[];
  loading: boolean;
  userForm: FormGroup;
  adminsCount: number;
  bulkMode: boolean;

  constructor(private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private fb: FormBuilder,
              private resourceService: ResourceService) {
    this.userForm = this.fb.group({
      user: this.fb.group({
        givenName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
        surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
        email: ['', [Validators.required, ValidationService.emailValidator]],
      }),
      roles: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.resource = data[resourceScope];
      if ((<any>this.resource.scope) === 'BOARD') {
        this.availableRoles = <any>['ADMINISTRATOR', 'AUTHOR'];
      } else {
        this.availableRoles = <any>['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
      }
    });
    this.route.data.subscribe(data => {
      this.users = data['users'];
      this.calculateAdminsCount();
    });
  }

  userRoleChanged(user, role, checked) {
    this.loading = true;
    this.cdRef.detectChanges();
    let observable: Observable<Response>;
    if (checked) {
      observable = this.resourceService.addUserRole(this.resource, user.user, role);
    } else {
      observable = this.resourceService.removeUserRole(this.resource, user.user, role)
    }
    observable.subscribe(() => {
      this.loading = false;
      this.calculateAdminsCount();
    });
  }

  createNewUser() {
    this.loading = true;
    this.resourceService.createUser(this.resource, this.userForm.value)
      .subscribe(user => {
        this.loading = false;
        this.userForm.reset({roles: []});
        this.users.push(user);
        this.calculateAdminsCount();
      });
  }

  removeUser(user) {
    this.resourceService.removeUser(this.resource, user.user)
      .subscribe(() => {
        this.loading = false;
        const idx = this.users.indexOf(user);
        this.users.splice(idx, 1);
        this.calculateAdminsCount();
      });
  }

  canSwitchRole(user, role) {
    if (user.roles.indexOf(role) === -1) {
      return true; // roles not checked, can check at any time
    }
    if (user.roles.length === 1) {
      return false; // cannot remove last role
    }
    return !(this.lastAdministratorRole() && role === 'ADMINISTRATOR'); // cannot remove last administrator role for department
  }

  private lastAdministratorRole() {
    return (<any>this.resource.scope) === 'DEPARTMENT' && this.adminsCount === 1;
  }

  private calculateAdminsCount() {
    this.adminsCount = this.users.filter(u => (<any>u.roles).indexOf('ADMINISTRATOR') > -1).length;
  }

}
