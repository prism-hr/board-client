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
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;

@Component({
  templateUrl: 'resource-users.component.html',
  styleUrls: ['resource-users.component.scss']
})
export class ResourceUsersComponent implements OnInit {

  users: ResourceUserExtendedRepresentation[];
  resource: ResourceRepresentation;
  availableRoles: Role[];
  loading: boolean;
  userForm: FormGroup;
  adminsCount: number;
  bulkMode: boolean;
  availableMemberCategories: string[];

  constructor(private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private fb: FormBuilder,
              private resourceService: ResourceService) {
    this.userForm = this.fb.group({
      user: this.fb.group({
        givenName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
        surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
        email: ['', [Validators.required, ValidationService.emailValidator]],
      }),
      roles: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.resource = data[resourceScope];
      if (this.resource.scope === 'BOARD') {
        this.availableRoles = ['ADMINISTRATOR', 'AUTHOR'];
      } else {
        this.availableRoles = ['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
      }
      this.availableMemberCategories = this.resource.scope === 'DEPARTMENT'
        ? (this.resource as DepartmentRepresentation).memberCategories
        : (this.resource as BoardRepresentation).department.memberCategories;

      const roleDefinitions = {};
      this.availableRoles.forEach(role => roleDefinitions[role] = this.fb.group({expiryDate: [], categories: []}));
      this.userForm.setControl('roleDefinitions', this.fb.group(roleDefinitions));
    });
    this.route.data.subscribe(data => {
      this.users = data['users'];
      this.users.forEach(user => this.preprocessUser(user));
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
      observable = this.resourceService.removeUserRole(this.resource, user.user, role);
    }
    observable.subscribe(() => {
      this.loading = false;
      this.calculateAdminsCount();
    });
  }

  createNewUser() {
    this.loading = true;
    const formValue = this.userForm.value;
    const userDTO: ResourceUserDTO = {user: formValue.user};
    userDTO.roles = formValue.roles.map(r => ({
      role: r,
      expiryDate: formValue.roleDefinitions[r].expiryDate,
      categories: formValue.roleDefinitions[r].categories
    }));
    this.resourceService.addUser(this.resource, userDTO)
      .subscribe(user => {
        this.loading = false;
        this.userForm.reset({roles: []});
        this.preprocessUser(user);
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

  canSwitchRole(user: ResourceUserExtendedRepresentation, role: Role) {
    if (!user.roles.find(r => r.role === role)) {
      return true; // roles not checked, can check at any time
    }
    if (user.roles.length === 1) {
      return false; // cannot remove last role
    }
    return !(this.lastAdministratorRole() && role === 'ADMINISTRATOR'); // cannot remove last administrator role for department
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

  private preprocessUser(user: ResourceUserExtendedRepresentation) {
    user.roles = user.roles.sort((a, b) => this.availableRoles.indexOf(a.role) - this.availableRoles.indexOf(b.role));
    user.rolesFlat = user.roles.map(r => r.role);
  }

  private lastAdministratorRole() {
    return this.resource.scope === 'DEPARTMENT' && this.adminsCount === 1;
  }

  private calculateAdminsCount() {
    this.adminsCount = this.users.filter(u => u.roles.indexOf('ADMINISTRATOR') > -1).length;
  }

}

interface ResourceUserExtendedRepresentation extends ResourceUserRepresentation {
  rolesFlat?: Role[];
}
