import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {ResourceTimelineComponent} from './resource-timeline.component';

@NgModule({
  imports: [
    SharedModule,
    ImageModule,
    TranslateModule.forChild({})
  ],
  declarations: [
    ResourceTimelineComponent
  ],
  exports: [
    ResourceTimelineComponent
  ],
  entryComponents: [],
})
export class ResourceTimelineModule {
}
