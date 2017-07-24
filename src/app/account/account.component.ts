import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {ValidationService} from '../validation/validation.service';
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;
import UserPatchDTO = b.UserPatchDTO;
import UserRepresentation = b.UserRepresentation;
import * as _ from 'lodash';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  suppressions: UserNotificationSuppressionRepresentation[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MdSnackBar, private userService: UserService) {
    this.accountForm = this.fb.group({
      givenName: ['', [Validators.required, Validators.maxLength(30)]],
      surname: ['', [Validators.required, Validators.maxLength(40)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      oldPassword: [''],
      password: ['', [ValidationService.passwordValidator]],
      repeatPassword: [''],
      documentImage: [],
    });
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe((user: UserRepresentation) => {
        if (user) {
          this.accountForm.reset(user);
          this.passwordChanged(); // reset validators
        }
      });
    this.route.data.subscribe(data => {
      this.suppressions = data['suppressions'];
    });
  }

  submit(): void {
    this.accountForm['submitted'] = true;
    if (this.accountForm.invalid) {
      return;
    }
    const user: UserPatchDTO = _.omit(this.accountForm.value, 'repeatPassword');
    this.userService.patchUser(user)
      .subscribe(() => {
        this.snackBar.open('Your account was saved successfully.', null, {duration: 3000});
      });
  }

  passwordChanged() {
    const newPassword = this.accountForm.get('password').value;
    if (newPassword && newPassword.length > 0) {
      this.accountForm.get('oldPassword').setValidators(Validators.required);
      this.accountForm.get('repeatPassword').setValidators(ValidationService.repeatPasswordValidator(newPassword));
    } else {
      this.accountForm.get('oldPassword').clearValidators();
      this.accountForm.get('repeatPassword').clearValidators();
    }
    this.accountForm.get('oldPassword').updateValueAndValidity();
    this.accountForm.get('repeatPassword').updateValueAndValidity();
  }

}
