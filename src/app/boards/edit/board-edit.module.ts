import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {AutoCompleteModule, ChipsModule} from 'primeng/primeng';
import {FileUploadModule} from '../../general/file-upload/file-upload.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {BoardEditComponent} from './board-edit.component';
import {ResourceHandleModule} from '../../controls/resource-handle.component';

@NgModule({
  imports: [
    ChipsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FileUploadModule,
    ImageModule,
    ResourceHandleModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: BoardEditComponent
      }
    ])
  ],
  declarations: [
    BoardEditComponent
  ],
  providers: [],
  entryComponents: []
})
export class BoardEditModule {
}
