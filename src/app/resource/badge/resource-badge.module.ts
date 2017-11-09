import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {RadioButtonModule} from 'primeng/primeng';
import {SharedModule} from '../../general/shared.module';
import {ResourceBadgeComponent} from './resource-badge.component';

@NgModule({
  imports: [
    FormsModule,
    RadioButtonModule,
    SharedModule,
    TranslateModule.forChild({}),
    RouterModule.forChild([
      {path: '', component: ResourceBadgeComponent}
    ])
  ],
  declarations: [
    ResourceBadgeComponent
  ],
  entryComponents: []
})
export class ResourceBadgeModule {
}
