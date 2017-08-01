import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {ValidationService} from '../validation/validation.service';
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  suppressions: UserNotificationSuppressionRepresentation[];
  changePasswordRequested: boolean;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MdSnackBar, private userService: UserService) {
    this.accountForm = this.fb.group({
      givenName: ['', [Validators.required, Validators.maxLength(30)]],
      surname: ['', [Validators.required, Validators.maxLength(40)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      documentImage: [],
    });
  }

  ngOnInit(): void {
    this.userService.user$
      .subscribe((user: UserRepresentation) => {
        if (user) {
          this.accountForm.reset(user);
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
    this.userService.patchUser(this.accountForm.value)
      .subscribe(() => {
        this.snackBar.open('Your account was saved successfully.', null, {duration: 3000});
      });
  }

  requestPasswordChange() {
    this.userService.user$
      .subscribe((user: UserRepresentation) => {
        this.userService.resetPassword(user.email).subscribe(() => {
          this.changePasswordRequested = true;
        });
      });
  }
}
