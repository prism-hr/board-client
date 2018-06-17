import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgxUploaderModule} from 'ngx-uploader';
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
import {DepartmentMembersBulkComponent} from './bulk/department-members-bulk.component';
import {DepartmentMembersComponent} from './members/department-members.component';
import {DepartmentMemberFormPartComponent} from './role-form-part/department-member-form-part.component';
import {DepartmentStaffFormPartComponent} from './role-form-part/department-staff-form-part.component';
import {DepartmentStaffComponent} from './staff/department-staff.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgxUploaderModule,
    CheckboxModule,
    DataTableModule,
    TabViewModule,
    RadioButtonModule,
    SelectButtonModule,
    CalendarModule,
    DropdownModule,
    MatDialogModule,
    // PapaParseModule,
    AutoCompleteModule,
    SharedModule,
    FilterModule,
    ImageModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {path: 'members', component: DepartmentMembersComponent},
      {path: 'staff', component: DepartmentStaffComponent},
      {path: '', redirectTo: 'members'}
    ])
  ],
  declarations: [
    DepartmentMembersBulkComponent,
    DepartmentMembersComponent,
    DepartmentStaffComponent,
    DepartmentMemberFormPartComponent,
    DepartmentStaffFormPartComponent,
    ResourceUserEditDialogComponent,
    UserLookupComponent
  ],
  entryComponents: [
    ResourceUserEditDialogComponent
  ]
})
export class ResourceUsersModule {
}
