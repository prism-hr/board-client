import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ButtonModule, InputTextModule, TooltipModule} from 'primeng/primeng';
import {ControlMessagesComponent} from '../validation/control-messages.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    FlexLayoutModule
  ],
  declarations: [
    ControlMessagesComponent
  ],
  exports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    FlexLayoutModule,
    ControlMessagesComponent
  ]
})
export class SharedModule {
}
