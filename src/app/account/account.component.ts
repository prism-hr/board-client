import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {DefinitionsService} from '../services/definitions.service';
import {UserService} from '../services/user.service';
import {ValidationService} from '../validation/validation.service';
import {ValidationUtils} from '../validation/validation.utils';
import AgeRange = b.AgeRange;
import Gender = b.Gender;
import UserNotificationSuppressionRepresentation = b.UserNotificationSuppressionRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  accountFormError: string;
  suppressions: UserNotificationSuppressionRepresentation[];
  changePasswordRequested: boolean;
  availableGenders: Gender[];
  availableAgeRanges: AgeRange[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private title: Title, private snackBar: MatSnackBar,
              private userService: UserService, private validationService: ValidationService,
              private definitionsService: DefinitionsService) {
    this.availableGenders = definitionsService.getDefinitions()['gender'];
    this.availableAgeRanges = definitionsService.getDefinitions()['ageRange'];
    this.accountForm = this.fb.group({
      givenName: ['', [Validators.required, Validators.maxLength(30)]],
      surname: ['', [Validators.required, Validators.maxLength(40)]],
      email: ['', [Validators.required, ValidationUtils.emailValidator]],
      documentImage: [],
      gender: [null, Validators.required],
      ageRange: [null, Validators.required],
      locationNationality: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Account');
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
        },
        (response: any) => {
          this.validationService.extractResponseError(response, error => this.accountFormError = error);
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
