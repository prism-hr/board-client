import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {FileItem, FileUploader} from 'ng2-file-upload';
import UserRepresentation = b.UserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import Role = b.Role;
import UserDTO = b.UserDTO;

@Component({
  selector: 'b-resource-users-bulk',
  templateUrl: 'resource-users-bulk.component.html',
  styles: ['']
})
export class ResourceUsersBulkComponent implements OnInit {

  csvText: string;
  firstLineHeader: boolean;
  uploader: FileUploader;
  isDragOver: boolean;
  users: UserDTO[];
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private resourceService: ResourceService) {
    this.uploader = new FileUploader({});
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (item: FileItem) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = (<any>e.target).result;
      };
      reader.readAsText(item._file);
    };
    this.users = [{givenName: 'Jerzy', surname: 'Urban', email: 'jerzy@urban.pl'},
      {givenName: 'Jozef', surname: 'Oleksy', email: 'jozef@oleksy.pl'}];
  }

  fileOver(event: any) {
    this.isDragOver = event;
  }

  closeBulkMode() {
    this.close.emit(null);
  }

}
