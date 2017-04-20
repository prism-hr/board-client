import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {Response} from '@angular/http';

@Component({
  selector: 'b-xeditable-input',
  template: `
    <span *ngIf="!editing" (click)="edit()">{{resource[propertyName]}}
    </span>
    <span *ngIf="editing">
      <input pInputText [(ngModel)]="editedName" required>
      <button pButton type="button" (click)="ok()" icon="fa-check"></button>
      <button pButton type="button" (click)="cancel()" icon="fa-close"></button>
    </span>
  `,
  styles: ['']
})
export class XeditableInputComponent implements OnInit {

  @Input() resource: any;
  @Input() propertyName: string;

  editedName: string;
  editing: boolean;

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit(): void {
  }

  edit() {
    this.editing = true;
    this.editedName = this.resource[this.propertyName];
  }

  cancel() {
    this.editing = false;
  }

  ok() {
    this.resourceService.patchBoard(this.resource.id, {[this.propertyName]: this.editedName})
      .subscribe(board => {
        this.resource[this.propertyName] = board.name;
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
