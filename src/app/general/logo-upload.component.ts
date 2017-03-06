import {Component, forwardRef} from '@angular/core';
import {Cloudinary} from '@cloudinary/angular';
import {FileUploader, ParsedResponseHeaders, FileItem} from 'ng2-file-upload';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {environment} from '../../environments/environment';
import DocumentDTO = b.DocumentDTO;

@Component({
  selector: 'logo-upload',
  templateUrl: './logo-upload.component.html',
  styleUrls: ['logo-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LogoUploadComponent),
      multi: true
    }
  ]
})
export class LogoUploadComponent implements ControlValueAccessor {
  private uploader: FileUploader;
  private propagateChange: any;
  private progressPercentage: Number;
  private isDragOver: boolean;
  private model: DocumentDTO;

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
      return {fileItem};
    };
    this.uploader.onProgressItem = (item: FileItem, progress: any) => {
      console.log(progress);
    };
    this.uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const result = JSON.parse(response);
      this.model = {cloudinaryId: result.public_id, cloudinaryUrl: result.url, fileName: item.file.name};
      if(this.propagateChange) {
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
