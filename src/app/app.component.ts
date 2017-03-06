import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Account, Stormpath} from 'angular-stormpath';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private user$: Observable<Account | boolean>;

  constructor(private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
  }

}
