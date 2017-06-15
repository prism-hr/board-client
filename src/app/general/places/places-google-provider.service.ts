import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MapsAPILoader} from 'angular2-google-maps/core';

@Injectable()
export class GooglePlacesProvider {

  placesService$: Observable<[google.maps.places.AutocompleteService, google.maps.places.PlacesService]>;

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  getPlacesServices() {
    if (!this.placesService$) {
      this.placesService$ = Observable.fromPromise(this.mapsAPILoader.load()
        .then(() => {
          const map = new google.maps.Map(document.createElement('div'));
          return [new google.maps.places.AutocompleteService(), new google.maps.places.PlacesService(map)];
        }))
        .share();
    }
    return this.placesService$;
  }
}
