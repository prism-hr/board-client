import {StormpathConfiguration} from 'angular-stormpath';

export function stormpathConfig(): StormpathConfiguration {
  const spConfig: StormpathConfiguration = new StormpathConfiguration();
  spConfig.endpointPrefix = '/api';
  return spConfig;
}
