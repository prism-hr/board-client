import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ValidationUtils} from '../../validation/validation.utils';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import Role = b.Role;
import UserRoleRepresentation = b.UserRoleRepresentation;

@Component({
  selector: 'b-resource-user-role-form-part',
  templateUrl: 'resource-user-role-form-part.component.html',
  styles: ['.members{margin-top: 10px;} label {font-weight:500;}']
})
export class ResourceUserRoleFormPartComponent implements OnInit {

  @Input() resource: ResourceRepresentation<any> & {};
  @Input() parentForm: FormGroup;
  @Input() resourceUser: ResourceUserRepresentation & {};
  @Input() lastAdminRole: boolean;

  availableRoles: Role[];
  memberCategoryOptions: { label: string, value: any }[];

  constructor(private fb: FormBuilder, private translate: TranslateService) {
  }

  get roles(): FormArray {
    return this.parentForm.get('roles') as FormArray;
  };

  ngOnInit() {
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      const availableMemberCategories = this.resource.scope === 'DEPARTMENT'
        ? (this.resource as DepartmentRepresentation).memberCategories
        : (this.resource as BoardRepresentation).department.memberCategories;
      this.memberCategoryOptions = availableMemberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });
    if (this.resource.scope === 'BOARD') {
      this.availableRoles = ['ADMINISTRATOR', 'AUTHOR'];
    } else {
      this.availableRoles = ['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
    }

    const userRoles: UserRoleRepresentation[] = this.resourceUser ? this.resourceUser.roles : [];

    const rolesArray = this.availableRoles.map(role => {
      const userRole = userRoles.find(ur => ur.role === role);
      return this.fb.group({
        roleId: [role],
        checked: [!!userRole, this.lastAdminRole && role === 'ADMINISTRATOR' && this.lastAdminValidator],
        noExpiryDate: [userRole && !userRole.expiryDate],
        expiryDate: [userRole && userRole.expiryDate],
        category: [userRole && userRole.categories && userRole.categories[0]]
      });
    });
    this.parentForm.setControl('roles', this.fb.array(rolesArray, ValidationUtils.checkboxArrayMin(1)));

  }

  roleChanged(index: number) {
    const roleGroup = this.parentForm.get('roles').get('' + index);
    const checked = roleGroup.get('checked').value;
    const role = this.availableRoles[index];
    roleGroup.get('noExpiryDate').setValue(checked && role !== 'MEMBER');
    if (role === 'MEMBER') {
      const categoryControl = roleGroup.get('category');
      categoryControl.setValidators(checked && Validators.required);
    }
    this.refreshValidators(index);
  }

  noExpiryDateChanged(index: number) {
    this.parentForm.get('roles').get('' + index).get('expiryDate').setValue(null);
    this.refreshValidators(index);
  }

  private lastAdminValidator(control: AbstractControl) {
    if (!control.value) {
      return {lastAdminRole: true};
    }
  }

  private refreshValidators(index: number) {
    const roleGroup = this.parentForm.get('roles').get('' + index);
    const roleChecked = roleGroup.get('checked').value;
    const noExpiryDate = roleGroup.get('noExpiryDate').value;
    const expiryDateControl = roleGroup.get('expiryDate');
    expiryDateControl.setValidators(roleChecked && !noExpiryDate && Validators.required);
    expiryDateControl.updateValueAndValidity();
  }
}
