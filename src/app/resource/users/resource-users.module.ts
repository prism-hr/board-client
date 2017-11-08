import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgUploaderModule} from 'ngx-uploader';
import {
  AutoCompleteModule,
  CalendarModule,
  CheckboxModule,
  DataTableModule,
  DropdownModule,
  RadioButtonModule, SelectButtonModule,
  TabViewModule,
  TooltipModule
} from 'primeng/primeng';
import {FilterModule} from '../../general/filter/filter.module';
import {ImageModule} from '../../general/image/image.module';
import {UserLookupComponent} from '../../general/user-lookup';
import {ResourceUserEditDialogComponent} from './resource-user-edit-dialog.component';
import {ResourceUserRoleFormPartComponent} from './resource-user-role-form-part.component';
import {ResourceUsersBulkComponent} from './resource-users-bulk.component';
import {ResourceUsersComponent} from './resource-users.component';
import {SharedModule} from '../../general/shared.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgUploaderModule,
    CheckboxModule,
    DataTableModule,
    MatCardModule,
    TabViewModule,
    RadioButtonModule,
    CalendarModule,
    DropdownModule,
    SelectButtonModule,
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
  entryComponents: [ResourceUserEditDialogComponent],
})
export class ResourceUsersModule {
}
