import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {StormpathModule, StormpathConfiguration} from 'angular-stormpath';
import {AppComponent} from './app.component';
import {AuthenticationDialog} from './authentication/authentication.dialog';
import {WelcomeComponent} from './welcome/welcome.component';
import {NotFoundComponent} from './not-found.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {stormpathConfig} from './stormpath.config';
import {HeaderComponent} from './header/header.component';
import {ActivitiesComponent} from './activities/activities.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationDialog,
    NotFoundComponent,
    WelcomeComponent,
    HeaderComponent,
    ActivitiesComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', component: WelcomeComponent},
      {path: '**', component: NotFoundComponent}
    ]),
    MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    StormpathModule
  ],
  providers: [{provide: StormpathConfiguration, useFactory: stormpathConfig}],
  entryComponents: [AuthenticationDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
}


