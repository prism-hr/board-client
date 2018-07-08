import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
import {FilterModule} from '../general/filter/filter.module';
import {ImageModule} from '../general/image/image.module';
import {SharedModule} from '../general/shared.module';
import {PostItemModule} from '../posts/item/post-item.module';
import {PostListModule} from '../posts/list/post-list.module';
import {EmployerLogoComponent} from './employer-logo.component';
import {HomePublicComponent} from './home-public.component';
import {HomeComponent} from './home.component';
import {StudentLogoComponent} from './student-logo.component';
import {UniLogoComponent} from './uni-logo.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    AutoCompleteModule,
    ImageModule,
    SharedModule,
    PostItemModule,
    PostListModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  declarations: [
    HomeComponent,
    HomePublicComponent,
    EmployerLogoComponent,
    UniLogoComponent,
    StudentLogoComponent
  ],
  providers: [],
  entryComponents: []
})
export class HomeModule {
}
