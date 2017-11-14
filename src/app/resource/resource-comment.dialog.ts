import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  template: `
    <div class="dialog-holder">
      <h2 mat-dialog-title>{{'definitions.action.' + action | translate}}</h2>

      <mat-dialog-content>
        <form>
          <div *ngIf="this.commentType !== 'no'" class="input-holder">
            <label style="display: block">Your comments <span *ngIf="commentType === 'optional'">(optional)</span></label>
            <textarea name="comment" [(ngModel)]="comment" class="ui-inputtext"></textarea>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions fxLayout="row" fxLayoutAlign="space-between">
        <button pButton class="ui-button-secondary" label="Cancel" mat-dialog-close></button>

        <button pButton class="ui-button ui-button-warning" [disabled]="commentType === 'required' && !comment"
                label="Submit" (click)="submit()"></button>

      </mat-dialog-actions>
    </div>
  `,
  styles: ['.dialog-holder {min-width: 350px;}']
})
export class ResourceCommentDialogComponent {

  comment: string;
  action: string;
  resource: ResourceRepresentation<any>;
  commentType: string;

  constructor(private dialogRef: MatDialogRef<ResourceCommentDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.action = data.action;
    this.resource = data.resource;
    if (this.action === 'SUSPEND' || this.action === 'REJECT') {
      this.commentType = 'required';
    } else if (this.action === 'ACCEPT' || this.action === 'CORRECT') {
      this.commentType = 'optional';
    } else if (this.action === 'RESTORE') {
      if ((<any>this.resource.state) === 'REJECTED') {
        this.commentType = 'optional';
      } else if ((<any>this.resource.state) === 'WITHDRAWN') {
        this.commentType = 'no';
      }
    }
  }

  submit(): void {
    let comment = this.comment && this.comment.trim();
    comment = comment !== '' ? comment : null;
    this.dialogRef.close({comment});
  }

}
