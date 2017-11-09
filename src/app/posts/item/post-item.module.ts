import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ImageModule} from '../../general/image/image.module';
import {SharedModule} from '../../general/shared.module';
import {PostItemComponent} from './post-item.component';

@NgModule({
  imports: [
    SharedModule,
    ImageModule,
    RouterModule,
    TranslateModule.forChild({})
  ],
  declarations: [
    PostItemComponent
  ],
  exports: [
    PostItemComponent
  ],
  providers: [],
  entryComponents: []
})
export class PostItemModule {
}
