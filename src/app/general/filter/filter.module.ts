import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {SelectButtonModule} from 'primeng/components/selectbutton/selectbutton';
import {SharedModule} from '../shared.module';
import {FilterComponent} from './filter.component';

@NgModule({
  imports: [
    FormsModule,
    SelectButtonModule,
    DropdownModule,
    SharedModule
  ],
  declarations: [
    FilterComponent
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule {
}
