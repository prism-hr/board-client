import {Component, OnInit} from '@angular/core';
import {
  Account,
  ForgotPasswordFormModel,
  LoginFormModel,
  RegistrationFormModel,
  Stormpath,
  StormpathErrorResponse
} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';
import {MdDialogRef} from '@angular/material';

@Component({
  template: `
    <div>
      <span>Your comments:</span>
      <textarea [(ngModel)]="comment"></textarea>
      <button pButton class="ui-button-success" [disabled]="!comment" label="Submit" (click)="submit()"></button>
    </div>
  `,
  styleUrls: []
})
export class PostCommentDialogComponent {

  comment: string;

  constructor(private dialogRef: MdDialogRef<PostCommentDialogComponent>) {
  }

  submit(): void {
    this.dialogRef.close(this.comment);
  }

}
