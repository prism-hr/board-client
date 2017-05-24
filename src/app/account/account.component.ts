import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {MdSnackBar} from '@angular/material';
import UserRepresentation = b.UserRepresentation;
import UserPatchDTO = b.UserPatchDTO;
@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: any;

  constructor(private fb: FormBuilder, private snackBar: MdSnackBar, private userService: UserService) {
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
  }

  submit(): void {
    const user: UserPatchDTO = this.accountForm.value;
    this.userService.patchUser(user)
      .subscribe(() => {
        this.snackBar.open('Your account was successfully.', null, {duration: 1500});
      });
  }

}
