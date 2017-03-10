import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;

@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  private board: BoardDTO;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
    });
  }

  submit() {
    this.http.put('/api/boards/' + this.board.id, this.board)
      .subscribe(() => {
        this.snackBar.open("Board Saved!");
      });
  }
}
