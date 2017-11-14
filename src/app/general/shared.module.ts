import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ButtonModule, CheckboxModule, InputTextModule, MessagesModule, RadioButtonModule, TooltipModule} from 'primeng/primeng';
import {ControlMessagesComponent} from '../validation/control-messages.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    FlexLayoutModule,
    MatCardModule,
    MessagesModule
  ],
  declarations: [
    ControlMessagesComponent
  ],
  exports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    FlexLayoutModule,
    MatCardModule,
    MessagesModule,
    ControlMessagesComponent
  ]
})
export class SharedModule {
}
