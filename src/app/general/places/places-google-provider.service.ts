import {MapsAPILoader} from '@agm/core';
import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {share} from 'rxjs/internal/operators';

@Injectable()
export class GooglePlacesProvider {

  placesService$: Observable<{ autocomplete: google.maps.places.AutocompleteService, places: google.maps.places.PlacesService }>;

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  getPlacesServices() {
    if (!this.placesService$) {
      this.placesService$ = from(
        this.mapsAPILoader.load().then(() => {
          const map = new google.maps.Map(document.createElement('div'));
          return {autocomplete: new google.maps.places.AutocompleteService(), places: new google.maps.places.PlacesService(map)};
        }))
        .pipe(share());
    }
    return this.placesService$;
  }
}
