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
  urlPrefix: string;

  constructor(private route: ActivatedRoute, private http: Http, private fb: FormBuilder, private router: Router,
              private snackBar: MdSnackBar, private definitionsService: DefinitionsService) {
    this.definitions = definitionsService.getDefinitions();
    this.settingsForm = this.fb.group({
      postCategories: [[]],
      defaultPostVisibility: [null, Validators.required],
      handle: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      const value: any = _.pick(this.board, ['postCategories', 'defaultPostVisibility', 'handle']);
      this.settingsForm.setValue(value);
      this.urlPrefix = this.definitionsService.getDefinitions()['applicationUrl'] + '/' + this.board.department.handle + '/';
    });
  }

  submit() {
    const board: BoardPatchDTO = _.pick(this.settingsForm.value, ['postCategories', 'defaultPostVisibility', 'handle']);
    this.http.patch('/api/boards/' + this.board.id, board)
      .subscribe(() => {
        this.router.navigate([this.board.department.handle, board.handle, 'settings'])
          .then(() => {
            this.snackBar.open('Board Saved!', null, {duration: 500});
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
