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

  userRoleChanged(user: ResourceUserRepresentation) {
    this.loading = true;
    this.cdRef.detectChanges();
    let observable: Observable<Response>;
    observable = this.resourceService.updateResourceUser(this.resource, user.user, {user: user.user, roles: user.roles});
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
    const rolesOrder = ['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
    user.roles = user.roles.sort((a, b) => rolesOrder.indexOf(a.role) - rolesOrder.indexOf(b.role));
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
