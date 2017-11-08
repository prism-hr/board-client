import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {AutoCompleteModule, CalendarModule, DropdownModule, EditorModule} from 'primeng/primeng';
import {FileUploadModule} from '../../general/file-upload/file-upload.module';
import {PlacesAutocompleteModule} from '../../general/places/places.module';
import {SharedModule} from '../../general/shared.module';
import {PostEditComponent} from './post-edit.component';
import {ImageModule} from '../../general/image/image.module';
import {DateTimeModule} from '../../controls/datetime.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    DropdownModule,
    AutoCompleteModule,
    CalendarModule,
    ImageModule,
    DateTimeModule,
    PlacesAutocompleteModule,
    FileUploadModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: PostEditComponent
      }
    ])
  ],
  declarations: [
    PostEditComponent
  ],
  providers: [],
  entryComponents: []
})
export class PostEditModule {
}
