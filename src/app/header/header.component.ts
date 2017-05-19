import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: UserRepresentation;

  constructor(private router: Router, private userService: UserService, private authGuard: AuthGuard) {
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe(user => this.user = user);
  }

  showLogin() {
    this.authGuard.ensureAuthenticated(false).first() // open dialog if not authenticated
      .subscribe(authenticated => {
        if (authenticated) {
          return this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.userService.logout().subscribe();
    return this.router.navigate(['']);
  }
}
