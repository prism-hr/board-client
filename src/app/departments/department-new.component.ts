import {Component} from '@angular/core';

@Component({
  template: `
    <section class="section">
      <md-card>
        <md-card-header class="header-full">
          <md-card-title>
            <div>
              <h2>Create New Department</h2>
            </div>
          </md-card-title>
        </md-card-header>
        <md-card-content>
          <router-outlet></router-outlet>
        </md-card-content>
      </md-card>
    </section>
  `
})
export class DepartmentNewComponent {

}
