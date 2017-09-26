import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {CheckboxUtils} from '../../services/checkbox.utils';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import MemberCategory = b.MemberCategory;

@Component({
  templateUrl: 'department-edit.component.html',
  styleUrls: ['department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {
  availableMemberCategories: MemberCategory[];
  department: DepartmentRepresentation;
  departmentForm: FormGroup;
  urlPrefix: string;
  actionView: string;
  formProperties = ['name', 'summary', 'memberCategories', 'documentLogo'];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private snackBar: MdSnackBar, private resourceService: ResourceService, private definitionsService: DefinitionsService) {
    this.availableMemberCategories = definitionsService.getDefinitions()['memberCategory'];
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      memberCategories: this.fb.array(this.availableMemberCategories.map(c => [false])),
      handle: [],
      documentLogo: []
    });
  }

  get memberCategories(): FormArray {
    return this.departmentForm.get('memberCategories') as FormArray;
  };

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.department = data['department'];
      this.departmentForm.reset(_.pick(this.department, [...this.formProperties, 'handle']));
      const formFormat = CheckboxUtils.toFormFormat(this.availableMemberCategories, this.department && this.department.memberCategories);
      (<FormArray>this.departmentForm.get('memberCategories'))
        .setValue(formFormat);
      this.departmentForm.get('handle').setValidators(this.department && [Validators.required, Validators.maxLength(25)]);
      this.urlPrefix = this.definitionsService.getDefinitions()['applicationUrl'] + '/';
      this.actionView = this.department ? 'EDIT' : 'CREATE';
    });
  }

  update() {
    this.departmentForm['submitted'] = true;
    if (this.departmentForm.invalid) {
      return;
    }
    this.resourceService.patchDepartment(this.department.id, this.generateDepartmentRequestBody())
      .subscribe(department => {
        Object.assign(this.department, department);
        this.router.navigate([department.university.handle, department.handle])
          .then(() => {
            this.snackBar.open('Department Saved!', null, {duration: 3000});
          });
      }, this.handleErrors);
  }

  create() {
    this.departmentForm['submitted'] = true;
    if (this.departmentForm.invalid) {
      return;
    }
    this.resourceService.postDepartment(this.generateDepartmentRequestBody())
      .subscribe(department => {
        this.router.navigate([department.university.handle, department.handle])
          .then(() => {
            this.snackBar.open('Department Created!', null, {duration: 3000});
          });
      }, this.handleErrors);
  }

  private generateDepartmentRequestBody(): DepartmentPatchDTO {
    const departmentDTO: DepartmentPatchDTO = _.pick(this.departmentForm.value, this.formProperties);
    departmentDTO.memberCategories = CheckboxUtils
      .fromFormFormat(this.availableMemberCategories, this.departmentForm.get('memberCategories').value);
    if (this.departmentForm.get('handle').value) {
      departmentDTO.handle = this.departmentForm.get('handle').value;
    }
    return departmentDTO;
  }


  private handleErrors(error: Response) {
    if (error.status === 422) {
      if (error.json().exceptionCode === 'DUPLICATE_DEPARTMENT') {
        this.departmentForm.controls['name'].setErrors({duplicateDepartment: true});
      }
    }

  }
}
