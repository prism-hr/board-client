import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../general/shared.module';
import {PostListComponent} from './post-list.component';
import {PostItemModule} from '../item/post-item.module';
import {RouterModule} from '@angular/router';
import {FilterModule} from '../../general/filter/filter.module';

@NgModule({
  imports: [
    SharedModule,
    FilterModule,
    PostItemModule,
    RouterModule,
    TranslateModule.forChild({})
  ],
  declarations: [
    PostListComponent
  ],
  exports: [
    PostListComponent
  ],
  providers: [],
  entryComponents: []
})
export class  PostListModule {
}
