import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {Response} from '@angular/http';
import * as _ from 'lodash';
import {ResourceService} from '../services/resource.service';

@Component({
  selector: 'b-xeditable-input',
  template: `
    <span [hidden]="editing" [ngClass]="{editable: canEdit}" (click)="edit()"><span>{{resource[propertyName]}}</span>
    </span>
    <span *ngIf="editing">
      <input *ngIf="fieldType === 'input'" pInputText [(ngModel)]="editedName" required>
      <textarea class="ui-inputtext" *ngIf="fieldType === 'textarea'" pInputTextarea [(ngModel)]="editedName" required></textarea>
      <div [ngClass]="{'textarea-container':fieldType === 'textarea', 'input-container':fieldType === 'input' }">
        <button pButton type="button" class="ui-button-success ui-button-small" (click)="ok()" icon="fa-check"></button>
      <button pButton type="button" class="ui-button-warning ui-button-small" (click)="cancel()" icon="fa-close"></button>
      </div>
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
        this.ok();
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
    const scopeCapitalized = _.capitalize(this.resource.scope);
    this.resourceService['patch' + scopeCapitalized](this.resource.id, {[this.propertyName]: this.editedName})
      .subscribe(resource => {
        this.resource[this.propertyName] = resource[this.propertyName];
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
