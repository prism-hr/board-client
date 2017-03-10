import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import BoardSettingsDTO = b.BoardSettingsDTO;
import * as _ from 'lodash';
import {MdSnackBar} from '@angular/material';

@Component({
  templateUrl: 'board-settings.component.html',
  styleUrls: ['board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {
  private board: BoardRepresentation;
  private boardSettings: BoardSettingsDTO;
  private JSON: any;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private snackBar: MdSnackBar) {
    this.JSON = JSON;
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.boardSettings = _.pick(this.board, ['postCategories'])
    });
  }

  submit() {
    this.http.put('/api/boards/' + this.board.id + '/settings', this.boardSettings)
      .subscribe(() => {
        this.snackBar.open("Board Saved!");
      });
  }

}
