import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
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
    });
  }

  userRoleChanged(user, role, checked) {
    this.loading = true;
    this.cdRef.detectChanges();
    if (checked) {
      this.resourceService.addUserRole(this.resource, user.user, role)
        .subscribe(() => {
          this.loading = false;
        });
    } else {
      this.resourceService.removeUserRole(this.resource, user.user, role)
        .subscribe(() => {
          this.loading = false;
        });
    }
  }

  createNewUser() {
    this.loading = true;
    this.resourceService.createUser(this.resource, this.userForm.value)
      .subscribe(user => {
        this.loading = false;
        this.userForm.reset();
        this.users.push(user);
      });
  }

  removeUser(user) {
    this.resourceService.removeUser(this.resource, user.user)
      .subscribe(() => {
        this.loading = false;
        const idx = this.users.indexOf(user);
        this.users.splice(idx, 1);
      });
  }

}
