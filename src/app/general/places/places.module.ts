import {NgModule} from '@angular/core';
import {LocationAutocompleteComponent} from './places-autocomplete.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GooglePlacesProvider} from './places-google-provider.service';
import {AutoCompleteModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    LocationAutocompleteComponent,
  ],
  exports: [
    LocationAutocompleteComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AutoCompleteModule
  ],
  providers: [
    GooglePlacesProvider
  ]
})
export class PlacesModule {
}


