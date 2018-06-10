import {IPartialConfigOptions} from 'ng2-ui-auth/lib/config-interfaces';

export let authConfig: IPartialConfigOptions = {
  // defaultHeaders: {'Content-Type': 'application/json'},
  loginUrl: '/api/auth/login',
  signupUrl: '/api/auth/register',
  providers: {
    linkedin: {url: '/api/auth/linkedin', additionalUrlParams: ['state', 'scope']},
    facebook: {url: '/api/auth/facebook'}
  }
};
