import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;
import DocumentRepresentation = b.DocumentRepresentation;

@Component({
  template: `
    <h2 md-dialog-title>Would you like to specify your avatar?</h2>

    <md-dialog-content>
      <b-file-upload [(ngModel)]="image" type="logo" class="avatar"></b-file-upload>
    </md-dialog-content>

    <md-dialog-actions>
      <button pButton class="ui-button-secondary" label="Ok" (click)="ok()" [disabled]="!image"></button>
      <button *ngIf="user.documentImageRequestState !== 'DISPLAY_FIRST'" pButton class="ui-button-warning full-width"
              label="Do not show it again" (click)="skip('DISPLAY_NEVER')"></button>
      <button pButton class="ui-button-warning full-width" label="I'll do it later" (click)="skip('DISPLAY_AGAIN')"></button>
    </md-dialog-actions>
  `
})
export class UserImageDialogComponent implements OnInit {

  user: UserRepresentation;
  image: DocumentRepresentation;
  showRequestStateBox: boolean;

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

  skip(documentImageRequestState) {
    if (this.user.documentImageRequestState !== 'DISPLAY_NEVER') {
      this.userService.patchUser({documentImageRequestState: documentImageRequestState})
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

}
