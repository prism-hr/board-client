import {AgmCoreModule} from '@agm/core';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
import {SharedModule} from '../shared.module';
import {PlacesAutocompleteComponent} from './places-autocomplete.component';
import {GooglePlacesProvider} from './places-google-provider.service';

@NgModule({
  declarations: [
    PlacesAutocompleteComponent,
  ],
  exports: [
    PlacesAutocompleteComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    AutoCompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDmaVzQjUgftYVHNfTfoSszjaUe8hie8e8',
      libraries: ['places']
    }),
  ],
  providers: [
    GooglePlacesProvider
  ]
})
export class PlacesAutocompleteModule {
}


