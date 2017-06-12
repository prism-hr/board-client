import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../../services/resource.service';
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserRepresentation = b.UserRepresentation;
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

    <md-dialog-actions>
      <div>
        <button pButton class="ui-button-success" [disabled]="userForm.invalid"
                label="Save" type="submit" (click)="save()"></button>
        <button pButton class="ui-button-text" label="Cancel" (click)="cancel()"></button>
      </div>
    </md-dialog-actions>
  `
})
export class ResourceUserEditDialogComponent implements OnInit {

  resource: ResourceRepresentation;
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

  cancel() {
    this.dialogRef.close(null);
  }

  save(): void {
    this.progress = true;
    const formValue = this.userForm.value;
    const roles = formValue.roles.map(r => ({
      role: r,
      expiryDate: formValue.roleDefinitions[r].expiryDate,
      categories: formValue.roleDefinitions[r].categories
    }));
    this.resourceService.updateResourceUser(this.resource, this.resourceUser.user, {roles})
      .subscribe(resourceUser => {
        this.progress = false;
        this.dialogRef.close(resourceUser);
      });
  }

}
