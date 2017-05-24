import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {UserImageDialogComponent} from './user-image.dialog';
import {UserService} from '../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import UserRepresentation = b.UserRepresentation;

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
              private translate: TranslateService, private dialog: MdDialog, private userService: UserService) {
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
      .then((user: UserRepresentation) => {
          this.afterAuthenticated(user);
        },
        (response: any) => {
          this.afterError(response);
        });
  }

  register(): void {
    this.error = null;
    this.loading = true;
    this.userService.signup(this.registrationFormModel)
      .then((user: UserRepresentation) => {
          this.afterAuthenticated(user);
        },
        (response: any) => {
          this.afterError(response);
        });
  }

  authenticate(name: string) {
    this.error = null;
    this.loading = true;
    this.userService.authenticate(name)
      .then((user: UserRepresentation) => {
          this.afterAuthenticated(user);
        },
        (response: any) => {
          this.afterError(response);
        }
      );
  }

  sendForgotten(): void {
    this.error = null;
    this.loading = true;
    this.userService.resetPassword(this.forgotPasswordFormModel.email)
      .subscribe({
        error: (response: any) => {
          this.loading = false;
          this.afterError(response);
        },
        complete: () => {
          this.forgottenSent = true;
        }
      });
  }

  private afterAuthenticated(user: UserRepresentation) {
    this.dialogRef.close(true);
    if (!user.documentImage && user.documentImageRequestState !== 'DISPLAY_NEVER') {
      this.dialog.open(UserImageDialogComponent, {disableClose: true});
    }
  }

  private afterError(response) {
    this.translate.get('definitions.exceptionCode')
      .subscribe(codeTranslations => {
        const code = response.json && response.json().exceptionCode;
        if (code) {
          this.error = codeTranslations[code] || code;
        }
      });
  }

}

type AuthenticationView = 'LOGIN' | 'REGISTER' | 'FORGOT';
