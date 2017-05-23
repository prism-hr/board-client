import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {UserImageDialogComponent} from './user-image.dialog';
import {UserService} from '../services/user.service';

@Component({
  templateUrl: './authentication.dialog.html',
  styleUrls: ['./authentication.dialog.scss']
})
export class AuthenticationDialogComponent implements OnInit {

  loginFormModel: any;
  registrationFormModel: any;
  forgotPasswordFormModel: any;
  error: string;
  loading: boolean;
  view: AuthenticationView;
  forgottenSent: any;
  dialogData: any;

  constructor(private dialogRef: MdDialogRef<AuthenticationDialogComponent>, @Inject(MD_DIALOG_DATA) data: any,
              private dialog: MdDialog, private userService: UserService) {
    this.loginFormModel = <any>{};
    this.registrationFormModel = <any>{};
    this.forgotPasswordFormModel = <any>{};
    this.dialogData = data;
  }

  ngOnInit() {
    this.setView(this.dialogData.showRegister ? 'REGISTER' : 'LOGIN');
  }

  setView(view: AuthenticationView): void {
    this.view = view;
    this.error = null;
  }

  login(): void {
    this.error = null;
    this.loading = true;
    this.userService.login(this.loginFormModel)
      .subscribe({
        error: (err: any) => {
          this.loading = false;
          this.error = err;
        },
        complete: () => {
          this.dialogRef.close(true);
          this.dialog.open(UserImageDialogComponent);
        }
      });
  }

  register(): void {
    this.error = null;
    this.loading = true;
    this.userService.signup(this.registrationFormModel)
      .subscribe({
        error: (err: any) => {
          this.loading = false;
          this.error = err;
        },
        complete: () => {
          this.dialogRef.close(true);
          this.dialog.open(UserImageDialogComponent);
        }
      });
  }

  authenticate(name: string) {
    this.error = null;
    this.loading = true;
    this.userService.authenticate(name)
      .subscribe({
        error: (err: any) => {
          this.loading = false;
          this.error = err;
        },
        complete: () => {
          this.dialogRef.close(true);
          this.dialog.open(UserImageDialogComponent);
        }
      });
  }

  sendForgotten(): void {
    this.error = null;
    this.loading = true;
    this.userService.resetPassword(this.forgotPasswordFormModel.email)
      .subscribe({
        error: (err: any) => {
          this.loading = false;
          this.error = err;
        },
        complete: () => {
          this.forgottenSent = true
        }
      });
  }

}

type AuthenticationView = 'LOGIN' | 'REGISTER' | 'FORGOT';
