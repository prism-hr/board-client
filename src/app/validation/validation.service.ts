import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Response} from '@angular/http';

@Injectable()
export class ValidationService {

  constructor(private translate: TranslateService) {
  }

  extractResponseError(response: Response, applyError: (error: string) => void) {
    this.translate.get('definitions.exceptionCode')
      .subscribe(codeTranslations => {
        const code = response.json && response.json()['exceptionCode'];
        if (code) {
          applyError(codeTranslations[code] || 'Something went wrong');
        }
      });
  }


}
