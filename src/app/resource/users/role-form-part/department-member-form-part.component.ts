import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from 'primeng/components/common/selectitem';
import {DepartmentService} from '../../../departments/department.service';
import {Utils} from '../../../services/utils';
import DepartmentRepresentation = b.DepartmentRepresentation;
import MemberDTO = b.MemberDTO;
import MemberRepresentation = b.MemberRepresentation;

@Component({
  selector: 'b-department-member-form-part',
  templateUrl: 'department-member-form-part.component.html',
  styles: ['.members{margin-top: 10px;} label {font-weight:500;}']
})
export class DepartmentMemberFormPartComponent implements OnInit {

  @Input() department: DepartmentRepresentation;
  @Input() parentForm: FormGroup;
  @Input() member: MemberRepresentation;

  memberCategoryOptions: SelectItem[];
  programSuggestions: string[];
  availableYears: SelectItem[];
  yearRange = Utils.getYearRange();

  constructor(private fb: FormBuilder, private translate: TranslateService, private departmentService: DepartmentService) {
    this.availableYears = Array.from({length: 9}, (_, k) => k).map((_, i) => i + 1)
      .map(i => ({label: '' + i, value: i}));
  }

  get roleGroup(): FormGroup {
    return this.parentForm.get('roleGroup') as FormGroup;
  };

  ngOnInit() {
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      const availableMemberCategories = this.department.memberCategories;
      this.memberCategoryOptions = availableMemberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });

    const member = this.member || {};
    this.parentForm.setControl('roleGroup', this.fb.group({
      noExpiryDate: [!member.expiryDate],
      expiryDate: [member.expiryDate],
      memberCategory: [member.memberCategory, Validators.required],
      memberProgram: [member.memberProgram, Validators.required],
      memberYear: [member.memberYear, Validators.required]
    }));
  }

  noExpiryDateChanged() {
    this.parentForm.get('roleGroup').get('expiryDate').setValue(null);
    this.refreshValidators();
  }

  searchPrograms(event) {
    this.departmentService.searchPrograms(this.department, {searchTerm: event.query}).subscribe(programs => {
      this.programSuggestions = programs;
    });
  }

  getMemberDTO() {
    const memberDTO: MemberDTO = {};
    memberDTO.expiryDate = this.roleGroup.get('expiryDate').value;
    memberDTO.memberCategory = this.roleGroup.get('memberCategory').value;
    memberDTO.memberProgram = this.roleGroup.get('memberProgram').value;
    memberDTO.memberYear = this.roleGroup.get('memberYear').value;
    return memberDTO;
  }

  private refreshValidators() {
    const roleGroup = this.parentForm.get('roleGroup');
    const noExpiryDate = roleGroup.get('noExpiryDate').value;
    const expiryDateControl = roleGroup.get('expiryDate');
    expiryDateControl.setValidators(!noExpiryDate && Validators.required);
    expiryDateControl.updateValueAndValidity();
  }

}
