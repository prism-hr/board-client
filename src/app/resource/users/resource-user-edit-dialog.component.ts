import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {ResourceService} from '../../services/resource.service';
import ResourceRepresentation = b.ResourceRepresentation;
import ResourceUserRepresentation = b.ResourceUserRepresentation;

@Component({
  template: `
    <h2 md-dialog-title>{{resourceUser.user.givenName}} {{resourceUser.user.surname}}</h2>

    <md-dialog-content>
      <form [formGroup]="userForm" (ngSubmit)="save()" autocomplete="off" novalidate>
        <div class="grid">
          <b-resource-user-role-form-part [resource]="resource" [parentForm]="userForm"
                                          [resourceUser]="resourceUser" [lastAdminRole]="lastAdminRole"></b-resource-user-role-form-part>
        </div>
      </form>
    </md-dialog-content>

    <md-dialog-actions fxLayout="row" fxLayoutAlign="space-between">
      <button pButton class="ui-button-secondary" label="Cancel" md-dialog-close></button>
      <div>
        <button pButton (click)="removeUser(resourceUser)" class="ui-button-secondary" label="Remove"
                [disabled]="lastAdminRole"></button>
        <button pButton class="ui-button-warning" [disabled]="userForm.invalid" label="Save" (click)="save()"></button>
      </div>
    </md-dialog-actions>
  `
})
export class ResourceUserEditDialogComponent implements OnInit {

  resource: ResourceRepresentation<any>;
  resourceUser: ResourceUserRepresentation;
  userForm: FormGroup;
  lastAdminRole: boolean;
  progress: boolean;

  constructor(private dialogRef: MdDialogRef<ResourceUserEditDialogComponent>, private fb: FormBuilder,
              private resourceService: ResourceService, @Inject(MD_DIALOG_DATA) private data: any) {
    this.resource = data.resource;
    this.resourceUser = data.resourceUser;
    this.lastAdminRole = data.lastAdminRole;
    this.userForm = this.fb.group({
      roles: [[], Validators.required]
    });
  }

  ngOnInit(): void {
  }

  save(): void {
    this.progress = true;
    const formValue = this.userForm.value;
    const roles = formValue.roles
      .filter(roleDef => roleDef.checked)
      .map(roleDef => ({
        role: roleDef.roleId,
        expiryDate: roleDef.expiryDate,
        categories: [roleDef.category]
      }));
    this.resourceService.updateResourceUser(this.resource, this.resourceUser.user, {roles})
      .subscribe(resourceUser => {
        this.progress = false;
        this.dialogRef.close({action: 'edited', resourceUser});
      });
  }

  removeUser(resourceUser) {
    this.progress = true;
    this.resourceService.removeUser(this.resource, resourceUser.user)
      .subscribe(() => {
        this.progress = false;
        this.dialogRef.close({action: 'deleted', resourceUser: this.resourceUser});
      });
  }

}
