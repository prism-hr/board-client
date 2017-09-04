import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {combineLatest} from 'rxjs/observable/combineLatest';
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
    combineLatest(this.route.parent.data, this.route.data)
      .subscribe(([parentData, data]: [Data, Data]) => {
        this.department = parentData['department'];
        this.memberships = data['memberships'];
      });
  }

}
