import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ValidationService {

  constructor(private translate: TranslateService) {
  }

  extractResponseError(response, applyError: (error: string) => void) {
    this.translate.get('definitions.exceptionCode')
      .subscribe(codeTranslations => {
        const code = response.json && response.json().exceptionCode;
        if (code) {
          applyError(codeTranslations[code] || code);
        }
      });
  }


}
