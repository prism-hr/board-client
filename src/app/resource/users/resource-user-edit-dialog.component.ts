import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
import {DepartmentMemberFormPartComponent} from './role-form-part/department-member-form-part.component';
import {DepartmentStaffFormPartComponent} from './role-form-part/department-staff-form-part.component';
import MemberDTO = b.MemberDTO;
import ResourceRepresentation = b.ResourceRepresentation;
import StaffDTO = b.StaffDTO;
import UserRoleDTO = b.UserRoleDTO;
import UserRoleRepresentation = b.UserRoleRepresentation;

@Component({
  template: `
    <div fxLayout="row" class="user-avatar-dialog">
      <div mat-card-avatar class="avatar"
           [ngClass]="{'no-background': userRole.user.documentImage}">
        <b-image [publicId]="userRole.user.documentImage?.cloudinaryId"
                 gravity="face" width="150" height="150" radius="max" crop="thumb" background="ececec"
                 *ngIf="userRole.user.documentImage"></b-image>
        <i *ngIf="!userRole.user.documentImage" class="fa-user"></i>
      </div>
      <h2 mat-dialog-title style="margin-bottom:10px; margin-left: 10px;">{{userRole.user.givenName}} {{userRole.user.surname}}</h2>
    </div>

    <form [formGroup]="userForm" (ngSubmit)="save()" autocomplete="off" novalidate>
      <mat-dialog-content>
        <div class="grid">
          <div class="grid__item one-whole">
            <div class="input-holder">
              <label for="email">Email</label>
              <input pInputText type="email" formControlName="email">
              <control-messages [control]="userForm.get('email')"></control-messages>
            </div>
          </div>

          <div *ngIf="userRole.roleType === 'STAFF'">
            <b-department-staff-form-part [department]="resource" [parentForm]="userForm"
                                          [staff]="userRole" [lastAdminRole]="lastAdminRole"></b-department-staff-form-part>
          </div>

          <div *ngIf="userRole.roleType === 'MEMBER'">
            <b-department-member-form-part [department]="resource" [parentForm]="userForm"
                                           [member]="userRole"></b-department-member-form-part>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions fxLayout="row" fxLayoutAlign="space-between">
        <div>
          <button pButton type="button" class="ui-button-secondary" label="Cancel" mat-dialog-close></button>
          <button pButton type="button" (click)="removeUser(userRole)" class="ui-button-secondary remove-user" label="Remove"
                  [disabled]="lastAdminRole" icon="fa-trash"></button>
        </div>
        <button pButton class="ui-button-warning" label="Save"></button>

      </mat-dialog-actions>
    </form>
  `
})
export class ResourceUserEditDialogComponent implements OnInit {

  resource: ResourceRepresentation<any>;
  userRole: UserRoleRepresentation<any>;
  userForm: FormGroup;
  lastAdminRole: boolean;
  @ViewChild(DepartmentStaffFormPartComponent) staffFormPartComponent: DepartmentStaffFormPartComponent;
  @ViewChild(DepartmentMemberFormPartComponent) memberFormPartComponent: DepartmentMemberFormPartComponent;
  progress: boolean;

  constructor(private dialogRef: MatDialogRef<ResourceUserEditDialogComponent>, private fb: FormBuilder,
              private resourceService: ResourceService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.resource = data.resource;
    this.userRole = data.userRole;
    this.lastAdminRole = data.lastAdminRole;
    this.userForm = this.fb.group({
      email: [data.userRole.email, [ValidationUtils.emailValidator]],
    });
  }

  ngOnInit(): void {
  }

  save(): void {
    this.userForm['submitted'] = true;
    if (this.userForm.invalid) {
      return;
    }
    this.progress = true;
    const roleType = this.userRole.roleType;
    const userRoleDTO: UserRoleDTO<any> = {type: roleType, user: Object.assign({}, this.userRole.user)};
    userRoleDTO.user.email = this.userForm.get('email').value;

    if (roleType === 'STAFF') {
      Object.assign(userRoleDTO, this.staffFormPartComponent.getStaffDTO());
    } else {
      Object.assign(userRoleDTO, this.memberFormPartComponent.getMemberDTO());
    }
    this.resourceService.updateResourceUser(this.resource, this.userRole.user, userRoleDTO)
      .subscribe(userRole => {
        this.progress = false;
        this.dialogRef.close({action: 'edited', userRole});
      });
  }

  removeUser(resourceUser: UserRoleRepresentation<any>) {
    this.progress = true;
    this.resourceService.removeUser(this.resource, resourceUser.user)
      .subscribe(() => {
        this.progress = false;
        this.dialogRef.close({action: 'deleted', userRole: this.userRole});
      });
  }

}
