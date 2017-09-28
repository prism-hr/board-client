import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import {Title} from '@angular/platform-browser';

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentRepresentation;
  canEdit: boolean;
  boards: BoardRepresentation[];

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
      this.resourceService.getDepartmentBoards(this.department.id, !user).subscribe(boards => {
        this.boards = boards;
      });
    });
  }

}
