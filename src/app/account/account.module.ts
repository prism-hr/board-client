import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ImageModule} from '../general/image/image.module';
import {SharedModule} from '../general/shared.module';
import {AccountNotificationsComponent} from './account-notifications.component';
import {AccountSuppressionsResolver} from './account-suppressions-resolver';
import {AccountComponent} from './account.component';
import {FileUploadModule} from '../general/file-upload/file-upload.module';
import {PlacesAutocompleteModule} from '../general/places/places.module';
import {ToggleButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageModule,
    FileUploadModule,
    PlacesAutocompleteModule,
    ToggleButtonModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent,
        resolve: {
          suppressions: AccountSuppressionsResolver
        }
      }
    ])
  ],
  declarations: [
    AccountComponent,
    AccountNotificationsComponent
  ],
  providers: [
    AccountSuppressionsResolver
  ],
  entryComponents: []
})
export class AccountModule {
}
