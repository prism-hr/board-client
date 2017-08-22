import {Injectable} from '@angular/core';
import {NavigationExtras} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class RouterStub {
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return Promise.resolve(true);
  }
}

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private testSubject = new BehaviorSubject(this.testParams);
  params = this.testSubject.asObservable();

  // ActivatedRoute.data is Observable
  private dataSubject = new BehaviorSubject(this.testData);
  data = this.dataSubject.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() {
    return this._testParams;
  }

  set testParams(params: {}) {
    this._testParams = params;
    this.testSubject.next(params);
  }

  // Test data
  private _testData: {};
  get testData() {
    return this._testData;
  }

  set testData(data: {}) {
    this._testData = data;
    this.dataSubject.next(data);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return {params: this.testParams, data: this.testData};
  }
}
