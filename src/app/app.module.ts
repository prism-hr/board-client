import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {StormpathModule, StormpathConfiguration} from 'angular-stormpath';
import {AppComponent} from './app.component';
import {AuthenticationDialog} from './authentication/authentication.dialog';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {stormpathConfig} from './stormpath.config';
import {HeaderComponent} from './header/header.component';
import {ActivitiesComponent} from './activities/activities.component';
import {AuthedComponent} from './authentication/authed.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {AuthGuard} from './authentication/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthenticationDialog,
    NotFoundComponent,
    HomeComponent,
    AuthedComponent,
    WelcomeComponent,
    ActivitiesComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {
        path: '', component: AuthedComponent, canActivate: [AuthGuard], children: [
        {path: 'welcome', component: WelcomeComponent}
      ]
      },
      {path: '**', component: NotFoundComponent}
    ]),
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    StormpathModule
  ],
  providers: [{provide: StormpathConfiguration, useFactory: stormpathConfig}, AuthGuard],
  entryComponents: [AuthenticationDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
}


