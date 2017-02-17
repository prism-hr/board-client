import {StormpathConfiguration} from 'angular-stormpath';

export function stormpathConfig(): StormpathConfiguration {
  let spConfig: StormpathConfiguration = new StormpathConfiguration();
  spConfig.endpointPrefix = '/api';
  return spConfig;
}
