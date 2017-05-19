import {CustomConfig} from 'ng2-ui-auth';

export class MyAuthConfig extends CustomConfig {
  defaultHeaders = {'Content-Type': 'application/json'};
  loginUrl = '/api/auth/login';
  signupUrl = '/api/auth/register';
  providers = {linkedin: {clientId: '772yxzl30r2opy', requiredUrlParams: ['state', 'scope']}};
}
