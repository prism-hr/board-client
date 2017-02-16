import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <div>
      <h3>Welcome</h3>
      <p>Welcome to the Board!</p>
      <a routerLink="/">Homepage</a>
    </div>
`,
  styles: []
})
export class WelcomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
