import {Component, OnInit} from '@angular/core';
import {
  Account,
  ForgotPasswordFormModel,
  LoginFormModel,
  RegistrationFormModel,
  Stormpath,
  StormpathErrorResponse
} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';
import {MdDialog, MdDialogRef} from '@angular/material';
import {UserImageDialogComponent} from './user-image.dialog';

@Component({
  templateUrl: './authentication.dialog.html',
  styleUrls: ['./authentication.dialog.scss']
})
export class AuthenticationDialogComponent implements OnInit {

  loginFormModel: LoginFormModel;
  registrationFormModel: RegistrationFormModel;
  forgotPasswordFormModel: ForgotPasswordFormModel;
  error: string;
  loading: boolean;
  view: AuthenticationView;
  forgottenSent: any;

  constructor(private dialogRef: MdDialogRef<AuthenticationDialogComponent>, private dialog: MdDialog, private stormpath: Stormpath) {
    this.loginFormModel = <any>{};
    this.registrationFormModel = <any>{};
    this.forgotPasswordFormModel = <any>{};
  }

  ngOnInit() {
    this.setView(this.dialogRef.config.data.showRegister ? 'REGISTER' : 'LOGIN');
  }

  setView(view: AuthenticationView): void {
    this.view = view;
  }

  login(): void {
    this.error = null;
    this.loading = true;
    this.stormpath.login(this.loginFormModel)
      .subscribe(() => {
        this.dialogRef.close(true);
        this.dialog.open(UserImageDialogComponent);
      }, (error: StormpathErrorResponse) => {
        this.loading = false;
        this.error = error.message;
      });
  }

  register(): void {
    this.stormpath.register(this.registrationFormModel)
      .subscribe((account: Account) => {
        const canLogin = account.status === 'ENABLED';

        if (canLogin) {
          const loginAttempt: LoginFormModel = {
            login: this.registrationFormModel.email,
            password: this.registrationFormModel.password
          };

          this.stormpath.login(loginAttempt)
            .subscribe(() => {
              this.dialogRef.close(true);
              this.dialog.open(UserImageDialogComponent);
            });
        }
      }, error => this.error = error.message);
  }

  sendForgotten(): void {
    this.error = null;
    this.stormpath.sendPasswordResetEmail(this.forgotPasswordFormModel)
      .subscribe(() => this.forgottenSent = true,
        (error: StormpathErrorResponse) => this.error = error.message);
  }

}

type AuthenticationView = 'LOGIN' | 'REGISTER' | 'FORGOT';
