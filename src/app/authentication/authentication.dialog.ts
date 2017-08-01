import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {UserService} from '../services/user.service';
import {ValidationService} from '../validation/validation.service';
import {ValidationUtils} from '../validation/validation.utils';
import {UserImageDialogComponent} from './user-image.dialog';
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
  dialogData: any;

  constructor(private dialogRef: MdDialogRef<AuthenticationDialogComponent>, private fb: FormBuilder,
              @Inject(MD_DIALOG_DATA) data: any, private dialog: MdDialog, private userService: UserService,
              private validationService: ValidationService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, ValidationUtils.emailValidator]],
      password: ['', [Validators.required, Validators.max(100)]]
    });
    this.registrationForm = this.fb.group({
      givenName: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      surname: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      email: ['', [Validators.required, ValidationUtils.emailValidator]],
      password: ['', [Validators.required, ValidationUtils.passwordValidator]]
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, ValidationUtils.emailValidator]]
    });
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
    this.loginForm['submitted'] = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.login(this.loginForm.value)
      .then((user: UserRepresentation) => {
          this.afterAuthenticated(user);
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

  private afterAuthenticated(user: UserRepresentation) {
    this.dialogRef.close(true);
    if (!user.documentImage && user.documentImageRequestState !== 'DISPLAY_NEVER') {
      this.dialog.open(UserImageDialogComponent, {disableClose: true});
    }
  }

  private afterError(response) {
    this.validationService.extractResponseError(response, error => this.error = error);
  }


}

type AuthenticationView = 'LOGIN' | 'REGISTER' | 'FORGOT';
