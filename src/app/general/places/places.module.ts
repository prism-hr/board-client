import {NgModule} from '@angular/core';
import {LocationAutocompleteComponent} from './places-autocomplete.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {GooglePlacesProvider} from './places-google-provider.service';

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
    MaterialModule
  ],
  providers: [
    GooglePlacesProvider
  ]
})
export class PlacesModule {
}


