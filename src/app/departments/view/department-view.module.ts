import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {BoardItemModule} from '../../boards/item/board-item.module';
import {FilterModule} from '../../general/filter/filter.module';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {ResourceTimelineModule} from '../../resource/timeline/resource-timeline.module';
import {DepartmentViewComponent} from './department-view.component';

@NgModule({
  imports: [
    SharedModule,
    ImageModule,
    FilterModule,
    ResourceTimelineModule,
    BoardItemModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: DepartmentViewComponent
      }
    ]),
    ShareButtonsModule.forRoot()
  ],
  declarations: [
    DepartmentViewComponent
  ],
  providers: [],
  entryComponents: []
})
export class DepartmentViewModule {
}
