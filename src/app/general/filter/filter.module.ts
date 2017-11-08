import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DropdownModule, SelectButtonModule} from 'primeng/primeng';
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
