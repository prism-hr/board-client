import {Injectable, ViewContainerRef} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthenticationDialog} from './authentication.dialog';
import {MdDialogConfig, MdDialogRef, MdDialog} from '@angular/material';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private dialog: MdDialog) {}

  canActivate() {
    let dialogRef: MdDialogRef<AuthenticationDialog>;
    let config = new MdDialogConfig();
    // config.viewContainerRef = this.viewContainerRef;

    dialogRef = this.dialog.open(AuthenticationDialog, config);
    return dialogRef.afterClosed();
  }
}
