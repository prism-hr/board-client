import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import * as _ from 'lodash';
import {MdSnackBar} from '@angular/material';
import {DefinitionsService} from '../../../services/definitions.service';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import BoardSettingsDTO = b.BoardSettingsDTO;
import {NgForm} from '@angular/forms';

@Component({
  templateUrl: 'board-settings.component.html',
  styleUrls: ['board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {
  @ViewChild('settingsForm') settingsForm: NgForm;
  private board: BoardRepresentation;
  private boardSettings: BoardSettingsDTO;
  private JSON: any;
  private definitions: any;
  private formErrors: any;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private snackBar: MdSnackBar,
              private definitionsService: DefinitionsService) {
    this.JSON = JSON;
    this.definitions = definitionsService.getDefinitions();
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.boardSettings = _.pick(this.board, ['postCategories', 'defaultPostVisibility', 'handle'])
    });
  }

  submit() {
    this.http.put('/api/boards/' + this.board.id + '/settings', this.boardSettings)
      .subscribe(() => {
        this.snackBar.open('Board Saved!');
      }, (error: Response | any) => {
        if (error.status === 422) {
          const control = this.settingsForm.form.get('departmentHandle');
        }
      });
  }

}
