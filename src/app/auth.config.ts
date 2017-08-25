import {CustomConfig} from 'ng2-ui-auth';

export class MyAuthConfig extends CustomConfig {
  defaultHeaders = {'Content-Type': 'application/json'};
  autoRefreshToken = true;
  refreshBeforeExpiration = 7200000;
  loginUrl = '/api/auth/login';
  signupUrl = '/api/auth/register';
  refreshUrl = '/api/auth/refresh';
  providers = {
    linkedin: {url: '/api/auth/linkedin', requiredUrlParams: ['state', 'scope']},
    facebook: {url: '/api/auth/facebook'}
  };
}
