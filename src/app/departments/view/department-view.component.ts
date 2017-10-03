import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentRepresentation;
  canEdit: boolean;
  boards: BoardRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;

  constructor(private route: ActivatedRoute, private title: Title, private resourceService: ResourceService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.department = data['department'];
      this.title.setTitle(this.department.name);
      this.canEdit = this.resourceService.canEdit(this.department);
    });

    this.userService.user$.subscribe(user => {
      this.user = user;
      this.loadBoards();
    });
  }

  filterApplied(filter: EntityFilter) {
    this.loadBoards(filter);
  }

  loadBoards(filter?: EntityFilter) {
    this.filter = filter || this.filter || {};
    this.filter.includePublic = !this.user;
    this.resourceService.getDepartmentBoards(this.department.id, this.filter).subscribe(boards => {
      this.boards = boards;
    });
  }
}
