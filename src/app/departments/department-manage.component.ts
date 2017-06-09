import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-manage.component.html',
  styleUrls: ['department-manage.component.scss']
})
export class DepartmentManageComponent implements OnInit {
  department: DepartmentRepresentation;
  items: MenuItem[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.department = data['department'];
      this.items = [{label: 'View', routerLink: ['/', this.department.handle], routerLinkActiveOptions: {exact: true}},
        {label: 'Users', routerLink: ['/', this.department.handle, 'users'], routerLinkActiveOptions: {exact: true}}];
    });
  }

}
