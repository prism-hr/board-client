import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ResourceHandleModule} from '../../controls/resource-handle.component';
import {SharedModule} from '../../general/shared.module';
import {PostListModule} from '../../posts/list/post-list.module';
import {DepartmentPostsComponent} from './department-posts.component';

@NgModule({
  imports: [
    SharedModule,
    PostListModule,
    ResourceHandleModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: DepartmentPostsComponent
      }
    ])
  ],
  declarations: [
    DepartmentPostsComponent
  ],
  providers: [],
  entryComponents: []
})
export class DepartmentPostsModule {
}
