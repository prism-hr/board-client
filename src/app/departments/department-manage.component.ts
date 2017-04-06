import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-manage.component.html',
  styleUrls: ['department-manage.component.scss']
})
export class DepartmentManageComponent implements OnInit {
  private department: DepartmentRepresentation;
  private navigationUrl: string

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.navigationUrl = '/' + this.department.handle;
    });
  }

}
