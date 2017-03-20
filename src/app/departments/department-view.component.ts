import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
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
      memberCategories: []
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.departmentForm.reset(this.department);
    });
  }

  submit() {
    Object.assign(this.department, this.departmentForm.value);
    this.http.put('/api/departments/' + this.department.id, this.department)
      .subscribe(() => {
        this.snackBar.open("Department Saved!");
      });
  }
}
