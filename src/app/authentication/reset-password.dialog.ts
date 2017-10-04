import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {UserService} from '../services/user.service';
import {ValidationService} from '../validation/validation.service';
import {ValidationUtils} from '../validation/validation.utils';
import UserPasswordDTO = b.UserPasswordDTO;

@Component({
  template: `
    <div ngClass="{'error-enter' : error}" class="authenticate">
      <md-progress-bar class="md-warn" *ngIf="loading" mode="indeterminate"></md-progress-bar>
      <h2 class="center">
        Reset Password
      </h2>
      <div *ngIf="error">
        <p-messages [value]="[{severity:'error', detail:error}]"></p-messages>
      </div>

      <div *ngIf="!showPasswordChangedMessage" class="grid">
        <div class="grid__item one-whole">
          <form [formGroup]="passwordForm" (ngSubmit)="submit()">
            <div class="input-holder">
              <input pInputText type="password" placeholder="Password" formControlName="password" (change)="passwordChanged()">
              <control-messages [control]="passwordForm.get('password')"></control-messages>
            </div>
            <div class="input-holder">
              <input pInputText type="password" placeholder="Repeat Password" formControlName="repeatPassword">
              <control-messages [control]="passwordForm.get('repeatPassword')"></control-messages>
            </div>
            <div fxLayout="row" fxLayoutAlign="space-between center" class="actions-holder">
              <button pButton class="ui-button-success" label="Submit"></button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="showPasswordChangedMessage">
        <p-messages
          [value]="[{severity:'info', summary:'Password changed', detail:'Your password has been changed.'}]"
          [closable]="false"></p-messages>
      </div>
    </div>
  `,
  styleUrls: ['./authentication.dialog.scss']
})
export class ResetPasswordDialogComponent implements OnInit {

  passwordForm: FormGroup;
  error: string;
  loading: boolean;
  dialogData: any;
  showPasswordChangedMessage: boolean;

  constructor(private fb: FormBuilder, private dialogRef: MdDialogRef<ResetPasswordDialogComponent>, @Inject(MD_DIALOG_DATA) data: any,
              private userService: UserService, private validationService: ValidationService) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.max(100)]],
      repeatPassword: ['']
    });
    this.dialogData = data;
  }

  ngOnInit() {
  }


  submit(): void {
    this.error = null;
    this.passwordForm['submitted'] = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.loading = true;
    const userPasswordDTO: UserPasswordDTO = {password: this.passwordForm.get('password').value, uuid: this.dialogData.uuid};
    this.userService.patchPassword(userPasswordDTO)
      .subscribe(() => {
          this.dialogRef.close(true);
        },
        (response: any) => {
          this.validationService.extractResponseError(response, error => this.error = error);
        });
  }

  passwordChanged() {
    const newPassword = this.passwordForm.get('password').value;
    if (newPassword && newPassword.length > 0) {
      this.passwordForm.get('repeatPassword').setValidators(ValidationUtils.repeatPasswordValidator(newPassword));
    } else {
      this.passwordForm.get('repeatPassword').clearValidators();
    }
    this.passwordForm.get('repeatPassword').updateValueAndValidity();
  }

}
