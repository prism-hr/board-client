/* tslint:disable:no-unused-variable */
import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {StormpathModule} from 'angular-stormpath';
import {HeaderComponent} from './header/header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '@angular/material';

describe('AppComponent', () => {
  let app: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, HeaderComponent],
      imports: [RouterTestingModule, StormpathModule, MaterialModule]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Noticeboard'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Noticeboard');
  }));
});
