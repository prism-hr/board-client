import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Response} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {ResourceService} from '../../services/resource.service';
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import {DefinitionsService} from '../../services/definitions.service';

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentRepresentation;
  departmentForm: FormGroup;
  urlPrefix: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private snackBar: MdSnackBar, private resourceService: ResourceService, private definitionsService: DefinitionsService) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.minLength(3), Validators.required, Validators.maxLength(100)]],
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
    const department: DepartmentPatchDTO = _.pick(this.departmentForm.value, ['name', 'memberCategories', 'documentLogo', 'handle']);
    this.resourceService.patchDepartment(this.department.id, department)
      .subscribe(() => {
        this.router.navigate([department.handle])
          .then(() => {
            this.snackBar.open('Department Saved!');
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
