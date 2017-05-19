import {AuthenticationDialogComponent} from './authentication.dialog';
import {MaterialModule, MdDialog} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {async, TestBed} from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesModule} from 'primeng/primeng';

@NgModule({
  imports: [MaterialModule, FormsModule, CommonModule, MessagesModule],
  exports: [AuthenticationDialogComponent],
  declarations: [AuthenticationDialogComponent],
  entryComponents: [AuthenticationDialogComponent]
})
class TestModule {
}

describe('AuthenticationDialogComponent', () => {
  let component: AuthenticationDialogComponent;
  let dialog: MdDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dialog = TestBed.get(MdDialog);
    const dialogRef = dialog.open(AuthenticationDialogComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
