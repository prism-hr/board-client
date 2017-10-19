import {ErrorHandler, Injectable} from '@angular/core';
import {RollbarService} from './rollbar.service';

@Injectable()
export class RollbarHandler implements ErrorHandler {

  constructor(private rollbarService: RollbarService) {
  }

  public handleError(err: any): void {
    this.rollbarService.handleError(err);
  }
}
