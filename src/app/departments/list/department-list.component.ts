import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'department-list.component.html',
  styleUrls: ['department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  user: UserRepresentation | boolean;
  departments: DepartmentRepresentation[];

  constructor(private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
      this.departments = null;
      if (user) {
        this.resourceService.getDepartments().subscribe(departments => {
          this.departments = departments;
        });
      }
    });
  }

  filterApplied(filter) {
    this.resourceService.getDepartments(filter.searchTerm).subscribe(departments => {
      this.departments = departments;
    });
  }

}
