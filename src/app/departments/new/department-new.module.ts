import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {AutoCompleteModule} from 'primeng/primeng';
import {FileUploadModule} from '../../general/file-upload/file-upload.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {DepartmentNewComponent} from './department-new.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    SharedModule,
    ImageModule,
    FileUploadModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: DepartmentNewComponent
      }
    ])
  ],
  declarations: [
    DepartmentNewComponent
  ],
  providers: [],
  entryComponents: []
})
export class DepartmentNewModule {
}
