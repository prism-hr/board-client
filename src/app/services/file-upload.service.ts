import {Injectable} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {Cloudinary} from '@cloudinary/angular';
import {environment} from '../../environments/environment';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Injectable()
export class FileUploadService {

  constructor(private cloudinary: Cloudinary) {
  }

  createUploader() {
    const uploader = new FileUploader({
      url: 'https://api.cloudinary.com/v1_1/' + environment.cloudinaryCloudName + '/upload',
      autoUpload: true,
      additionalParameter: {upload_preset: 'unsigned', folder: environment.cloudinaryFolder}
    });

    uploader.onBeforeUploadItem = fileItem => {
      fileItem.withCredentials = false;
      return {fileItem};
    };

    return uploader;
  }

}
