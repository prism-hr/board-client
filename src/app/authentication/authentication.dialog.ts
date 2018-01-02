import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../services/user.service';
import {ValidationService} from '../validation/validation.service';
import {ValidationUtils} from '../validation/validation.utils';
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: './authentication.dialog.html',
  styleUrls: ['./authentication.dialog.scss']
})
export class AuthenticationDialogComponent implements OnInit {

  loginForm: FormGroup;
  registrationForm: FormGroup;
  forgotPasswordForm: FormGroup;
  error: string;
  loading: boolean;
  view: AuthenticationView;
  forgottenSent: boolean;
  dialogData: AuthenticationDialogData;

  constructor(private dialogRef: MatDialogRef<AuthenticationDialogComponent>, private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data: AuthenticationDialogData, private userService: UserService, private validationService: ValidationService) {
    this.dialogData = data;
    const initUser = this.dialogData.user || {};
    this.loginForm = this.fb.group({
      email: [initUser.email, [Validators.required, ValidationUtils.emailValidator]],
      password: ['', [Validators.required, Validators.max(100)]],
      uuid: [data.uuid]
    });
    this.registrationForm = this.fb.group({
      givenName: [initUser.givenName, [Validators.required, Validators.min(1), Validators.max(100)]],
      surname: [initUser.surname, [Validators.required, Validators.min(1), Validators.max(100)]],
      email: [initUser.email, [Validators.required, ValidationUtils.emailValidator]],
      password: ['', [Validators.required, ValidationUtils.passwordValidator]],
      uuid: [data.uuid]
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, ValidationUtils.emailValidator]]
    });
  }

  ngOnInit() {
    this.setView(this.dialogData.initialView || 'LOGIN');
  }

  setView(view: AuthenticationView): void {
    this.view = view;
    this.error = null;
  }

  login(): void {
    this.error = null;
    this.loginForm['submitted'] = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.login(this.loginForm.value)
      .then(() => {
          this.afterAuthenticated();
        },
        (response: any) => {
          this.afterError(response);
        });
  }

  register(): void {
    this.error = null;
    this.registrationForm['submitted'] = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.signup(this.registrationForm.value)
      .then(() => {
          this.afterAuthenticated();
        },
        (response: any) => {
          this.afterError(response);
        });
  }

  authenticate(name: string) {
    this.error = null;
    this.loading = true;
    this.userService.authenticate(name, {uuid: this.dialogData.uuid})
      .then(() => {
          this.afterAuthenticated();
        },
        (response: any) => {
          this.afterError(response);
        }
      );
  }

  sendForgotten(): void {
    this.error = null;
    this.forgotPasswordForm['submitted'] = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.resetPassword(this.forgotPasswordForm.get('email').value)
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

  private afterAuthenticated() {
    this.dialogRef.close(true);
  }

  private afterError(response) {
    this.validationService.extractResponseError(response, error => this.error = error);
  }

}

export type AuthenticationView = 'LOGIN' | 'REGISTER' | 'FORGOT';

export interface AuthenticationDialogData {
  initialView?: AuthenticationView;
  uuid?: string;
  user?: UserRepresentation;
}
