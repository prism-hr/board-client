import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../general/shared.module';
import {PostListEmbeddedComponent} from './post-list-embedded.component';
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
    PostListEmbeddedComponent
  ],
  exports: [
    PostListEmbeddedComponent
  ],
  providers: [],
  entryComponents: []
})
export class PostListEmbeddedModule {
}
