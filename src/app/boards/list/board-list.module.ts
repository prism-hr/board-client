import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {BoardListComponent} from './board-list.component';
import {BoardItemModule} from '../item/board-item.module';
import {SharedModule} from '../../general/shared.module';
import {FilterModule} from '../../general/filter/filter.module';

@NgModule({
  imports: [
    SharedModule,
    BoardItemModule,
    FilterModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {
        path: '',
        component: BoardListComponent
      }
    ])
  ],
  declarations: [
    BoardListComponent
  ],
  providers: [],
  entryComponents: []
})
export class BoardListModule {
}
