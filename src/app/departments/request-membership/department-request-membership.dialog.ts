import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
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

        <div>
          <label for="category">Which category describes you best?</label>
          <p-dropdown id="category" formControlName="category" [options]="memberCategoryOptions"
                      placeholder="Select a category"></p-dropdown>
          <control-messages [control]="membershipForm.get('category')"></control-messages>
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
  memberCategoryOptions: any[];

  constructor(private fb: FormBuilder, private dialogRef: MdDialogRef<DepartmentRequestMembershipDialogComponent>,
              @Inject(MD_DIALOG_DATA) data: any, private translate: TranslateService, private postService: PostService) {
    this.department = data.department;
    this.membershipForm = this.fb.group({
      noExpiryDate: [true],
      expiryDate: [],
      category: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      this.memberCategoryOptions = this.department.memberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });
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
    const userRoleDTO: UserRoleDTO = {expiryDate: form.get('expiryDate').value, categories: [form.get('category').value]};
    this.postService.requestDepartmentMembership(this.department, userRoleDTO).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

}
