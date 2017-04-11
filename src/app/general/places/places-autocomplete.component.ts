import {Component, forwardRef, NgZone, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject} from 'rxjs';
import {GooglePlacesProvider} from './places-google-provider.service';
import * as _ from 'lodash';
import LocationDTO = b.LocationDTO;
import AutocompletePrediction = google.maps.places.AutocompletePrediction;

@Component({
  selector: 'places-autocomplete',
  template: `
    <p-autoComplete [(ngModel)]="model" (completeMethod)="search($event)"
                    (onBlur)="onTouch($event)" placeholder="e.g. London"
                    [suggestions]="results" field="name" (onSelect)="locationSelected()"></p-autoComplete>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationAutocompleteComponent),
      multi: true
    }
  ]
})
export class LocationAutocompleteComponent implements ControlValueAccessor, OnInit {

  onChange: any;
  onTouch: any;
  results: LocationDTO[];
  model: LocationDTO | AutocompletePrediction | string;
  search$: Subject<string> = new Subject();

  constructor(private googlePlacesProvider: GooglePlacesProvider, private zone: NgZone) {
  }

  ngOnInit() {
    this.search$
      .debounceTime(300)
      .switchMap((input: string) => {
        if (!input || input.trim() === '') {
          return [];
        }
        return this.googlePlacesProvider.getPlacesServices()
          .switchMap(services => {
            const autocompleteService: google.maps.places.AutocompleteService = services[0];
            const subject = new Subject<AutocompletePrediction[]>();
            autocompleteService.getPlacePredictions({input, types: ['(cities)']}, places => {
              this.zone.run(() => {
                subject.next(places);
                subject.complete();
              });
            });
            return subject.asObservable();
          });
      })
      .subscribe((results: any[]) => {
        results.forEach(r => {
          r.name = r.description
        });
        this.results = results;
      });
  }

  search(event) {
    this.search$.next(event.query);
  }

  locationSelected() {
    this.googlePlacesProvider.getPlacesServices()
      .subscribe(services => {
        const placesService: google.maps.places.PlacesService = services[1];
        placesService.getDetails({placeId: (this.model as AutocompletePrediction).place_id}, placeDetails => {
          this.onChange(this.placeResultToLocation(placeDetails));
        });
      });
  }

  writeValue(obj: any): void {
    this.model = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  displayFn(location: any): string {
    return location ? (location.description || location.name) : '';
  }

  placeResultToLocation(placeDetails: google.maps.places.PlaceResult): LocationDTO {
    function getAddressPart(componentType: any, type: string) {
      const component: any = _.find(placeDetails.address_components, component => _.includes(component.types, componentType));
      if (type === 'long') {
        return component ? component.long_name : undefined;
      }
      return component ? component.short_name : undefined;
    }

    const domicile = getAddressPart('country', 'short');
    const geolocation = placeDetails.geometry.location;

    const location: LocationDTO = {};
    location.googleId = placeDetails.place_id;
    location.name = (this.model as AutocompletePrediction).description;
    location.domicile = domicile;
    location.latitude = geolocation.lat();
    location.longitude = geolocation.lng();
    return location;
  }
}
