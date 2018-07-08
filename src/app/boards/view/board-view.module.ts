import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {ResourceTimelineModule} from '../../resource/timeline/resource-timeline.module';
import {BoardViewComponent} from './board-view.component';

@NgModule({
  imports: [
    SharedModule,
    ImageModule,
    ResourceTimelineModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: BoardViewComponent
      }
    ])
  ],
  declarations: [
    BoardViewComponent
  ],
  providers: [],
  entryComponents: []
})
export class BoardViewModule {
}
