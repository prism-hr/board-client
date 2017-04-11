import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentRepresentation;
  departmentForm: FormGroup;


  constructor(private route: ActivatedRoute, private http: Http, private fb: FormBuilder, private router: Router,
              private snackBar: MdSnackBar) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.minLength(3), Validators.required, Validators.maxLength(255)]],
      memberCategories: [],
      documentLogo: [],
      handles: this.fb.group({
        departmentHandle: ['', [Validators.required, Validators.maxLength(25)]]
      })
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      const value: any = Object.assign({}, this.department);
      value.handles = {departmentHandle: this.department.handle};
      this.departmentForm.reset(value);
    });
  }

  submit() {
    const department: DepartmentPatchDTO = _.pick(this.departmentForm.value, ['name', 'memberCategories', 'documentLogo']);
    department.handle = this.departmentForm.value.handles.departmentHandle;
    this.http.patch('/api/departments/' + this.department.id, department)
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
