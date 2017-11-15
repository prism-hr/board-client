import {AuthenticationDialogComponent} from './authentication.dialog';
import {MatDialog} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {async, TestBed} from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesModule} from 'primeng/components/messages/messages';

@NgModule({
  imports: [FormsModule, CommonModule, MessagesModule],
  exports: [AuthenticationDialogComponent],
  declarations: [AuthenticationDialogComponent],
  entryComponents: [AuthenticationDialogComponent]
})
class TestModule {
}

describe('AuthenticationDialogComponent', () => {
  let component: AuthenticationDialogComponent;
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dialog = TestBed.get(MatDialog);
    const dialogRef = dialog.open(AuthenticationDialogComponent);
    component = dialogRef.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
