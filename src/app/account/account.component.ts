import {Component, OnInit} from '@angular/core';
import {Account, Stormpath} from 'angular-stormpath';
import {FormBuilder, Validators} from '@angular/forms';
@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: any;

  constructor(private fb: FormBuilder, private stormpath: Stormpath) {
    this.accountForm = this.fb.group({
      givenName: ['', [Validators.required, Validators.maxLength(30)]],
      surname: ['', [Validators.required, Validators.maxLength(40)]]
    });
  }

  ngOnInit(): void {
    this.stormpath.user$
      .subscribe((user: Account) => {
        if(user) {
          this.accountForm.reset(user);
        }
      });
  }

  submit(): void {

  }

}
