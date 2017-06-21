import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  availableMemberCategories: string[];
  department: DepartmentRepresentation;
  departmentForm: FormGroup;
  urlPrefix: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private snackBar: MdSnackBar, private resourceService: ResourceService, private definitionsService: DefinitionsService) {
    this.availableMemberCategories = definitionsService.getDefinitions()['memberCategory'];
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      memberCategories: [],
      documentLogo: [],
      handle: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.departmentForm.reset(this.department);
      this.urlPrefix = this.definitionsService.getDefinitions()['applicationUrl'] + '/';
    });
  }

  submit() {
    const department: DepartmentPatchDTO = _.pick(this.departmentForm.value,
      ['name', 'summary', 'memberCategories', 'documentLogo', 'handle']);
    this.resourceService.patchDepartment(this.department.id, department)
      .subscribe(() => {
        this.router.navigate([department.handle])
          .then(() => {
            this.snackBar.open('Department Saved!', null, {duration: 1500});
          });
      }, (error: Response) => {
        if (error.status === 422) {
          if (error.json().exceptionCode === 'DUPLICATE_DEPARTMENT') {
            this.departmentForm.controls['name'].setErrors({duplicateDepartment: true});
          }
        }
      });
  }
}
