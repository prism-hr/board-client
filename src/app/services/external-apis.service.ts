import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ExternalApisService {

  constructor(private http: HttpClient) {
  }

  lookupOrganizations(text: string) {
    const headers = new HttpHeaders({'Authorization': 'pk_1c49d926642d601db96056cf286bfe63'});
    return this.http.get('https://autocomplete.clearbit.com/v1/companies/suggest?query=' + text.trim(),
      {headers});
  }
}

