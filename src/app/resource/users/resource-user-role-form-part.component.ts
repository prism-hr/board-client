import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import UserRepresentation = b.UserRepresentation;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import Role = b.Role;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;

@Component({
  selector: 'b-resource-user-role-form-part',
  template: `
    <div [formGroup]="parentForm">
      <div class="grid__item one-whole input-holder">
        <div class="ui-checkbox-inline">
            <span *ngFor="let role of availableRoles">
              <p-checkbox [value]="role" [label]="'definitions.role.' + role | translate"
                          formControlName="roles" (onChange)="roleChanged(role)"></p-checkbox>
            </span>
          <control-messages [control]="parentForm.get('roles')"></control-messages>
        </div>
      </div>

      <div formGroupName="roleDefinitions">
        <div *ngIf="parentForm.value.roles.indexOf('MEMBER') > -1" formGroupName="MEMBER">
          <label>Specify member categories</label>
          <div class="ui-checkbox-inline">
              <span *ngFor="let category of availableMemberCategories">
                <p-checkbox formControlName="categories" [value]="category" [label]="category"></p-checkbox>
              </span>
            <control-messages [control]="parentForm.get('roleDefinitions').get('MEMBER').get('categories')"></control-messages>
          </div>
        </div>

        <div *ngFor="let role of parentForm.value.roles" [formGroupName]="role">
          <div class="grid__item one-whole input-holder">
            <p-checkbox label="No expiry date" formControlName="noExpiryDate" binary="true"
                        (onChange)="noExpiryDateChanged(role)"></p-checkbox>
          </div>

          <div *ngIf="!parentForm.get('roleDefinitions').get(role).get('noExpiryDate').value" class="grid__item one-whole input-holder">
            <label>Specify expiry date for "{{'definitions.role.' + role | translate}}" role:</label>
            <p-calendar formControlName="expiryDate" dateFormat="yy-mm-dd" dataType="string"></p-calendar>
            <control-messages [control]="parentForm.get('roleDefinitions').get(role).get('expiryDate')"></control-messages>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ['']
})
export class ResourceUserRoleFormPartComponent implements OnInit {

  @Input() resource: any;
  @Input() parentForm: FormGroup;

  availableRoles: Role[];
  availableMemberCategories: string[];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    if (this.resource.scope === 'BOARD') {
      this.availableRoles = ['ADMINISTRATOR', 'AUTHOR'];
    } else {
      this.availableRoles = ['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
    }
    this.availableMemberCategories = this.resource.scope === 'DEPARTMENT'
      ? (this.resource as DepartmentRepresentation).memberCategories
      : (this.resource as BoardRepresentation).department.memberCategories;

    this.parentForm.setControl('roles', this.fb.control([], Validators.required));
    const roleDefinitions = {};
    this.availableRoles.forEach(role => roleDefinitions[role] = this.fb.group({noExpiryDate: [true], expiryDate: [], categories: []}));
    this.parentForm.setControl('roleDefinitions', this.fb.group(roleDefinitions));
  }

  roleChanged(role: Role) {
    if (role === 'MEMBER') {
      this.parentForm.patchValue({roleDefinitions: {MEMBER: {categories: []}}});
      const checked = this.parentForm.get('roles').value.indexOf(role) > -1;
      this.parentForm.get('roleDefinitions').get(role).get('categories').setValidators(checked && Validators.required);
    }
    this.refreshValidators(role);
  }

  noExpiryDateChanged(role: Role) {
    this.parentForm.get('roleDefinitions').get(role).get('expiryDate').setValue(null);
    this.refreshValidators(role);
  }

  private refreshValidators(role: Role) {
    const noExpiryDate = this.parentForm.get('roleDefinitions').get(role).get('noExpiryDate').value;
    const expiryDateControl = this.parentForm.get('roleDefinitions').get(role).get('expiryDate');
    expiryDateControl.setValidators(!noExpiryDate && Validators.required);
    expiryDateControl.updateValueAndValidity();
  }
}
