import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ValidationService {

  constructor(private translate: TranslateService) {
  }

  extractResponseError(response: HttpErrorResponse, applyError: (error: string) => void) {
    this.translate.get('definitions.exceptionCode')
      .subscribe(codeTranslations => {
        const code = response.error && response.error.exceptionCode;
        if (code) {
          applyError(codeTranslations[code] || 'Something went wrong');
        }
      });
  }


}
