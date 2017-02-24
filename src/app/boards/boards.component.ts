import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import BoardDTO = b.BoardDTO;

@Component({
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  private boards: BoardDTO[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.boards = this.route.snapshot.data['boards'];
  }
}
