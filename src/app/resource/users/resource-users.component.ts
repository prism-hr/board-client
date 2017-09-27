import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {DepartmentService} from '../../departments/department.service';
import {EntityFilter} from '../../general/filter/filter.component';
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
  resource: ResourceRepresentation<any>;
  loading: boolean;
  userForm: FormGroup;
  lastAdminRole: boolean;
  bulkMode: boolean;
  usersTabIndex = 0;
  filter: EntityFilter;
  tabCollections = ['users', 'members', 'memberRequests'];
  loadUsersSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private dialog: MdDialog,
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
      this.loadUsers();
    });
    this.route.fragment.subscribe(fragment => {
      const usersCategory = fragment || 'users';
      setTimeout(() => {
        this.usersTabIndex = this.tabCollections.indexOf(usersCategory);
      });
    })
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
        if (user.role === 'MEMBER') { // only staff members collection should be updated
          this.users.members.push(user);
        } else {
          this.users.users.push(user);
        }
        this.calculateAdminsCount();
      });
  }

  openUserSettings(userRole: UserRoleRepresentation, roleType: 'STAFF' | 'MEMBER') {
    if (this.lastAdminRole && userRole.role === 'ADMINISTRATOR') {
      return;
    }
    const dialogRef = this.dialog.open(ResourceUserEditDialogComponent,
      {
        width: '80%',
        panelClass: 'user-settings',
        data: {resource: this.resource, lastAdminRole: this.lastAdminRole && userRole.role === 'ADMINISTRATOR', userRole, roleType}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {action, userRole}: { action: string, userRole: UserRoleRepresentation } = result;
        const usersCollection = this.users[this.tabCollections[this.usersTabIndex]];
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
      this.usersTabChanged({index: 1});
      this.loadUsers();
    }
    this.bulkMode = false;
  }

  usersTabChanged(event) {
    this.router.navigate([], {fragment: event.index ? this.tabCollections[event.index] : null});
    this.usersTabIndex = event.index;
  }

  membersFilterApplied(filter) {
    this.filter = filter;
    this.loadUsers();
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

  private loadUsers(delay?: number) {
    if (this.loadUsersSubscription) {
      this.loadUsersSubscription.unsubscribe();
    }
    let observable: Observable<UserRolesRepresentation>;
    if (delay) {
      observable = interval(delay || 0)
        .take(1)
        .flatMap(() => this.resourceService.getResourceUsers(this.resource, this.filter));
    } else {
      observable = this.resourceService.getResourceUsers(this.resource, this.filter);
    }

    this.loadUsersSubscription = observable
      .subscribe(users => {
        this.users = users;
        this.calculateAdminsCount();

        if (users.memberToBeUploadedCount) {
          this.loadUsers(5000);
        }
      });
  }
}
