import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigService} from 'ng2-ui-auth';
import {IOauth2Options} from 'ng2-ui-auth/lib/config-interfaces';

@Injectable()
export class DefinitionsService {

  private definitions: { [key: string]: any };

  constructor(private http: HttpClient, private authConfig: ConfigService) {
  }

  loadDefinitions(): Promise<any> {
    return this.http.get('/api/definitions')
      .toPromise()
      .then(definitions => {
        this.definitions = definitions;
        this.applyOauthProviderSettings();
        return this.definitions;
      });
  }

  getDefinitions() {
    return this.definitions;
  }

  private applyOauthProviderSettings() {
    for (const provider of this.definitions.oauthProvider) {
      const providers = this.authConfig.options.providers;
      const oauthSettings = <IOauth2Options>providers[provider.id.toLowerCase()];
      oauthSettings.clientId = provider.clientId;
    }
  }
}

export function DefinitionsLoader(definitionsService: DefinitionsService) {
  return () => definitionsService.loadDefinitions();
}
