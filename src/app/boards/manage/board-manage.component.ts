import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;

@Component({
  templateUrl: 'board-manage.component.html',
  styleUrls: ['board-manage.component.scss']
})
export class BoardManageComponent implements OnInit {
  private board: BoardDTO;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.board = data['board'];
    });
  }

}
