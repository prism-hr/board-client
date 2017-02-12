import {Component, OnInit} from "@angular/core";
import {Stormpath, Account} from "angular-stormpath";
import {Observable} from "rxjs";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  private user$: Observable<Account | boolean>;
  private loggedIn$: Observable<boolean>;
  private login: boolean;
  private register: boolean;

  constructor(public stormpath: Stormpath) {
  }

  ngOnInit() {
    this.user$ = this.stormpath.user$;
    this.loggedIn$ = this.user$.map(user => !!user);
    this.login = true;
    this.register = false;
  }

  showLogin() {
    this.register = false;
    this.login = true;
  }

  showRegister() {
    this.login = false;
    this.register = true;
  }

  logout() {
    this.stormpath.logout();
  }

}
