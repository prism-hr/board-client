import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import UserRepresentation = b.UserRepresentation;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import Role = b.Role;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;
import UserRoleRepresentation = b.UserRoleRepresentation;

@Component({
  selector: 'b-resource-user-role-form-part',
  template: `
    <div [formGroup]="parentForm">
      <div *ngFor="let role of availableRoles; let index = index" class="grid__item one-third input-holder">
        <p-checkbox [value]="role" [label]="'definitions.role.' + role | translate"
                    formControlName="roles" (onChange)="roleChanged(role)"></p-checkbox>

        <div formGroupName="roleDefinitions">
          <div *ngIf="parentForm.value.roles.indexOf(role) > -1" [formGroupName]="role">
            <h4>{{'definitions.role.' + role | translate}}</h4>
            <div class="grid__item one-whole input-holder">
              <p-checkbox label="No expiry date" formControlName="noExpiryDate" binary="true"
                          (onChange)="noExpiryDateChanged(role)"></p-checkbox>
            </div>

            <div *ngIf="!parentForm.get('roleDefinitions').get(role).get('noExpiryDate').value" class="grid__item one-whole input-holder">
              <label>Specify expiry date for "{{'definitions.role.' + role | translate}}" role:</label>
              <p-calendar formControlName="expiryDate" dateFormat="yy-mm-dd" dataType="string"></p-calendar>
              <control-messages [control]="parentForm.get('roleDefinitions').get(role).get('expiryDate')"></control-messages>
            </div>

            <div *ngIf="role === 'MEMBER'">
              <label>Specify member categories</label>
              <div class="ui-checkbox-inline">
                <span *ngFor="let category of availableMemberCategories">
                  <p-checkbox formControlName="categories" [value]="category" [label]="category"></p-checkbox>
                </span>
                <control-messages [control]="parentForm.get('roleDefinitions').get('MEMBER').get('categories')"></control-messages>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid__item one-whole">
        <control-messages [control]="parentForm.get('roles')"></control-messages>
      </div>
    </div>
  `,
  styles: ['']
})
export class ResourceUserRoleFormPartComponent implements OnInit {

  @Input() resource: any;
  @Input() parentForm: FormGroup;
  @Input() resourceUser: any;
  @Input() lastAdminRole: boolean;

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

    const userRoles = this.resourceUser ? this.resourceUser.roles : [];

    const rolesValidators = [Validators.required];
    if (this.lastAdminRole) {
      rolesValidators.push(this.lastAdminValidator);
    }
    this.parentForm.setControl('roles', this.fb.control(userRoles.map(r => r.role), rolesValidators));
    const roleDefinitions = {};
    this.availableRoles.forEach(role => {
      const userRole: UserRoleRepresentation = userRoles.find(r => r.role === role) || {};
      roleDefinitions[role] = this.fb.group({
        noExpiryDate: [!userRole.expiryDate],
        expiryDate: [userRole.expiryDate],
        categories: [userRole.categories]
      });
    });
    this.parentForm.setControl('roleDefinitions', this.fb.group(roleDefinitions));
  }

  roleChanged(role: Role) {
    const checked = this.parentForm.get('roles').value.indexOf(role) > -1;
    if (role === 'MEMBER') {
      this.parentForm.get('roleDefinitions').get(role).get('categories').setValidators(checked && Validators.required);
      this.parentForm.patchValue({roleDefinitions: {MEMBER: {categories: []}}});
    }
    this.refreshValidators(role);
  }

  noExpiryDateChanged(role: Role) {
    this.parentForm.get('roleDefinitions').get(role).get('expiryDate').setValue(null);
    this.refreshValidators(role);
  }

  private lastAdminValidator(control: AbstractControl) {
    const administratorChecked = control.value.indexOf('ADMINISTRATOR') > -1;
    if (!administratorChecked) {
      return {lastAdminRole: true};
    }
    return null;
  }

  private refreshValidators(role: Role) {
    const noExpiryDate = this.parentForm.get('roleDefinitions').get(role).get('noExpiryDate').value;
    const expiryDateControl = this.parentForm.get('roleDefinitions').get(role).get('expiryDate');
    expiryDateControl.setValidators(!noExpiryDate && Validators.required);
    expiryDateControl.updateValueAndValidity();
  }
}
