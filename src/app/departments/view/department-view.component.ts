import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import {UserService} from "../../services/user.service";

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentRepresentation;
  canEdit: boolean;
  boards: BoardRepresentation[];

  constructor(private route: ActivatedRoute, private resourceService: ResourceService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.department = data['department'];
      this.canEdit = this.resourceService.canEdit(this.department);
    });

    this.userService.user$.subscribe(user => {
      if (user) {
        this.resourceService.getDepartmentBoards(this.department.id, true).subscribe(boards => {
          this.boards = boards;
        });
      } else {
        this.resourceService.getDepartmentBoards(this.department.id, false).subscribe(boards => {
          this.boards = boards;
        });
      }
    });
  }

}
