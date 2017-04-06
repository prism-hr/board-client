import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'board-manage.component.html',
  styleUrls: ['board-manage.component.scss']
})
export class BoardManageComponent implements OnInit {
  private board: BoardRepresentation;
  private navigationUrl: string;
  private canManage: boolean;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.navigationUrl = '/' + this.board.department.handle + '/' + this.board.handle;
      this.canManage = (this.board.actions as any as string[]).includes('EDIT');
    });
  }

}
