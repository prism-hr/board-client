import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
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
  @Input() roleType: 'STAFF' | 'MEMBER';

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
    if (this.resource.scope === 'BOARD' || this.roleType === 'STAFF') {
      this.availableRoles = ['ADMINISTRATOR', 'AUTHOR'];
    } else if (this.roleType === 'MEMBER') {
      this.availableRoles = ['MEMBER'];
    } else {
      this.availableRoles = ['ADMINISTRATOR', 'AUTHOR', 'MEMBER'];
    }

    const userRole: UserRoleRepresentation = this.resourceUser ? this.resourceUser.roles[0] : null;
    let role = userRole && userRole.role;
    if(!role && this.availableRoles.length === 1) {
      role = this.availableRoles[0];
    }

    this.parentForm.setControl('roleGroup', this.fb.group({
      role: [role, this.lastAdminRole && role === 'ADMINISTRATOR' && this.lastAdminValidator],
      noExpiryDate: [userRole && !userRole.expiryDate],
      expiryDate: [userRole && userRole.expiryDate],
      category: [userRole && userRole.categories && userRole.categories[0]]
    }));

    this.parentForm.get('roleGroup').get('role').valueChanges.subscribe((role: Role) => {
      const roleGroup = this.parentForm.get('roleGroup');
      roleGroup.get('noExpiryDate').setValue(role !== 'MEMBER');
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
