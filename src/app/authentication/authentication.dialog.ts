import {Component, OnInit} from '@angular/core';
import {
  Stormpath, Account, LoginFormModel, StormpathErrorResponse, RegistrationFormModel,
  ForgotPasswordFormModel
} from 'angular-stormpath';
import {Observable} from 'rxjs';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.dialog.html',
  styleUrls: ['./authentication.dialog.scss']
})
export class AuthenticationDialog implements OnInit {

  private loginFormModel: LoginFormModel;
  private registrationFormModel: RegistrationFormModel;
  private forgotPasswordFormModel: ForgotPasswordFormModel;
  private error: string;
  private user$: Observable<Account | boolean>;
  private loading: boolean;
  private view: AuthenticationView;
  private forgottenSent: any;

  constructor(private dialogRef: MdDialogRef<AuthenticationDialog>, private stormpath: Stormpath) {
    this.loginFormModel = <any>{};
    this.registrationFormModel = <any>{};
    this.forgotPasswordFormModel = <any>{};
  }

  ngOnInit() {
    this.setView(this.dialogRef.config.data.showRegister ? 'REGISTER' : 'LOGIN');
    this.user$ = this.stormpath.user$;
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
