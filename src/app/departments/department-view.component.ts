import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import DepartmentDTO = b.DepartmentDTO;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  private department: DepartmentDTO;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
    });
  }

  submit() {
    this.http.put('/api/departments/' + this.department.id, this.department)
      .subscribe(() => {
        this.snackBar.open("Department Saved!");
      });
  }
}
