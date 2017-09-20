import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'b-app-root',
  template: `
    <b-header></b-header>
    <div class="page-width flex-grow">
      <router-outlet></router-outlet>
    </div>
    <footer-component></footer-component>
  `,
  styleUrls: []
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private translate: TranslateService) {
    translate.use('en');
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}
