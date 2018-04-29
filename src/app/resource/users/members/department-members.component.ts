import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {pick} from 'lodash';
import {Observable} from 'rxjs/Observable';
import {interval} from 'rxjs/observable/interval';
import {Subscription} from 'rxjs/Subscription';
import {DepartmentService} from '../../../departments/department.service';
import {EntityFilter} from '../../../general/filter/filter.component';
import {ResourceService} from '../../../services/resource.service';
import {ValidationUtils} from '../../../validation/validation.utils';
import {ResourceUserEditDialogComponent} from '../resource-user-edit-dialog.component';
import {DepartmentMemberFormPartComponent} from '../role-form-part/department-member-form-part.component';
import DepartmentRepresentation = b.DepartmentRepresentation;
import MemberDTO = b.MemberDTO;
import MemberRepresentation = b.MemberRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Component({
  templateUrl: 'department-members.component.html',
  styleUrls: ['department-members.component.scss']
})
export class DepartmentMembersComponent implements OnInit {

  users: UserRolesRepresentation;
  department: DepartmentRepresentation;
  loading: boolean;
  userForm: FormGroup;
  bulkMode: boolean;
  usersTabIndex = 0;
  filter: EntityFilter;
  tabCollections = ['members', 'memberRequests'];
  loadUsersSubscription: Subscription;
  @ViewChild(DepartmentMemberFormPartComponent) memberFormPartComponent: DepartmentMemberFormPartComponent;

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
    this.route.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.department = data[resourceScope];
      this.title.setTitle(this.department.name + ' - Members');
      this.loadUsers();
    });
    this.route.fragment.subscribe(fragment => {
      const usersCategory = fragment || 'members';
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
    const memberDTO: MemberDTO = Object.assign({}, this.memberFormPartComponent.getMemberDTO());
    memberDTO.user = pick(userValue, ['id', 'givenName', 'surname', 'email']);
    memberDTO.type = 'STAFF';

    this.resourceService.addUser(this.department, memberDTO)
      .subscribe(user => {
        this.loading = false;
        this.userForm['submitted'] = false;
        this.userForm.reset();
        this.users.members.push(user);
        this.usersTabChanged({index: 1});
      });
  }

  openUserSettings(member: MemberRepresentation) {
    const dialogRef = this.dialog.open(ResourceUserEditDialogComponent,
      {
        panelClass: 'user-settings',
        data: {resource: this.department, userRole: member}
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {action, userRole}: { action: string, userRole: MemberRepresentation } = result;
        const usersCollection: MemberRepresentation[] = this.users[this.tabCollections[this.usersTabIndex]];
        if (action === 'edited') {
          const idx = usersCollection.findIndex(ru => ru.user.id === userRole.user.id);
          usersCollection.splice(idx, 1, userRole);
        } else if (action === 'deleted') {
          const idx = usersCollection.findIndex(ru => ru.user.id === userRole.user.id);
          if (idx > -1) { // Safe measure (sometimes when you click quickly somewhere after closing dialog, this function is called again)
            usersCollection.splice(idx, 1);
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

  filterApplied(filter) {
    this.filter = filter;
    this.loadUsers();
  }

  respondToMemberRequest(member: MemberRepresentation, state: string) {
    this.departmentService.respondToMemberRequest(this.department, member.user, state)
      .subscribe(() => {
        const idx = this.users.memberRequests.indexOf(member);
        this.users.memberRequests.splice(idx, 1);
        if (this.users.memberRequests.length === 0) {
          this.usersTabChanged({index: 1});
        }
        this.loadUsers();
      });
  }

  private loadUsers(delay?: number) {
    if (this.loadUsersSubscription) {
      this.loadUsersSubscription.unsubscribe();
    }
    let observable: Observable<UserRolesRepresentation>;
    if (delay) {
      observable = interval(delay || 0)
        .take(1)
        .flatMap(() => this.resourceService.getResourceUsers(this.department, this.filter));
    } else {
      observable = this.resourceService.getResourceUsers(this.department, this.filter);
    }

    this.loadUsersSubscription = observable
      .subscribe(users => {
        this.users = users;

        if (users.memberToBeUploadedCount) {
          this.loadUsers(5000);
        }
      });
  }
}
