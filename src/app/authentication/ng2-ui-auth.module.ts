import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {
  AuthService,
  BrowserStorageService,
  CONFIG_OPTIONS,
  ConfigService,
  IPartialConfigOptions,
  IProviders,
  LocalService,
  Oauth1Service,
  Oauth2Service,
  OauthService,
  PopupService,
  SharedService,
  StorageService,
  StorageType
} from 'ng2-ui-auth';
import {CustomJwtInterceptor} from './jwt-interceptor.service';

@NgModule({imports: [HttpClientModule]})
export class CustomNg2UiAuthModule {
  static forRoot(configOptions?: IPartialConfigOptions, defaultJwtInterceptor = true): ModuleWithProviders {
    return {
      ngModule: CustomNg2UiAuthModule,
      providers: [
        ...configOptions ? [{provide: CONFIG_OPTIONS, useValue: configOptions}] : [],
        {provide: ConfigService, useClass: ConfigService, deps: [CONFIG_OPTIONS]},
        {provide: StorageService, useClass: BrowserStorageService, deps: [ConfigService]},
        {provide: SharedService, useClass: SharedService, deps: [StorageService, ConfigService]},
        ...defaultJwtInterceptor ? [{
          provide: HTTP_INTERCEPTORS,
          useClass: CustomJwtInterceptor,
          multi: true,
          deps: [SharedService, ConfigService]
        }] : [],
        {provide: OauthService, useClass: OauthService, deps: [HttpClient, SharedService, ConfigService, PopupService]},
        {provide: PopupService, useClass: PopupService, deps: [ConfigService]},
        {provide: LocalService, useClass: LocalService, deps: [HttpClient, SharedService, ConfigService]},
        {provide: AuthService, useClass: AuthService, deps: [SharedService, LocalService, OauthService]},
      ],
    };
  }
}

export {
  LocalService,
  Oauth2Service,
  Oauth1Service,
  PopupService,
  OauthService,
  SharedService,
  StorageService, BrowserStorageService,
  AuthService,
  ConfigService, IPartialConfigOptions,
  CustomJwtInterceptor,
  CONFIG_OPTIONS,
  IProviders,
  StorageType,
};
