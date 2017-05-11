import {Component, OnInit} from '@angular/core';
import {Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;
import {MdDialog} from '@angular/material';
import {UserImageDialogComponent} from '../authentication/user-image.dialog';

@Component({
  selector: 'b-header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$: Observable<UserRepresentation | boolean>;

  constructor(private router: Router, private stormpath: Stormpath, private userService: UserService, private authGuard: AuthGuard,
              private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

  showLogin() {
    this.authGuard.ensureAuthenticated(false) // open dialog if not authenticated
      .subscribe(authenticated => {
        if (authenticated) {
          return this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.stormpath.logout();
    return this.router.navigate(['']);
  }

  openImageDialog() {
    this.dialog.open(UserImageDialogComponent);
  }
}
