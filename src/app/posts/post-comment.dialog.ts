import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import PostRepresentation = b.PostRepresentation;

@Component({
  template: `
    <form>
      <h1>{{'definitions.action.' + action | translate}}</h1>
      <div *ngIf="this.commentType !== 'no'">
        <span>Your comments <span *ngIf="commentType === 'optional'">(optional)</span>:</span>
        <textarea name="comment" [(ngModel)]="comment"></textarea>
      </div>
      <button pButton class="ui-button-success" [disabled]="commentType === 'required' && !comment"
              label="Submit" type="submit" (click)="submit()"></button>
      <button pButton class="ui-button-text" label="Cancel" (click)="cancel()"></button>
    </form>
  `
})
export class PostCommentDialogComponent {

  comment: string;
  action: string;
  post: PostRepresentation;
  commentType: string;

  constructor(private dialogRef: MdDialogRef<PostCommentDialogComponent>, @Inject(MD_DIALOG_DATA) private data: any) {
    this.action = data.action;
    this.post = data.post;
    if (this.action === 'SUSPEND' || this.action === 'REJECT') {
      this.commentType = 'required';
    } else if (this.action === 'ACCEPT' || this.action === 'CORRECT') {
      this.commentType = 'optional';
    } else if (this.action === 'RESTORE') {
      if ((<any>this.post.state) === 'REJECTED') {
        this.commentType = 'optional';
      } else if ((<any>this.post.state) === 'WITHDRAWN') {
        this.commentType = 'no';
      }
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  submit(): void {
    let comment = this.comment && this.comment.trim();
    comment = comment !== '' ? comment : null;
    this.dialogRef.close({comment});
  }

}
