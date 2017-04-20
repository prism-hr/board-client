import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'board-manage.component.html',
  styleUrls: ['board-manage.component.scss']
})
export class BoardManageComponent implements OnInit {
  board: BoardRepresentation;
  canManage: boolean;
  items: MenuItem[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.canManage = !!this.board.actions.find(a => a.action as any === 'EDIT');
      this.items = [{label: 'View', routerLink: [this.board.department.handle, this.board.handle]}, {
        label: 'Settings',
        routerLink: [this.board.department.handle, this.board.handle, 'settings']
      }];
    });
  }

}
