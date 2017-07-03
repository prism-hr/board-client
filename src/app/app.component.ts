import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {AuthGuard} from './authentication/auth-guard.service';

@Component({
  selector: 'b-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private route: ActivatedRoute, private translate: TranslateService, private authGuard: AuthGuard) {
    translate.use('en');
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params.showLogin) {
          this.authGuard.ensureAuthenticated().subscribe();
        }
      });

  }

}
