import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Account, Stormpath} from 'angular-stormpath';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private user$: Observable<Account | boolean>;

  constructor(private translate: TranslateService, private stormpath: Stormpath) {
    translate.use('en');
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
  }

}
