import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {ImageComponent} from './image.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ImageComponent
  ],
  exports: [
    ImageComponent
  ]
})
export class ImageModule {
}
