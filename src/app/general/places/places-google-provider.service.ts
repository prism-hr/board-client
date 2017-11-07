import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MapsAPILoader} from '@agm/core';

@Injectable()
export class GooglePlacesProvider {

  placesService$: Observable<{autocomplete: google.maps.places.AutocompleteService, places: google.maps.places.PlacesService}>;

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  getPlacesServices() {
    if (!this.placesService$) {
      this.placesService$ = Observable.fromPromise(this.mapsAPILoader.load()
        .then(() => {
          const map = new google.maps.Map(document.createElement('div'));
          return {autocomplete: new google.maps.places.AutocompleteService(), places: new google.maps.places.PlacesService(map)};
        }))
        .share();
    }
    return this.placesService$;
  }
}
