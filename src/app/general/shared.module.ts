import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/components/button/button';
import {CheckboxModule} from 'primeng/components/checkbox/checkbox';
import {InputTextModule} from 'primeng/components/inputtext/inputtext';
import {MessagesModule} from 'primeng/components/messages/messages';
import {RadioButtonModule} from 'primeng/components/radiobutton/radiobutton';
import {TooltipModule} from 'primeng/components/tooltip/tooltip';
import {ControlMessagesComponent} from '../validation/control-messages.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    FormsModule,
    ReactiveFormsModule,
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
