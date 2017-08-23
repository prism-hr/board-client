import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
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

  availableRoles: Role[];
  memberCategoryOptions: { label: string, value: any }[];

  constructor(private fb: FormBuilder, private translate: TranslateService) {
  }

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
          category: [userRole.categories && userRole.categories[0]]
        });
      });
      this.parentForm.setControl('roleDefinitions', this.fb.group(roleDefinitions));

  }

  roleChanged(role: Role) {
    const checked = this.parentForm.get('roles').value.indexOf(role) > -1;
    if (role === 'MEMBER') {
      this.parentForm.get('roleDefinitions').get(role).get('category').setValidators(checked && Validators.required);
      this.parentForm.patchValue({roleDefinitions: {MEMBER: {category: null}}});
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
