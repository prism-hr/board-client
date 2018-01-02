import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {pick} from 'lodash';
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

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private title: Title,
              private fb: FormBuilder, private dialog: MatDialog, private resourceService: ResourceService,
              private departmentService: DepartmentService) {
    this.userForm = this.fb.group({
      user: this.fb.group({
        id: [],
        givenName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
        surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
        email: ['', [Validators.required, ValidationUtils.emailValidator]]
      })
    });
  }

  ngOnInit() {
    this.route.parent.parent.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.resource = data[resourceScope];
      this.title.setTitle(this.resource.name + ' - Users');
      this.loadUsers();
    });
    this.route.fragment.subscribe(fragment => {
      const usersCategory = fragment || 'users';
      this.usersTabIndex = this.tabCollections.indexOf(usersCategory);
      this.cdr.detectChanges();
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
    const userRoleDTO: UserRoleDTO = pick(roleDef, ['role', 'expiryDate', 'memberCategory', 'memberProgram', 'memberYear']);
    userRoleDTO.user = pick(userValue, ['id', 'givenName', 'surname', 'email']);

    this.resourceService.addUser(this.resource, userRoleDTO)
      .subscribe(user => {
        this.loading = false;
        this.userForm['submitted'] = false;
        this.userForm.reset();
        if (user.role === 'MEMBER') { // only staff members collection should be updated
          this.users.members.push(user);
          this.usersTabChanged({index: 1});
        } else {
          this.users.users.push(user);
          this.usersTabChanged({index: 0});
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
        panelClass: 'user-settings',
        data: {resource: this.resource, lastAdminRole: this.lastAdminRole && userRole.role === 'ADMINISTRATOR', userRole, roleType}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {action, userRole}: { action: string, userRole: UserRoleRepresentation } = result;
        const usersCollection: UserRoleRepresentation[] = this.users[this.tabCollections[this.usersTabIndex]];
        if (action === 'edited') {
          const idx = usersCollection.findIndex(ru => ru.user.id === userRole.user.id);
          usersCollection.splice(idx, 1, userRole);
          this.calculateAdminsCount();
        } else if (action === 'deleted') {
          const idx = usersCollection.findIndex(ru => ru.user.id === userRole.user.id);
          if (idx > -1) { // Safe measure (sometimes when you click quickly somewhere after closing dialog, this function is called again)
            usersCollection.splice(idx, 1);
            this.calculateAdminsCount();
          }
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
        if (this.users.memberRequests.length === 0) {
          this.usersTabChanged({index: 1});
        }
        this.loadUsers();
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
