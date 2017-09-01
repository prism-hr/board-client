import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRoleRepresentation = b.UserRoleRepresentation;

@Component({
  templateUrl: 'department-memberships.component.html',
  styleUrls: ['department-memberships.component.scss']
})
export class DepartmentMembershipsComponent implements OnInit {

  department: DepartmentRepresentation;
  memberships: UserRoleRepresentation[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.data
      .map(data => {
        return data['department'];
      })
      .flatMap(department => {
        return this.route.data.map(data => {
          return [department, data['memberships']];
        });
      })
      .subscribe(([department, memberships]) => {
        this.department = department;
        this.memberships = memberships;
      });
  }

}
