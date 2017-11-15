import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {EntityFilter} from '../general/filter/filter.component';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;
import * as Stripe from 'stripe';
import ICustomer = Stripe.customers.ICustomer;

@Injectable()
export class DepartmentService {

  constructor(private http: JwtHttp) {
  }

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {}).map(res => res.json());
  }

  searchPrograms(department: DepartmentRepresentation, filter?: EntityFilter): Observable<string[]> {
    const params = new URLSearchParams();
    if (filter && filter.searchTerm) {
      params.set('searchTerm', filter.searchTerm);
    }
    return this.http.get('/api/departments/' + department.id + '/programs', {search: params}).map(res => res.json());
  }

  getPaymentSources(department: DepartmentRepresentation): Observable<ICustomer> {
    return this.http.get('/api/departments/' + department.id + '/paymentSources').map(res => res.json());
  }

  postPaymentSource(department: DepartmentRepresentation, source: string) {
    return this.http.post('/api/departments/' + department.id + '/paymentSources/' + source, {}).map(res => res.json());
  }

  deletePaymentSource(department: DepartmentRepresentation, source: string) {
    return this.http.delete('/api/departments/' + department.id + '/paymentSources/' + source).map(res => res.json());
  }

  setPaymentSourceAsDefault(department: DepartmentRepresentation, source: string) {
    return this.http.post('/api/departments/' + department.id + '/paymentSources/' + source + '/setDefault', {}).map(res => res.json());
  }

}
