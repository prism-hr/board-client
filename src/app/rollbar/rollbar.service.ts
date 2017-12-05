import {ErrorHandler, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import * as Rollbar from 'rollbar';
import {RollbarConfig} from './rollbar.config';
import {environment} from '../../environments/environment';

@Injectable()
export class RollbarService implements ErrorHandler {
  private rollbar: any;

  constructor(options: RollbarConfig) {
    this.rollbar = new Rollbar(<Rollbar.Configuration> options);
  }

  public configure(options: RollbarConfig) {
    return this.rollbar.configure(options);
  }

  public handleError(err: any): void {
    if(environment.production) {
      if (err instanceof Response) {
        this.rollbar.error({status: err.status, statusText: err.statusText, url: err.url});
      } else {
        this.rollbar.error(err.originalError || err);
      }
    } else {
      console.error(err);
    }
  }

  public log(message: String, error?: Error, data?: Object, callback?: Function): Promise<any> {
    return this.rollbar.log(message, error, data, callback);
  }

  public info(message: String, error?: Error, data?: Object, callback?: Function): Promise<any> {
    return this.rollbar.info(message, error, data, callback);
  }

  public warn(message: String, error?: Error, data?: Object, callback?: Function): Promise<any> {
    return this.rollbar.warn(message, error, data, callback);
  }

  public error(message: String, error?: Error, data?: Object, callback?: Function): Promise<any> {
    return this.rollbar.error(message, error, data, callback);
  }

  public critical(message: String, error?: Error, data?: Object, callback?: Function): Promise<any> {
    return this.rollbar.critical(message, error, data, callback);
  }
}
