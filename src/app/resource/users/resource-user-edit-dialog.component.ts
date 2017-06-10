import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import PostRepresentation = b.PostRepresentation;
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: 'resource-user-edit-dialog.component.html'
})
export class ResourceUserEditDialogComponent {

  userForm: FormGroup;

  constructor(private dialogRef: MdDialogRef<ResourceUserEditDialogComponent>, private fb: FormBuilder,
              @Inject(MD_DIALOG_DATA) private data: any) {
    this.userForm = this.fb.group({
      roles: [[], Validators.required]
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  save(): void {
    this.dialogRef.close({});
  }

}
