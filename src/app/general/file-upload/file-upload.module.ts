import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {FileUploadComponent} from './file-upload.component';
import {NgxUploaderModule} from 'ngx-uploader';
import {ImageModule} from '../image/image.module';

@NgModule({
  imports: [
    SharedModule,
    NgxUploaderModule,
    ImageModule
  ],
  declarations: [
    FileUploadComponent
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule {
}
