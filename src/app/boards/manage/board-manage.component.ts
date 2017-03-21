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
  private navigationUrl: string

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.board = data['board'];
      this.navigationUrl = '/' + this.board.department.handle + '/' + this.board.handle;
    });
  }

}
