import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../services/resource.service';
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-user-lookup',
  templateUrl: 'user-lookup.html',
  styles: []
})
export class UserLookupComponent implements OnInit {

  @Input('parentForm')
  public parentForm: FormGroup;

  @Input() resource: any;
  selectedEmail: string;

  userSuggestions: UserRepresentation[];

  constructor(private resourceService: ResourceService) {

  }

  ngOnInit(): void {
    this.parentForm.addControl('userLookup', new FormControl('', Validators.required));
    this.parentForm.addControl('showDetails', new FormControl(null));
  }

  searchUsers(event) {
    this.resourceService.lookupUsers(this.resource, event.query).subscribe((users: UserRepresentation[]) => {
      this.userSuggestions = users;
    });
  }

  userSelected() {
    // apply user object to form
    const userLookupField = this.parentForm.get('userLookup');
    const userValue = Object.assign({}, userLookupField.value);
    this.selectedEmail = userValue.email;
    userValue.email = null; // removing email from form (because it's invalid)
    this.parentForm.patchValue(userValue);

    // clean up lookup field
    userLookupField.setValue(null);
    userLookupField.clearValidators();
    userLookupField.updateValueAndValidity();

    // remove validation constraint from email field
    const emailField = this.parentForm.get('email');
    emailField.clearValidators();
    emailField.updateValueAndValidity();

    this.parentForm.get('showDetails').setValue('view');
  }

  cannotFindUser() {
    const userLookupField = this.parentForm.get('userLookup');
    userLookupField.clearValidators();
    userLookupField.updateValueAndValidity();
    this.parentForm.get('showDetails').setValue('edit');
  }

  returnToSearch() {
    this.parentForm.get('showDetails').setValue(null);
  }
}
