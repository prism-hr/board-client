import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {pick} from 'lodash';
import {EntityFilter} from '../../../general/filter/filter.component';
import {ResourceService} from '../../../services/resource.service';
import {ValidationUtils} from '../../../validation/validation.utils';
import {ResourceUserEditDialogComponent} from '../resource-user-edit-dialog.component';
import {DepartmentStaffFormPartComponent} from '../role-form-part/department-staff-form-part.component';
import DepartmentRepresentation = b.DepartmentRepresentation;
import StaffDTO = b.StaffDTO;
import StaffRepresentation = b.StaffRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Component({
  templateUrl: 'department-staff.component.html',
  styleUrls: ['department-staff.component.scss']
})
export class DepartmentStaffComponent implements OnInit {

  users: UserRolesRepresentation;
  department: DepartmentRepresentation;
  loading: boolean;
  userForm: FormGroup;
  lastAdminRole: boolean;
  filter: EntityFilter;
  @ViewChild(DepartmentStaffFormPartComponent) staffFormPartComponent: DepartmentStaffFormPartComponent;

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private title: Title,
              private fb: FormBuilder, private dialog: MatDialog, private resourceService: ResourceService) {
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
      this.title.setTitle(this.department.name + ' - Users');
      this.loadUsers();
    });
  }

  createNewUser() {
    this.userForm['submitted'] = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    const userValue = this.userForm.get('user').value;
    const staffDTO: StaffDTO = Object.assign({}, this.staffFormPartComponent.getStaffDTO());
    staffDTO.user = pick(userValue, ['id', 'givenName', 'surname', 'email']);
    staffDTO.type = 'STAFF';

    this.resourceService.addUser(this.department, staffDTO)
      .subscribe(newStaff => {
        this.loading = false;
        this.userForm['submitted'] = false;
        this.userForm.reset();
        this.users.staff.push(newStaff);
        this.calculateAdminsCount();
      });
  }

  openUserSettings(staff: StaffRepresentation) {
    if (this.lastAdminRole && staff.roles.includes('ADMINISTRATOR')) {
      return;
    }
    const dialogRef = this.dialog.open(ResourceUserEditDialogComponent,
      {
        panelClass: 'user-settings',
        data: {
          resource: this.department,
          lastAdminRole: this.lastAdminRole && staff && staff.roles.includes('ADMINISTRATOR'),
          userRole: staff
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {action, userRole}: { action: string, userRole: StaffRepresentation } = result;
        const usersCollection = this.users.staff;
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

  filterApplied(filter) {
    this.filter = filter;
    this.loadUsers();
  }

  private calculateAdminsCount() {
    const adminsCount = this.users.staff
      .filter(u => u.roles.includes('ADMINISTRATOR')).length;
    this.lastAdminRole = adminsCount === 1;
  }

  private loadUsers() {
    this.resourceService.getResourceUsers(this.department, this.filter)
      .subscribe(users => {
        this.users = users;
        this.calculateAdminsCount();
      });
  }
}
