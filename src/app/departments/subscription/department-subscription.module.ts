import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgxStripeModule} from 'ngx-stripe';
import {SharedModule} from '../../general/shared.module';
import {DepartmentSubscriptionComponent} from './department-subscription.component';

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: DepartmentSubscriptionComponent
      }
    ]),
    // ShareButtonsModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_ppjNqHYxyoqYgn0z7qMenMRZ')
  ],
  declarations: [
    DepartmentSubscriptionComponent
  ],
  providers: [],
  entryComponents: []
})
export class DepartmentSubscriptionModule {
}
