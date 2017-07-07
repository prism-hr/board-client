import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../services/resource.service';
import DocumentDTO = b.DocumentDTO;
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

  userSuggestions: UserRepresentation[];

  constructor(private resourceService: ResourceService) {

  }

  ngOnInit(): void {
    this.parentForm.addControl('userLookup', new FormControl('', Validators.required));
    this.parentForm.addControl('showDetails', new FormControl(false));
  }

  searchUsers(event) {
    this.resourceService.lookupUsers(this.resource, event.query).subscribe((users: UserRepresentation[]) => {
      this.userSuggestions = users;
    });
  }

  userSelected() {
    const userLookupField = this.parentForm.get('userLookup');
    this.parentForm.patchValue(userLookupField.value);
    userLookupField.setValue(null);
    userLookupField.clearValidators();
    userLookupField.updateValueAndValidity();
    this.parentForm.get('showDetails').setValue(true);
  }

  cannotFindUser() {
    const userLookupField = this.parentForm.get('userLookup');
    this.parentForm.get('showDetails').setValue(true);
    userLookupField.clearValidators();
    userLookupField.updateValueAndValidity();
  }

  returnToSearch() {
    this.parentForm.reset();
  }
}
