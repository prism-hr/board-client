import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, ParamMap, Router} from '@angular/router';
import {pick} from 'lodash';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import {Utils} from '../../services/utils';
import {ValidationUtils} from '../../validation/validation.utils';
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
  formProperties = ['name', 'summary', 'memberCategories', 'documentLogo'];
  viewLink: any[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private title: Title,
              private snackBar: MatSnackBar, private resourceService: ResourceService, private definitionsService: DefinitionsService) {
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
    this.route.parent.parent.data
      .subscribe((parentData: Data) => {
        this.department = parentData['department'];
        this.title.setTitle(this.department.name + ' - Edit');
        this.departmentForm.reset(pick(this.department, [...this.formProperties, 'handle']));
        const formFormat = Utils.checkboxToFormFormat(this.availableMemberCategories, this.department.memberCategories);
        (<FormArray>this.departmentForm.get('memberCategories'))
          .setValue(formFormat);
        this.departmentForm.get('handle').setValidators(this.department
          && [Validators.required, ValidationUtils.handleValidator, Validators.maxLength(25)]);

        const urlSuffix = this.department.university.handle;
        this.urlPrefix = this.definitionsService.getDefinitions()['applicationUrl'] + '/' + urlSuffix + '/';

        this.viewLink = this.createDepartmentViewLink();
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
        this.router.navigate(this.createDepartmentViewLink())
          .then(() => {
            this.snackBar.open('Department Saved!', null, {duration: 3000});
          });
      }, this.handleErrors);
  }

  private generateDepartmentRequestBody(): DepartmentPatchDTO {
    const departmentDTO: DepartmentPatchDTO = pick(this.departmentForm.value, this.formProperties);
    departmentDTO.memberCategories = Utils
      .checkboxFromFormFormat(this.availableMemberCategories, this.departmentForm.get('memberCategories').value);
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

  private createDepartmentViewLink() {
    return this.resourceService.routerLink(this.department)
  }
}
