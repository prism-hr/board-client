import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {AuthenticationDialogComponent} from '../authentication/authentication.dialog';
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Account, Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$: Observable<Account | boolean>;

  constructor(private dialog: MdDialog, private viewContainerRef: ViewContainerRef, private router: Router, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
  }

  showLogin() {
    let dialogRef: MdDialogRef<AuthenticationDialogComponent>;
    const config = new MdDialogConfig();
    config.data = {showRegister: false};
    config.viewContainerRef = this.viewContainerRef;

    dialogRef = this.dialog.open(AuthenticationDialogComponent, config);
    dialogRef.afterClosed().subscribe(() => {
      this.user$.subscribe(user => {
        if (user) {
          return this.router.navigate(['/']);
        }
      });
    });
  }

  logout() {
    this.stormpath.logout();
    return this.router.navigate(['']);
  }

}
