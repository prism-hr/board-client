import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {PapaParseModule} from 'ngx-papaparse';
import {NgUploaderModule} from 'ngx-uploader';
import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
import {CalendarModule} from 'primeng/components/calendar/calendar';
import {CheckboxModule} from 'primeng/components/checkbox/checkbox';
import {DataTableModule} from 'primeng/components/datatable/datatable';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {RadioButtonModule} from 'primeng/components/radiobutton/radiobutton';
import {SelectButtonModule} from 'primeng/components/selectbutton/selectbutton';
import {TabViewModule} from 'primeng/components/tabview/tabview';
import {FilterModule} from '../../general/filter/filter.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {UserLookupComponent} from '../../general/user-lookup';
import {ResourceUserEditDialogComponent} from './resource-user-edit-dialog.component';
import {ResourceUserRoleFormPartComponent} from './resource-user-role-form-part.component';
import {ResourceUsersBulkComponent} from './resource-users-bulk.component';
import {ResourceUsersComponent} from './resource-users.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgUploaderModule,
    CheckboxModule,
    DataTableModule,
    TabViewModule,
    RadioButtonModule,
    SelectButtonModule,
    CalendarModule,
    DropdownModule,
    MatDialogModule,
    PapaParseModule,
    AutoCompleteModule,
    SharedModule,
    FilterModule,
    ImageModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {path: '', component: ResourceUsersComponent}
    ])
  ],
  declarations: [
    ResourceUsersBulkComponent,
    ResourceUsersComponent,
    ResourceUserRoleFormPartComponent,
    ResourceUserEditDialogComponent,
    UserLookupComponent
  ],
  entryComponents: [
    ResourceUserEditDialogComponent
  ]
})
export class ResourceUsersModule {
}
