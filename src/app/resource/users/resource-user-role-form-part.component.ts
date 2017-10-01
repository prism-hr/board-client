import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
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
  @Input() userRole: UserRoleRepresentation & {};
  @Input() lastAdminRole: boolean;
  @Input() roleType: 'STAFF' | 'MEMBER';

  availableRoles: Role[];
  memberCategoryOptions: { label: string, value: any }[];

  constructor(private fb: FormBuilder, private translate: TranslateService) {
  }

  get roleGroup(): FormArray {
    return this.parentForm.get('roleGroup') as FormArray;
  };

  ngOnInit() {
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      const availableMemberCategories = this.resource.scope === 'DEPARTMENT'
        ? (this.resource as DepartmentRepresentation).memberCategories
        : (this.resource as BoardRepresentation).department.memberCategories;
      this.memberCategoryOptions = availableMemberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });

    this.availableRoles = this.resource.scope === 'DEPARTMENT' ? ['ADMINISTRATOR', 'MEMBER'] : ['ADMINISTRATOR', 'AUTHOR'];
    if (this.roleType === 'STAFF') {
      this.availableRoles = _.without(this.availableRoles, 'MEMBER');
    } else if (this.roleType === 'MEMBER') {
      this.availableRoles = ['MEMBER'];
    }

    let role = this.userRole && this.userRole.role;
    if (!role && this.availableRoles.length === 1) {
      role = this.availableRoles[0];
    }

    this.parentForm.setControl('roleGroup', this.fb.group({
      role: [role, this.lastAdminRole && role === 'ADMINISTRATOR' && this.lastAdminValidator],
      noExpiryDate: [!this.userRole || !this.userRole.expiryDate],
      expiryDate: [this.userRole && this.userRole.expiryDate],
      category: [this.userRole && this.userRole.categories && this.userRole.categories[0], // API allows collection of categories, pick one
        this.roleType === 'MEMBER' && this.memberCategoryOptions.length > 0 && Validators.required]
    }));

    this.parentForm.get('roleGroup').get('role').valueChanges.subscribe((role: Role) => {
      const roleGroup = this.parentForm.get('roleGroup');
      roleGroup.get('noExpiryDate').setValue(true);
      this.refreshValidators();
    });
  }

  noExpiryDateChanged() {
    this.parentForm.get('roleGroup').get('expiryDate').setValue(null);
    this.refreshValidators();
  }

  private lastAdminValidator(control: AbstractControl) {
    if (control.value !== 'ADMINISTRATOR') {
      return {lastAdminRole: true};
    }
  }

  private refreshValidators() {
    const roleGroup = this.parentForm.get('roleGroup');
    const role = roleGroup.get('role').value;
    const noExpiryDate = roleGroup.get('noExpiryDate').value;
    const expiryDateControl = roleGroup.get('expiryDate');
    expiryDateControl.setValidators(!noExpiryDate && Validators.required);
    expiryDateControl.updateValueAndValidity();
    roleGroup.get('category').setValidators(role === 'MEMBER' && Validators.required);
  }

}
