import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResourceService} from '../services/resource.service';
import DocumentDTO = b.DocumentDTO;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-user-lookup',
  template: `
    <div [formGroup]="parentForm">
      <div *ngIf="!parentForm.get('showDetails').value">
        <div class="grid__item one-whole input-holder">
          <label for="userLookup">Lookup user</label>
          <p-autoComplete id="userLookup" formControlName="userLookup" [suggestions]="userSuggestions"
                          (completeMethod)="searchUsers($event)" (onSelect)="userSelected()">
            <ng-template let-user pTemplate="item">
              {{user.givenName}} {{user.surname}} ({{user.email}})
            </ng-template>
          </p-autoComplete>
          <control-messages [control]="parentForm.get('userLookup')"></control-messages>
        </div>
        <button pButton type="button" (click)="cannotFindUser()" label="Cannot find user?"></button>
      </div>
      <div *ngIf="parentForm.get('showDetails').value">
        <div class="grid__item small--one-whole medium-up--one-third input-holder">
          <input pInputText formControlName="givenName" placeholder="First Name" required>
          <control-messages [control]="parentForm.get('givenName')"></control-messages>
        </div>
        <div class="grid__item small--one-whole medium-up--one-third input-holder">
          <input pInputText formControlName="surname" placeholder="Last Name" required>
          <control-messages [control]="parentForm.get('surname')"></control-messages>
        </div>
        <div class="grid__item small--one-whole medium-up--one-third input-holder">
          <input pInputText formControlName="email" placeholder="Email" required>
          <control-messages [control]="parentForm.get('email')"></control-messages>
        </div>
        <button pButton type="button" (click)="returnToSearch()" label="Return to Search"></button>
      </div>
    </div>
  `,
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
