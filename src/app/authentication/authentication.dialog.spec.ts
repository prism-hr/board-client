import {AuthenticationDialog} from './authentication.dialog';
import {StormpathModule} from 'angular-stormpath';
import {MaterialModule, MdDialog} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {async, TestBed} from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesModule} from 'primeng/primeng';

@NgModule({
  imports: [StormpathModule, MaterialModule, FormsModule, CommonModule, MessagesModule],
  exports: [AuthenticationDialog],
  declarations: [AuthenticationDialog],
  entryComponents: [AuthenticationDialog]
})
class TestModule {
}

describe('AuthenticationDialog', () => {
  let component: AuthenticationDialog;
  let dialog: MdDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dialog = TestBed.get(MdDialog);
    const dialogRef = dialog.open(AuthenticationDialog);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
