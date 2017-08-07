import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {
  department: DepartmentRepresentation;
  canEdit: boolean;
  boards: BoardRepresentation[];

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.department = data['department'];
      this.canEdit = this.resourceService.canEdit(this.department);
    });
    this.resourceService.getDepartmentBoards(this.department.id)
      .subscribe(boards => this.boards = boards);

  }

}
