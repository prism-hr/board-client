import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {BoardViewComponent} from './board-view.component';
import {SharedModule} from '../../general/shared.module';
import {ImageModule} from '../../general/image/image.module';
import {ResourceTimelineModule} from '../../resource/timeline/resource-timeline.module';
import {FilterModule} from '../../general/filter/filter.module';
import {PostItemModule} from '../../posts/item/post-item.module';

@NgModule({
  imports: [
    SharedModule,
    ImageModule,
    FilterModule,
    ResourceTimelineModule,
    PostItemModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: BoardViewComponent
      }
    ]),
    ShareButtonsModule.forRoot()
  ],
  declarations: [
    BoardViewComponent
  ],
  providers: [],
  entryComponents: []
})
export class BoardViewModule {
}
