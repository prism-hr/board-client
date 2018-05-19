import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {DepartmentService} from '../department.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentDashboardRepresentation = b.DepartmentDashboardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {

  department: DepartmentRepresentation;
  dashboard: DepartmentDashboardRepresentation;

  canEdit: boolean;
  boards: BoardRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;
  showTasksSidebar: boolean;

  constructor(private route: ActivatedRoute, private title: Title, private resourceService: ResourceService,
              private departmentService: DepartmentService) {
  }

  ngOnInit() {
    this.route.data
      .switchMap(data => {
        this.department = data['department'];
        this.title.setTitle(this.department.name);
        this.canEdit = this.resourceService.canEdit(this.department);
        return this.departmentService.getDashboard(this.department);
      })
      .subscribe(dashboard => this.dashboard = dashboard);

  }


}
