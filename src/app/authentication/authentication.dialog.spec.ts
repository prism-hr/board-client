/* tslint:disable:no-unused-variable */
import {AuthenticationDialog} from './authentication.dialog';
import {StormpathModule} from 'angular-stormpath';
import {MaterialModule, MdDialogModule, MdDialog} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {TestBed, async} from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [StormpathModule, MaterialModule, MdDialogModule, FormsModule, CommonModule],
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
    let dialogRef = dialog.open(AuthenticationDialog);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
