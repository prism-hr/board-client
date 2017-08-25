import {Injector, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
import {
  AuthService,
  BrowserStorageService,
  ConfigService,
  CustomConfig, JwtHttp,
  LocalService,
  Oauth1Service,
  Oauth2Service,
  OauthService,
  PopupService,
  SharedService,
  StorageService
} from 'ng2-ui-auth';
import {CustomJwtHttp} from './jwt-http.service';
/**
 * Created by Ron on 25/12/2015.
 */

@NgModule({
  imports: [HttpModule],
})
export class Ng2UiAuthModule {
  static forRoot(config: Type<CustomConfig>): ModuleWithProviders {
    return {
      ngModule: Ng2UiAuthModule,
      providers: [
        {provide: CustomConfig, useClass: config},
        {provide: ConfigService, useClass: ConfigService, deps: [CustomConfig]},
        {provide: StorageService, useClass: BrowserStorageService, deps: [ConfigService]},
        {provide: SharedService, useClass: SharedService, deps: [StorageService, ConfigService]},
        {provide: JwtHttp, useClass: CustomJwtHttp, deps: [Http, SharedService, ConfigService]},
        {provide: OauthService, useClass: OauthService, deps: [JwtHttp, Injector, SharedService, ConfigService]},
        {provide: PopupService, useClass: PopupService, deps: [ConfigService]},
        {provide: Oauth1Service, useClass: Oauth1Service, deps: [JwtHttp, PopupService, ConfigService]},
        {provide: Oauth2Service, useClass: Oauth2Service, deps: [JwtHttp, PopupService, StorageService, ConfigService]},
        {provide: LocalService, useClass: LocalService, deps: [JwtHttp, SharedService, ConfigService]},
        {provide: AuthService, useClass: AuthService, deps: [SharedService, LocalService, OauthService]},
      ],
    };
  }
}

