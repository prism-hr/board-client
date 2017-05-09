import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {Response} from '@angular/http';

@Component({
  selector: 'b-xeditable-input',
  template: `
    <span [hidden]="editing" [ngClass]="{editable: canEdit}" (click)="edit()"><span>{{resource[propertyName]}}</span>
    </span>
    <span *ngIf="editing">
      <input *ngIf="fieldType === 'input'" pInputText [(ngModel)]="editedName" required>
      <textarea *ngIf="fieldType === 'textarea'" pInputTextarea [(ngModel)]="editedName" required></textarea>
      <button pButton type="button" class="ui-button-success ui-button-small" (click)="ok()" icon="fa-check"></button>
      <button pButton type="button" class="ui-button-warning ui-button-small" (click)="cancel()" icon="fa-close"></button>
    </span>
  `,
  styleUrls: ['xeditable.scss']
})
export class XeditableInputComponent {

  @Input() canEdit: boolean;
  @Input() resource: any;
  @Input() propertyName: string;
  @Input() fieldType: string;

  editedName: string;
  editing: boolean;

  constructor(private resourceService: ResourceService, private eRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  documentClick(event) {
    if (!this.eRef.nativeElement.contains(event.target)) { // clicked outside
      if (this.editing) {
        this.cancel();
      }
    }
  }

  edit() {
    if (!this.canEdit) {
      return;
    }
    this.editing = true;
    this.editedName = this.resource[this.propertyName];
  }

  cancel() {
    this.editing = false;
  }

  ok() {
    this.resourceService.patchBoard(this.resource.id, {[this.propertyName]: this.editedName})
      .subscribe(board => {
        this.resource[this.propertyName] = board[this.propertyName];
        this.editing = false;
      }, (error: Response) => {
        if (error.status === 422) {
          if (error.json().exceptionCode === 'DUPLICATE_BOARD') {
            // this.boardForm.controls['name'].setErrors({duplicateBoard: true});
          }
        }
      });
  }

}
