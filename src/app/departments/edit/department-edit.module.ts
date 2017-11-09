import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ResourceHandleModule} from '../../controls/resource-handle.component';
import {FileUploadModule} from '../../general/file-upload/file-upload.module';
import {SharedModule} from '../../general/shared.module';
import {DepartmentEditComponent} from './department-edit.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
    ResourceHandleModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: DepartmentEditComponent
      }
    ])
  ],
  declarations: [
    DepartmentEditComponent
  ],
  providers: [],
  entryComponents: []
})
export class DepartmentEditModule {
}
