import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {Account, Stormpath} from 'angular-stormpath';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-list.component.html',
  styleUrls: ['department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  user: Account | boolean;
  departments: DepartmentRepresentation[];

  constructor(private resourceService: ResourceService, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.stormpath.user$.subscribe(user => {
      this.user = user;
      this.departments = null;
      if (user) {
        this.resourceService.getDepartments().subscribe(departments => {
          this.departments = departments;
        });
      }
    });
  }

}
