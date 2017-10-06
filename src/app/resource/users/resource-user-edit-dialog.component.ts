import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {ResourceService} from '../../services/resource.service';
import ResourceRepresentation = b.ResourceRepresentation;
import UserRoleRepresentation = b.UserRoleRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import * as _ from 'lodash';

@Component({
  template: `
    <h2 md-dialog-title style="margin-bottom: 10px;">{{userRole.user.givenName}} {{userRole.user.surname}}</h2>

    <form [formGroup]="userForm" (ngSubmit)="save()" autocomplete="off" novalidate>
      <md-dialog-content>
        <div class="grid">
          <b-resource-user-role-form-part [resource]="resource" [parentForm]="userForm" [roleType]="roleType"
                                          [userRole]="userRole" [lastAdminRole]="lastAdminRole"></b-resource-user-role-form-part>
        </div>
      </md-dialog-content>

      <md-dialog-actions fxLayout="row" fxLayoutAlign="space-between" style="margin-top: 20px;">
        <div>
          <button pButton type="button" class="ui-button-secondary" label="Cancel" md-dialog-close></button>
          <button pButton type="button" (click)="removeUser(userRole)" class="ui-button-secondary remove-user" label="Remove"
                  [disabled]="lastAdminRole" icon="fa-trash"></button>
        </div>
        <button pButton class="ui-button-warning" label="Save"></button>

      </md-dialog-actions>
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

  constructor(private dialogRef: MdDialogRef<ResourceUserEditDialogComponent>, private fb: FormBuilder,
              private resourceService: ResourceService, @Inject(MD_DIALOG_DATA) private data: any) {
    this.resource = data.resource;
    this.userRole = data.userRole;
    this.lastAdminRole = data.lastAdminRole;
    this.roleType = data.roleType;
    this.userForm = this.fb.group({});
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
    const userRoleDTO: UserRoleDTO = _.pick(roleDef, ['role', 'expiryDate', 'memberCategory', 'memberProgram', 'memberYear']);
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
