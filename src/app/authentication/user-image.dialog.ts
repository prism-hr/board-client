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
      <div fxLayout="row" fxLayoutAlign="space-between center" class="actions-holder">
        <button pButton class="ui-button-secondary" label="Ok" (click)="ok()" [disabled]="!image"></button>
        <button pButton class="ui-button-warning full-width" label="Skip" (click)="skip()"></button>
      </div>
    </div>
  `
})
export class UserImageDialogComponent implements OnInit {

  user: UserRepresentation | boolean;
  image: DocumentRepresentation;

  constructor(private dialogRef: MdDialogRef<UserImageDialogComponent>, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe((user: UserRepresentation) => {
      this.user = user;
      this.image = user.documentImage;
    });
  }

  ok() {
    this.userService.update({documentImage: this.image})
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  skip() {
    this.dialogRef.close();
  }

}
