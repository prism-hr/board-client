import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../services/user.service';
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  template: `
    <div>
      <h2 class="center">
        Unsubscribe from emails for {{resource.name}}
      </h2>

      <div *ngIf="!unsubscribed">
        Are you sure you want to turn off email notifications?
        <button pButton class="ui-button-warning" (click)="unsubscribe()" label="Yes"></button>
        <button pButton class="ui-button-success" (click)="cancel()" label="No"></button>
      </div>

      <div *ngIf="unsubscribed">
        <p-messages
          [value]="[{severity:'info', summary:'Unsubscribed',
            detail:'You have successfully unsubscribed from emails.'}]"
          [closable]="false"></p-messages>
      </div>
    </div>
  `,
  styleUrls: []
})
export class UnsubscribeDialogComponent implements OnInit {

  unsubscribed: boolean;
  resource: ResourceRepresentation<any>;
  uuid: string;

  constructor(private dialogRef: MatDialogRef<UnsubscribeDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any, private userService: UserService) {
    this.resource = data.resource;
    this.uuid = data.uuid;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  unsubscribe() {
    this.userService.setSuppression(this.resource, true, this.uuid)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
