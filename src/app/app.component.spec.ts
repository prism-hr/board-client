import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '@angular/material';
import {FooterComponent} from './footer/footer.component';
import {ButtonModule} from 'primeng/primeng';
import {TranslateModule} from '@ngx-translate/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, HeaderComponent, FooterComponent],
      imports: [RouterTestingModule, MaterialModule, ButtonModule, TranslateModule.forRoot()]
    });
    TestBed.compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
