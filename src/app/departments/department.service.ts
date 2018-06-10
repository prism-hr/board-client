import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as Stripe from 'stripe';
import {EntityFilter} from '../general/filter/filter.component';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;
import ICustomer = Stripe.customers.ICustomer;
import DepartmentDashboardRepresentation = b.DepartmentDashboardRepresentation;

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) {
  }

  respondToMemberRequest(department: DepartmentRepresentation, user: UserRepresentation, state: string) {
    return this.http.put('/api/departments/' + department.id + '/memberRequests/' + user.id + '/' + state, {});
  }

  searchPrograms(department: DepartmentRepresentation, filter?: EntityFilter): Observable<string[]> {
    let params = new HttpParams();
    if (filter && filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }
    return this.http.get<string[]>('/api/departments/' + department.id + '/programs', {params});
  }

  getDashboard(department: DepartmentRepresentation): Observable<DepartmentDashboardRepresentation> {
    return this.http.get<DepartmentDashboardRepresentation>('/api/departments/' + department.id + '/dashboard');
  }

  getPaymentSources(department: DepartmentRepresentation): Observable<ICustomer> {
    return this.http.get<ICustomer>('/api/departments/' + department.id + '/paymentSources');
  }

  postPaymentSource(department: DepartmentRepresentation, source: string) {
    return this.http.post('/api/departments/' + department.id + '/paymentSources/' + source, {});
  }

  deletePaymentSource(department: DepartmentRepresentation, source: string) {
    return this.http.delete('/api/departments/' + department.id + '/paymentSources/' + source);
  }

  setPaymentSourceAsDefault(department: DepartmentRepresentation, source: string) {
    return this.http.post('/api/departments/' + department.id + '/paymentSources/' + source + '/setDefault', {});
  }

  cancelSubscription(department: DepartmentRepresentation) {
    return this.http.post('/api/departments/' + department.id + '/subscription', {action: 'cancel'});
  }

  restoreSubscription(department: DepartmentRepresentation) {
    return this.http.post('/api/departments/' + department.id + '/subscription', {action: 'reactivate'});
  }

  createSubscription(department: DepartmentRepresentation) {
    return this.http.post('/api/departments/' + department.id + '/subscription', {action: 'create'});
  }

}
