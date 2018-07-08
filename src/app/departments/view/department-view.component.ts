import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {combineLatest} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {switchMap, tap} from 'rxjs/operators';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
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

  newPostLink: any[];
  canEdit: boolean;
  boards: BoardRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;

  constructor(private route: ActivatedRoute, private title: Title, private resourceService: ResourceService,
              private departmentService: DepartmentService, private userService: UserService) {
  }

  ngOnInit() {
    combineLatest(this.userService.user$, this.route.data)
      .pipe(
        tap(([user, data]) => {
          this.department = data['department'];
          this.newPostLink = ['/newPost', {departmentId: this.department.id}]
          this.title.setTitle(this.department.name);
          this.canEdit = this.resourceService.canEdit(this.department);
        }),
        switchMap(([user, data]) => {
          return user ? this.departmentService.getDashboard(this.department) : of(null);
        }))
      .subscribe(dashboard => {
        this.dashboard = dashboard;
      });

  }


}

