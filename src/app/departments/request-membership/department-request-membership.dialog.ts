import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {PostService} from '../../posts/post.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRoleDTO = b.UserRoleDTO;

@Component({
  template: `
    <h2 md-dialog-title>Request membership for {{department.name}}</h2>
    <md-dialog-content>
      <form [formGroup]="membershipForm" novalidate>
        <div class="ui-checkbox-inline">
          <p-checkbox label="No expiry date" formControlName="noExpiryDate" binary="true"
                      (onChange)="noExpiryDateChanged()"></p-checkbox>
        </div>

        <div *ngIf="!membershipForm.get('noExpiryDate').value" class="input-holder">
          <label>Expiration date:</label>
          <p-calendar formControlName="expiryDate" dateFormat="yy-mm-dd" dataType="string"></p-calendar>
          <control-messages [control]="membershipForm.get('expiryDate')"></control-messages>
        </div>

        <div class="members">
          <label>Specify member categories</label>
          <div class="ui-checkbox-inline special">
                <span *ngFor="let category of department.memberCategories">
                  <p-checkbox formControlName="categories" [value]="category"
                              [label]="('definitions.memberCategory.' + category | translate)"></p-checkbox>
                </span>
            <control-messages [control]="membershipForm.get('categories')"></control-messages>
          </div>
        </div>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <button pButton (click)="submit()" class="ui-button-success" label="Submit"></button>
    </md-dialog-actions>
  `,
  styles: [`
  `]
})
export class DepartmentRequestMembershipDialogComponent implements OnInit {

  membershipForm: FormGroup;
  department: DepartmentRepresentation;

  constructor(private fb: FormBuilder, private dialogRef: MdDialogRef<DepartmentRequestMembershipDialogComponent>,
              @Inject(MD_DIALOG_DATA) data: any, private postService: PostService) {
    this.department = data.department;
    this.membershipForm = this.fb.group({
      noExpiryDate: [true],
      expiryDate: [],
      categories: [[], Validators.required]
    });
  }

  ngOnInit() {
  }

  noExpiryDateChanged() {
    const expiryDateControl = this.membershipForm.get('expiryDate');
    const noExpiryDate = this.membershipForm.get('noExpiryDate').value;
    expiryDateControl.setValue(null);
    expiryDateControl.setValidators(!noExpiryDate && Validators.required);
    expiryDateControl.updateValueAndValidity();
  }

  submit() {
    const form = this.membershipForm;
    form['submitted'] = true;
    if (form.invalid) {
      return;
    }
    const userRoleDTO: UserRoleDTO = {expiryDate: form.get('expiryDate').value, categories: form.get('categories').value};
    this.postService.requestDepartmentMembership(this.department, userRoleDTO).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

}
