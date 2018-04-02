import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BoardListComponent} from './boards/list/board-list.component';

@Component({
  selector: 'b-app-root',
  template: `
    <b-header></b-header>
    <div class="page-width flex-grow">
      <router-outlet></router-outlet>
    </div>
    <div id="freshwidget-button" class="freshwidget-button right">
      <a href="https://prismhr.freshdesk.com/" class="freshwidget-theme" target="_blank" translate>
        Support
      </a>
    </div>
    <footer-component></footer-component>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  @HostBinding('class') resourceScope: string = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private translate: TranslateService) {
    translate.use('en');
  }

  ngOnInit(): void {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => {
        let child = this.activatedRoute.firstChild;
        let resourceScope = null;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
            const component = child.snapshot.component;
            if (component && component['name'] === 'HomeComponent') {
              return 'post';
            } else if (component && component['name'] === 'BoardListComponent') {
              return 'board';
            } else if (component && component['name'] === 'DepartmentListComponent') {
              return 'department';
            }
            if (child.snapshot.data && child.snapshot.data['resourceScope']) {
              resourceScope = child.snapshot.data['resourceScope'];
            }
          } else {
            return resourceScope;
          }
        }
        return null;
      })
      .subscribe((resourceScope: string) => {
        this.resourceScope = resourceScope || 'generic';
        window.scrollTo(0, 0);
      });

  }
}
