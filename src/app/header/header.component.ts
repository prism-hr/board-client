import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import {AuthenticationDialog} from '../authentication/authentication.dialog';
import {ViewContainerRef, Component, OnInit} from '@angular/core';
import {Stormpath, Account} from 'angular-stormpath';
import {Observable} from 'rxjs';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private user$: Observable<Account | boolean>;

  constructor(private dialog: MdDialog, private viewContainerRef: ViewContainerRef, public stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
  }

  showLogin(ev: any) {
    let dialogRef: MdDialogRef<AuthenticationDialog>;
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    dialogRef = this.dialog.open(AuthenticationDialog, config);

    return dialogRef.afterClosed();
  }

  // showRegister(ev: any) {
  //     this.$mdDialog.show({
  //         template: '<motivation-check></motivation-check>',
  //         parent: angular.element(document.body),
  //         targetEvent: ev,
  //         clickOutsideToClose: true,
  //         fullscreen: true
  //     });
  // }
  //
  // advertise() {
  //     this.$state.go('register');
  // }

  logout(): void {
    this.stormpath.logout();
  }
}
