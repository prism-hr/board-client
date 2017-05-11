import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Account, Stormpath} from 'angular-stormpath';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from './services/user.service';

@Component({
  selector: 'b-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  private user$: Observable<Account | boolean>;

  constructor(private translate: TranslateService, private userService: UserService) {
    translate.use('en');
  }

  ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

}
