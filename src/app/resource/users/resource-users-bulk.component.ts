import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {PapaParseService} from 'ngx-papaparse';
import {UploadInput, UploadOutput} from 'ngx-uploader';
import {MessageService} from 'primeng/components/common/messageservice';
import {ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
import UserDTO = b.UserDTO;
import UserRoleDTO = b.UserRoleDTO;

@Component({
  selector: 'b-resource-users-bulk',
  templateUrl: 'resource-users-bulk.component.html',
  styleUrls: ['resource-users-bulk.component.scss'],
  providers: [MessageService]
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

  constructor(private fb: FormBuilder, private papa: PapaParseService, private snackBar: MdSnackBar,
              private resourceService: ResourceService) {
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
      if (row.length === 1 && row[0] === '') {
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
    const roleDef = this.usersForm.get('roleGroup').value;
    const userRoles: UserRoleDTO[] = this.users.map(user => {
      return {
        role: roleDef.role,
        expiryDate: roleDef.expiryDate,
        categories: [roleDef.category],
        user: user
      }
    });

    this.resourceService.addUsersInBulk(this.resource, userRoles)
      .subscribe(() => {
        this.snackBar.open('You have successfully uploaded users. It might take some time until they will be processed.',
          null, {duration: 10000});
        this.close.emit('refresh');
      });
  }

  closeBulkMode() {
    this.close.emit(null);
  }

}
