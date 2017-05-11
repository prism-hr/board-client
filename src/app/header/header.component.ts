import {Component, OnInit} from '@angular/core';
import {Account, Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';

@Component({
  selector: 'b-header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$: Observable<Account | boolean>;

  constructor(private router: Router, private stormpath: Stormpath, private authGuard: AuthGuard) {
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
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

}
