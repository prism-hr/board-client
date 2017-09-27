import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import {EntityFilter} from '../../general/filter/filter.component';

@Component({
  templateUrl: 'department-list.component.html',
  styleUrls: ['department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  departments: DepartmentRepresentation[];

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.resourceService.getResources('DEPARTMENT', {state: 'ACCEPTED'}).subscribe(departments => {
      this.departments = departments;
    });
  }

  filterApplied(filter: EntityFilter) {
    this.resourceService.getResources('DEPARTMENT', filter).subscribe(departments => {
      this.departments = departments;
    });
  }

}
