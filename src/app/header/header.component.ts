import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import {AuthenticationDialog} from '../authentication/authentication.dialog';
import {ViewContainerRef, Component, OnInit} from '@angular/core';
import {Stormpath, Account} from 'angular-stormpath';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {MotivationCheckDialog} from './motivation-check.dialog';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private user$: Observable<Account | boolean>;

  constructor(private dialog: MdDialog, private viewContainerRef: ViewContainerRef, private router: Router, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
  }

  showLogin() {
    let dialogRef: MdDialogRef<AuthenticationDialog>;
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    dialogRef = this.dialog.open(AuthenticationDialog, config);
    return dialogRef.afterClosed();
  }

  showMotivationCheck() {
    let dialogRef: MdDialogRef<MotivationCheckDialog>;
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    dialogRef = this.dialog.open(MotivationCheckDialog, config);
    return dialogRef.afterClosed();
  }

  // advertise() {
  //     this.$state.go('register');
  // }

  logout() {
    this.stormpath.logout();
    return this.router.navigate(['']);
  }
}
