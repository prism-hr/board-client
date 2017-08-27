import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PapaParseService} from 'ngx-papaparse';
import {UploadInput, UploadOutput} from 'ngx-uploader';
import {ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
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

  constructor(private fb: FormBuilder, private papa: PapaParseService, private resourceService: ResourceService) {
    this.usersForm = this.fb.group({
      firstLineHeader: [true]
    });
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  ngOnInit() {
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
      reader.readAsText(output.file.nativeFile);
    } else if (output.type === 'dragOver') { // drag over event
      this.isDragOver = true;
    } else if (output.type === 'dragOut') { // drag out event
      this.isDragOver = false;
    }
  }

  computeUsers() {
    this.userErrors = [];
    this.users = [];
    const result = this.papa.parse(this.csvText || '');

    if (result.errors.length > 0) {
      this.userErrors = [{message: 'Could not parse given CSV file.'}];
      return;
    }

    let rows = result.data;
    rows = rows.slice(this.usersForm.value.firstLineHeader ? 1 : 0);

    for (let idx in rows) {
      if (!rows.hasOwnProperty(idx)) {
        continue;
      }
      if (this.userErrors.length > 0) {
        this.users = [];
        break;
      }
      const row = rows[idx];
      const line = +idx + 1 + (this.usersForm.value.firstLineHeader ? 1 : 0);
      if (row.length === 0) {
        continue; // empty line, skip
      }
      if (row.length !== 3) {
        this.userErrors.push({line: line, message: 'Row expected to have exactly 3 columns'});
        continue;
      }
      const user = {givenName: row[0].trim(), surname: row[1].trim(), email: row[2].trim()};
      if (user.givenName === '') {
        this.userErrors.push({line: line, message: 'Missing first name'});
        continue;
      } else if (user.surname === '') {
        this.userErrors.push({line: line, message: 'Missing last name'});
        continue;
      } else if (user.email === '') {
        this.userErrors.push({line: line, message: 'Missing email address'});
        continue;
      } else if (!ValidationUtils.EMAIL_REGEX.test(user.email)) {
        this.userErrors.push({line: line, message: 'Incorrect email address'});
        continue;
      }
      this.users.push(user);
    }
  }

  submit() {
    this.usersForm['submitted'] = true;
    if (this.usersForm.invalid) {
      return;
    }
    const formValue = this.usersForm.value;
    const roles: UserRoleDTO[] = formValue.roles
      .filter(roleDef => roleDef.checked)
      .map(roleDef => ({
        role: roleDef.roleId,
        expiryDate: roleDef.expiryDate,
        categories: [roleDef.category]
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
