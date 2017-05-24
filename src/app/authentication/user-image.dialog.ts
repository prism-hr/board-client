import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;
import DocumentRepresentation = b.DocumentRepresentation;

@Component({
  template: `
    <div class="avatar-box">
      <h2>Would you like to specify your avatar?</h2>
      <b-file-upload [(ngModel)]="image" type="logo" class="avatar"></b-file-upload>

      <div *ngIf="showRequestStateBox">
        <label>Don't show it again</label>
        <p-checkbox [(ngModel)]="dontShowAgain" [binary]="true"></p-checkbox>
      </div>

      <div fxLayout="row" fxLayoutAlign="space-between center" class="actions-holder">
        <button pButton class="ui-button-secondary" label="Ok" (click)="ok()" [disabled]="!image"></button>
        <button pButton class="ui-button-warning full-width" label="Skip" (click)="skip()"></button>
      </div>
    </div>
  `
})
export class UserImageDialogComponent implements OnInit {

  user: UserRepresentation;
  image: DocumentRepresentation;
  showRequestStateBox: boolean;
  dontShowAgain: boolean;

  constructor(private dialogRef: MdDialogRef<UserImageDialogComponent>, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe((user: UserRepresentation) => {
      this.user = user;
      this.image = user.documentImage;
      if (user.documentImageRequestState === 'DISPLAY_AGAIN') {
        this.showRequestStateBox = true;
      }
    }).unsubscribe();
  }

  ok() {
    this.userService.patchUser({documentImage: this.image})
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  skip() {
    if (this.user.documentImageRequestState !== 'DISPLAY_NEVER') {
      this.userService.patchUser({documentImageRequestState: this.dontShowAgain ? 'DISPLAY_NEVER' : 'DISPLAY_AGAIN'})
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

}
