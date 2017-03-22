import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as _ from 'lodash';
import DepartmentDTO = b.DepartmentDTO;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentDTO;
  departmentForm: FormGroup;


  constructor(private route: ActivatedRoute, private http: Http, private fb: FormBuilder, private snackBar: MdSnackBar) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.minLength(3), Validators.required, Validators.maxLength(255)]],
      memberCategories: [],
      documentLogo: [],
      handles: this.fb.group({
        departmentHandle: ['', [Validators.required, Validators.maxLength(15)]]
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
    const department: DepartmentDTO = _.pick(this.departmentForm.value, ['name', 'memberCategories', 'documentLogo']);
    department.handle = this.departmentForm.value.handles.departmentHandle;
    Object.assign(this.department, department);
    this.http.put('/api/departments/' + this.department.id, this.department)
      .subscribe(() => {
        this.snackBar.open("Department Saved!");
      });
  }
}
