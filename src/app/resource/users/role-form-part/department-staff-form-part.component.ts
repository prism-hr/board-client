import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import DepartmentRepresentation = b.DepartmentRepresentation;
import StaffRepresentation = b.StaffRepresentation;
import StaffDTO = b.StaffDTO;

@Component({
  selector: 'b-department-staff-form-part',
  templateUrl: 'department-staff-form-part.component.html',
  styles: ['']
})
export class DepartmentStaffFormPartComponent implements OnInit {

  @Input() department: DepartmentRepresentation;
  @Input() parentForm: FormGroup;
  @Input() staff: StaffRepresentation;
  @Input() lastAdminRole: boolean;

  constructor(private fb: FormBuilder) {
  }

  get roleGroup(): FormGroup {
    return this.parentForm.get('roleGroup') as FormGroup;
  };

  ngOnInit() {
    const staff = this.staff || {};
    this.parentForm.setControl('roleGroup', this.fb.group({
      roles: [this.staff && staff.roles, Validators.required]
    }));
  }

  getStaffDTO() {
    const staffDTO: StaffDTO = {};
    staffDTO.roles = this.roleGroup.get('roles').value;
    return staffDTO;
  }

}
