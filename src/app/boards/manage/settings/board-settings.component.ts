import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import * as _ from 'lodash';
import {MdSnackBar} from '@angular/material';
import {DefinitionsService} from '../../../services/definitions.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import BoardRepresentation = b.BoardRepresentation;
import BoardPatchDTO = b.BoardPatchDTO;

@Component({
  templateUrl: 'board-settings.component.html',
  styleUrls: ['board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {
  definitions: { [key: string]: any };
  board: BoardRepresentation;
  settingsForm: FormGroup;

  constructor(private route: ActivatedRoute, private http: Http, private fb: FormBuilder, private router: Router,
              private snackBar: MdSnackBar,              private definitionsService: DefinitionsService) {
    this.definitions = definitionsService.getDefinitions();
    this.settingsForm = this.fb.group({
      postCategories: [[]],
      defaultPostVisibility: [null, Validators.required],
      handles: this.fb.group({
        departmentHandle: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(15)]],
        boardHandle: ['', [Validators.required, Validators.maxLength(25)]]
      })
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      const value: any = _.pick(this.board, ['postCategories', 'defaultPostVisibility']);
      value.handles = {departmentHandle: this.board.department.handle, boardHandle: this.board.handle};
      this.settingsForm.setValue(value);
    });
  }

  submit() {
    const board: BoardPatchDTO = _.pick(this.settingsForm.value, ['postCategories', 'defaultPostVisibility']);
    board.handle = this.settingsForm.value.handles.boardHandle;
    this.http.patch('/api/boards/' + this.board.id, board)
      .subscribe(() => {
        this.router.navigate([this.board.department.handle, board.handle, 'settings'])
          .then(() => {
            this.snackBar.open('Board Saved!');
          });
      }, (error: Response | any) => {
        if (error.status === 422) {
          if (error.json().exceptionCode === 'DUPLICATE_BOARD_HANDLE') {
            (this.settingsForm.controls['handles'] as FormGroup).controls['boardHandle'].setErrors({duplicateHandle: true});
          }
        }
      });
  }

}
