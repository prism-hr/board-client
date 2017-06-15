import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {DefinitionsService} from '../../../services/definitions.service';
import {ResourceService} from '../../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import BoardPatchDTO = b.BoardPatchDTO;

@Component({
  templateUrl: 'board-settings.component.html',
  styleUrls: ['board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {
  definitions: { [key: string]: any };
  board: BoardRepresentation;
  boardForm: FormGroup;
  urlPrefix: string;

  boardProperties = ['name', 'summary', 'postCategories', 'defaultPostVisibility', 'handle'];

  constructor(private route: ActivatedRoute, private cdf: ChangeDetectorRef, private fb: FormBuilder, private router: Router,
              private resourceService: ResourceService, private definitionsService: DefinitionsService) {
    this.definitions = definitionsService.getDefinitions();
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.maxLength(1000)]],
      postCategories: [[]],
      defaultPostVisibility: [null, Validators.required],
      handle: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      const value: any = _.pick(this.board, this.boardProperties);
      this.boardForm.setValue(value);
      this.urlPrefix = this.definitionsService.getDefinitions()['applicationUrl'] + '/' + this.board.department.handle + '/';
      this.cdf.detectChanges();
    });
  }

  submit() {
    const board: BoardPatchDTO = _.pick(this.boardForm.value, this.boardProperties);
    this.resourceService.patchBoard(this.board.id, board)
      .subscribe(() => {
        Object.assign(this.board, board);
        this.router.navigate([this.board.department.handle, board.handle]);
      }, (error: Response | any) => {
        if (error.status === 422) {
          if (error.json().exceptionCode === 'DUPLICATE_BOARD_HANDLE') {
            (this.boardForm.controls['handles'] as FormGroup).controls['boardHandle'].setErrors({duplicateHandle: true});
          }
        }
      });
  }

}
