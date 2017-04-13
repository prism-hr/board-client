import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {Cloudinary} from '@cloudinary/angular';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {environment} from '../../environments/environment';
import DocumentDTO = b.DocumentDTO;

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {

  @Input('type')
  type: string;

  uploader: FileUploader;
  propagateChange: any;
  progressPercentage: Number = null;
  isDragOver: boolean;
  model: DocumentDTO;

  constructor(private cloudinary: Cloudinary) {
    this.uploader = new FileUploader({
      url: 'https://api.cloudinary.com/v1_1/' + environment.cloudinaryCloudName + '/upload',
      autoUpload: true,
      additionalParameter: {upload_preset: 'unsigned', folder: environment.cloudinaryFolder}
    });
  }

  ngOnInit(): void {
    this.uploader.onBeforeUploadItem = fileItem => {
      fileItem.withCredentials = false;
      this.progressPercentage = 0;
      return {fileItem};
    };
    this.uploader.onProgressItem = (item: FileItem, progress: any) => {
      this.progressPercentage = progress;
    };
    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.progressPercentage = null;
      const result = JSON.parse(response);
      this.model = {cloudinaryId: result.public_id, cloudinaryUrl: result.url, fileName: item.file.name};
      if (this.propagateChange) {
        this.propagateChange(this.model);
      }
      return {item, response, status, headers};
    };
  }

  writeValue(obj: any): void {
    this.model = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  fileOver(event: any) {
    this.isDragOver = event;
  }
}
