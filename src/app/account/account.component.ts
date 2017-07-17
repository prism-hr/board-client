import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;
import UserPatchDTO = b.UserPatchDTO;
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;
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
    const user: UserPatchDTO = this.accountForm.value;
    this.userService.patchUser(user)
      .subscribe(() => {
        this.snackBar.open('Your account was saved successfully.', null, {duration: 3000});
      });
  }

  suppressionChanged(suppression: UserNotificationSuppressionRepresentation) {
    this.userService.setSuppression(suppression.resource, suppression.suppressed)
      .subscribe();
  }

}
