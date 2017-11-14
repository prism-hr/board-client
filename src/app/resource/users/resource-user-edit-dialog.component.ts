import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {pick} from 'lodash';
import {ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
import ResourceRepresentation = b.ResourceRepresentation;
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

          <b-resource-user-role-form-part [resource]="resource" [parentForm]="userForm" [roleType]="roleType"
                                          [userRole]="userRole" [lastAdminRole]="lastAdminRole"></b-resource-user-role-form-part>
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
  userRole: UserRoleRepresentation;
  userForm: FormGroup;
  lastAdminRole: boolean;
  roleType: 'STAFF' | 'MEMBER';
  progress: boolean;

  constructor(private dialogRef: MatDialogRef<ResourceUserEditDialogComponent>, private fb: FormBuilder,
              private resourceService: ResourceService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.resource = data.resource;
    this.userRole = data.userRole;
    this.lastAdminRole = data.lastAdminRole;
    this.roleType = data.roleType;
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
    const roleDef = this.userForm.get('roleGroup').value;
    const userRoleDTO: UserRoleDTO = pick(roleDef,
      ['role', 'expiryDate', 'memberCategory', 'memberProgram', 'memberYear']);
    userRoleDTO.email = this.userForm.get('email').value;
    this.resourceService.updateResourceUser(this.resource, this.userRole.user, userRoleDTO)
      .subscribe(userRole => {
        this.progress = false;
        this.dialogRef.close({action: 'edited', userRole});
      });
  }

  removeUser(resourceUser: UserRoleRepresentation) {
    this.progress = true;
    this.resourceService.removeUser(this.resource, resourceUser.user)
      .subscribe(() => {
        this.progress = false;
        this.dialogRef.close({action: 'deleted', userRole: this.userRole});
      });
  }

}
