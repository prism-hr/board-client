import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {FileItem, FileUploader} from 'ng2-file-upload';
import * as csv from 'csv-js';
import {ValidationService} from '../../validation/validation.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import UserRepresentation = b.UserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserDTO = b.UserDTO;
import UserRoleDTO = b.UserRoleDTO;
import Role = b.Role;
import * as _ from 'lodash';

@Component({
  selector: 'b-resource-users-bulk',
  templateUrl: 'resource-users-bulk.component.html',
  styleUrls: ['resource-users-bulk.component.scss']
})
export class ResourceUsersBulkComponent implements OnInit {

  csvText: string;
  usersForm: FormGroup;
  uploader: FileUploader;
  isDragOver: boolean;
  users: UserDTO[];
  userErrors: any[];
  @Input() resource: any;
  @Input() availableRoles: Role[];
  @Input() availableMemberCategories: string[];
  @Output() close: EventEmitter<any> = new EventEmitter();
  @ViewChild('csvUploaderInput') uploadElRef: ElementRef;

  constructor(private fb: FormBuilder, private resourceService: ResourceService) {
    this.usersForm = this.fb.group({
      role: [null, Validators.required],
      categories: [[]],
      expiryDate: [null, Validators.required],
      firstLineHeader: [true]
    });
    this.uploader = new FileUploader({});
  }

  ngOnInit() {
    this.usersForm.get('role').valueChanges.subscribe((role: Role) => {
      this.usersForm.patchValue({categories: []});
      this.usersForm.get('categories').setValidators(role === 'MEMBER' && Validators.required);
    });

    this.uploader.onAfterAddingFile = (item: FileItem) => {
      const reader = new FileReader();
      reader.onload = e => {
        this.csvText = (<any>e.target).result;
        this.computeUsers();
        this.uploader.removeFromQueue(item);
        this.uploadElRef.nativeElement.value = null;
      };
      reader.readAsText(item._file);
    };
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
    const roles: UserRoleDTO[] = [_.pick(this.usersForm.value, ['role', 'categories', 'expiryDate'])];
    this.resourceService.addUsersInBulk(this.resource, {users: this.users, roles})
      .subscribe(() => {
        this.close.emit('refresh');
      });
  }

  fileOver(event: any) {
    this.isDragOver = event;
  }

  closeBulkMode() {
    this.close.emit(null);
  }

}
