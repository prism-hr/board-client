import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ImageModule} from '../../general/image/image.module';
import {PlacesAutocompleteModule} from '../../general/places/places.module';
import {SharedModule} from '../../general/shared.module';
import {PostApplyFormComponent} from './apply/post-apply-form.component';
import {PostApplyRequestMembershipComponent} from './apply/post-apply-request-membership.component';
import {PostApplyComponent} from './apply/post-apply.component';
import {PostViewComponent} from './post-view.component';
import {ResourceTimelineModule} from '../../resource/timeline/resource-timeline.module';
import {FileUploadModule} from '../../general/file-upload/file-upload.module';
import {EditorModule} from 'primeng/components/editor/editor';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
import {SelectButtonModule} from 'primeng/components/selectbutton/selectbutton';
import {CalendarModule} from 'primeng/components/calendar/calendar';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    DropdownModule,
    AutoCompleteModule,
    SelectButtonModule,
    CalendarModule,
    ImageModule,
    PlacesAutocompleteModule,
    ResourceTimelineModule,
    FileUploadModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: PostViewComponent
      }
    ])
    // ShareButtonsModule.forRoot()
  ],
  declarations: [
    PostViewComponent,
    PostApplyComponent,
    PostApplyFormComponent,
    PostApplyRequestMembershipComponent
  ],
  providers: [],
  entryComponents: []
})
export class PostViewModule {
}
