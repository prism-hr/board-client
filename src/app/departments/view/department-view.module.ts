import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {BoardItemModule} from '../../boards/item/board-item.module';
import {FilterModule} from '../../general/filter/filter.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {PostListModule} from '../../posts/list/post-list.module';
import {DepartmentViewComponent} from './department-view.component';

@NgModule({
  imports: [
    SharedModule,
    ImageModule,
    FilterModule,
    BoardItemModule,
    PostListModule,
    SidebarModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: DepartmentViewComponent
      }
    ])
    // ShareButtonsModule.forRoot()
  ],
  declarations: [
    DepartmentViewComponent
  ],
  providers: [],
  entryComponents: []
})
export class DepartmentViewModule {
}
