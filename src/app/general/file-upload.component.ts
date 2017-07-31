import {Component, EventEmitter, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {environment} from '../../environments/environment';
import DocumentDTO = b.DocumentDTO;

@Component({
  selector: 'b-file-upload',
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

  @Input() type: string;

  uploadInput: EventEmitter<UploadInput>;
  file: UploadFile;
  propagateChange: any;
  progressPercentage: Number = null;
  isDragOver: boolean;
  model: DocumentDTO;

  constructor() {
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  ngOnInit(): void {
  }

  onUploadOutput(output: UploadOutput) {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      const event: UploadInput = {
        type: 'uploadAll',
        url: 'https://api.cloudinary.com/v1_1/' + environment.cloudinaryCloudName + '/upload',
        method: 'POST',
        data: {upload_preset: 'unsigned', folder: environment.cloudinaryFolder},
        concurrency: 0
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue') {
      this.file = output.file;
    } else if (output.type === 'uploading') {
      this.progressPercentage = output.file.progress.data.percentage;
    } else if (output.type === 'dragOver') { // drag over event
      this.isDragOver = true;
    } else if (output.type === 'dragOut') { // drag out event
      this.isDragOver = false;
    } else if (output.type === 'done') {
      this.progressPercentage = null;
      const response = output.file.response;
      this.model = {cloudinaryId: response.public_id, cloudinaryUrl: response.url, fileName: output.file.name};
      if (this.propagateChange) {
        this.propagateChange(this.model);
      }
    }
  }

  writeValue(obj: any): void {
    this.model = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
