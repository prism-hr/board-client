import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {FileItem, FileUploader} from 'ng2-file-upload';
import * as csv from 'csv-js';
import {ValidationService} from '../../validation/validation.service';
import UserRepresentation = b.UserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import Role = b.Role;
import UserDTO = b.UserDTO;

@Component({
  selector: 'b-resource-users-bulk',
  templateUrl: 'resource-users-bulk.component.html',
  styleUrls: ['resource-users-bulk.component.scss']
})
export class ResourceUsersBulkComponent implements OnInit {

  csvText: string;
  firstLineHeader = true;
  uploader: FileUploader;
  isDragOver: boolean;
  users: UserDTO[];
  userErrors: any[];
  @Output() close: EventEmitter<any> = new EventEmitter();
  @ViewChild('csvUploaderInput') uploadElRef: ElementRef;

  constructor(private resourceService: ResourceService) {
    this.uploader = new FileUploader({});
  }

  ngOnInit() {
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
    rows = rows.slice(this.firstLineHeader ? 1 : 0);
    this.userErrors = [];
    this.users = [];
    rows.forEach((row, idx) => {
      const line = idx + 1 + (this.firstLineHeader ? 1 : 0);
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

  fileOver(event: any) {
    this.isDragOver = event;
  }

  closeBulkMode() {
    this.close.emit(null);
  }

}