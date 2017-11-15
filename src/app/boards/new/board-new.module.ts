import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ChipsModule} from 'primeng/components/chips/chips';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {FileUploadModule} from '../../general/file-upload/file-upload.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {BoardNewComponent} from './board-new.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    ImageModule,
    ChipsModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: BoardNewComponent
      }
    ])
  ],
  declarations: [
    BoardNewComponent
  ],
  providers: [],
  entryComponents: []
})
export class BoardNewModule {
}
