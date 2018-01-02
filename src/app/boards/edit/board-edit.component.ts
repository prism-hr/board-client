import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {pick} from 'lodash';
import {ResourceCommentDialogComponent} from '../../resource/resource-comment.dialog';
import {RollbarService} from '../../rollbar/rollbar.service';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceActionView, ResourceService} from '../../services/resource.service';
import {Utils} from '../../services/utils';
import {ValidationUtils} from '../../validation/validation.utils';
import Action = b.Action;
import BoardPatchDTO = b.BoardPatchDTO;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'board-edit.component.html',
  styleUrls: ['board-edit.component.scss']
})
export class BoardEditComponent implements OnInit {
  availablePostVisibilities: string[];
  board: BoardRepresentation;
  boardForm: FormGroup;
  urlPrefix: string;
  actionView: ResourceActionView;
  availableActions: Action[];

  boardProperties = ['name', 'summary', 'postCategories', 'handle', 'documentLogo'];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private title: Title,
              private dialog: MatDialog, private rollbar: RollbarService, private resourceService: ResourceService,
              private definitionsService: DefinitionsService) {
    this.availablePostVisibilities = definitionsService.getDefinitions()['postVisibility'];
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      postCategories: [[]],
      handle: ['', [Validators.required, ValidationUtils.handleValidator, Validators.maxLength(25)]],
      documentLogo: [],
    });
  }

  ngOnInit() {
    this.route.parent.parent.data.subscribe(data => {
      this.board = data['board'];
      this.title.setTitle(this.board.name + ' - Edit');
      const value: any = pick(this.board, this.boardProperties);
      this.boardForm.setValue(value);

      this.actionView = this.resourceService.getActionView(this.board);
      this.availableActions = this.board.actions.map(a => a.action);

      this.urlPrefix = this.definitionsService.getDefinitions()['applicationUrl'] + '/' + this.board.department.university.handle + '/'
        + this.board.department.handle + '/';
    });
  }

  update() {
    this.boardForm['submitted'] = true;
    if (this.boardForm.invalid) {
      this.rollbar.warn('Board action validation error: ' + Utils.getFormErrors(this.boardForm));
      return;
    }
    const boardPatch: BoardPatchDTO = pick(this.boardForm.value, this.boardProperties);
    this.resourceService.patchBoard(this.board.id, boardPatch)
      .subscribe(board => {
        Object.assign(this.board, boardPatch);
        this.router.navigate([this.board.department.university.handle, this.board.department.handle, board.handle]);
      }, (error: HttpErrorResponse) => {
        if (error.status === 409) {
          if (error.error.exceptionCode === 'DUPLICATE_BOARD') {
            this.boardForm.get('name').setErrors({duplicateHandle: true});
          } else if (error.error.exceptionCode === 'DUPLICATE_BOARD_HANDLE') {
            this.boardForm.get('handle').setErrors({duplicateHandle: true});
          }
        }
      });
  }

  executeAction(action: Action, sendForm?: boolean) {
    this.boardForm['submitted'] = true;
    if (this.boardForm.invalid) {
      this.rollbar.warn('Board action validation error: ' + Utils.getFormErrors(this.boardForm));
      return;
    }
    const dialogRef = this.dialog.open(ResourceCommentDialogComponent, {data: {action, resource: this.board}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const requestBody: BoardPatchDTO = sendForm ? pick(this.boardForm.value, this.boardProperties) : {};
        requestBody.comment = result.comment;
        this.resourceService.executeAction(this.board, action, requestBody)
          .subscribe(() => {
            return this.router.navigate(this.resourceService.routerLink(this.board));
          });
      }
    });
  }
}
