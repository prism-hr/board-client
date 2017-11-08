import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgUploaderModule} from 'ngx-uploader';
import {
  AutoCompleteModule,
  CalendarModule,
  CheckboxModule,
  DataTableModule,
  DropdownModule,
  RadioButtonModule,
  SelectButtonModule,
  TabViewModule
} from 'primeng/primeng';
import {FilterModule} from '../../general/filter/filter.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {UserLookupComponent} from '../../general/user-lookup';
import {ResourceUserEditDialogComponent} from './resource-user-edit-dialog.component';
import {ResourceUserRoleFormPartComponent} from './resource-user-role-form-part.component';
import {ResourceUsersBulkComponent} from './resource-users-bulk.component';
import {ResourceUsersComponent} from './resource-users.component';
import {MatDialogModule} from '@angular/material';

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
