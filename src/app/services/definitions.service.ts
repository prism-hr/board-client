import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from 'ng2-ui-auth';

@Injectable()
export class DefinitionsService {

  private definitions: { [key: string]: any };

  constructor(private http: Http, private authConfig: ConfigService) {
  }

  loadDefinitions(): Promise<any> {
    return this.http.get('/api/definitions')
      .toPromise()
      .then(definitions => {

        this.definitions = definitions.json();
        this.applyOauthProviderSettings();
        return this.definitions;
      });
  }

  getDefinitions() {
    return this.definitions;
  }

  private applyOauthProviderSettings() {
    for (const provider of this.definitions.oauthProvider) {
      const providers = this.authConfig.providers;
      const oauthSettings = providers[provider.id.toLowerCase()];
      oauthSettings.clientId = provider.clientId;
    }
  }
}

export function DefinitionsLoader(definitionsService: DefinitionsService) {
  return () => definitionsService.loadDefinitions();
}
