import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as csv from 'csv-js';
import {UploadInput, UploadOutput} from 'ngx-uploader';
import {ResourceService} from '../../services/resource.service';
import {ValidationService} from '../../validation/validation.service';
import UserDTO = b.UserDTO;
import UserRoleDTO = b.UserRoleDTO;

@Component({
  selector: 'b-resource-users-bulk',
  templateUrl: 'resource-users-bulk.component.html',
  styleUrls: ['resource-users-bulk.component.scss']
})
export class ResourceUsersBulkComponent implements OnInit {

  csvText: string;
  usersForm: FormGroup;
  uploadInput: EventEmitter<UploadInput>;
  isDragOver: boolean;
  users: UserDTO[];
  userErrors: any[];
  @Input() resource: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @ViewChild('csvUploaderInput') uploadElRef: ElementRef;

  constructor(private fb: FormBuilder, private resourceService: ResourceService) {
    this.usersForm = this.fb.group({
      firstLineHeader: [true]
    });
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  ngOnInit() {
    // this.uploader.onAfterAddingFile = (item: FileItem) => {
    //   const reader = new FileReader();
    //   reader.onload = e => {
    //     this.csvText = (<any>e.target).result;
    //     this.computeUsers();
    //     this.uploader.removeFromQueue(item);
    //     this.uploadElRef.nativeElement.value = null;
    //   };
    //   reader.readAsText(item._file);
    // };
  }

  onUploadOutput(output: UploadOutput) {
    if (output.type === 'addedToQueue') {
      const reader = new FileReader();
      reader.onload = e => {
        this.csvText = (<any>e.target).result;
        this.computeUsers();
        this.uploadInput.emit({type: 'removeAll'});
        this.uploadElRef.nativeElement.value = null;
      };
      reader.readAsText(output.nativeFile);
    }
  }

  computeUsers() {
    csv.IGNORE_RECORD_LENGTH = true;
    let rows = csv.parse(this.csvText || '');
    rows = rows.slice(this.usersForm.value.firstLineHeader ? 1 : 0);
    this.userErrors = [];
    this.users = [];
    rows.forEach((row, idx) => {
      const line = idx + 1 + (this.usersForm.value.firstLineHeader ? 1 : 0);
      if (row.length === 0) {
        return; // empty line, skip
      }
      if (row.length !== 3) {
        this.userErrors.push({line: line, message: 'Row expected to have exactly 3 columns'});
        return;
      }
      const user = {givenName: row[0].trim(), surname: row[1].trim(), email: row[2].trim()};
      if (user.givenName === '') {
        this.userErrors.push({line: line, message: 'Missing first name'});
        return;
      } else if (user.surname === '') {
        this.userErrors.push({line: line, message: 'Missing last name'});
        return;
      } else if (user.email === '') {
        this.userErrors.push({line: line, message: 'Missing email address'});
        return;
      } else if (!ValidationService.EMAIL_REGEX.test(user.email)) {
        this.userErrors.push({line: line, message: 'Incorrect email address'});
        return;
      }
      this.users.push(user);
    });
  }

  submit() {
    const formValue = this.usersForm.value;
    const roles: UserRoleDTO[] = formValue.roles.map(r => ({
      role: r,
      expiryDate: formValue.roleDefinitions[r].expiryDate,
      categories: formValue.roleDefinitions[r].categories
    }));
    this.resourceService.addUsersInBulk(this.resource, {users: this.users, roles})
      .subscribe(() => {
        this.close.emit('refresh');
      });
  }

  closeBulkMode() {
    this.close.emit(null);
  }

}
