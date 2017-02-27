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
import {BoardsComponent} from './boards/boards.component';
import {AuthGuard} from './authentication/auth-guard.service';
import {MotivationCheckDialog} from './header/motivation-check.dialog';
import {BoardsResolver} from './boards/boards-resolver.service';
import {DepartmentsResolver} from './new-board/departments-resolver.service';
import {NewBoardComponent} from './new-board/new-board.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {StudentLogoComponent} from './home/student-logo.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MotivationCheckDialog,
    AuthenticationDialog,
    NotFoundComponent,
    HomeComponent,
    UniLogoComponent,
    EmployerLogoComponent,
    StudentLogoComponent,
    AuthedComponent,
    BoardsComponent,
    NewBoardComponent,
    ActivitiesComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'activities', component: ActivitiesComponent},
      {
        path: '', component: AuthedComponent, canActivate: [AuthGuard], children: [
        {
          path: 'boards',
          component: BoardsComponent,
          resolve: {
            boards: BoardsResolver
          }
        },
        {
          path: 'new-board',
          component: NewBoardComponent,
          resolve: {
            departments: DepartmentsResolver
          }
        }
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
  providers: [{provide: StormpathConfiguration, useFactory: stormpathConfig}, AuthGuard, BoardsResolver, DepartmentsResolver],
  entryComponents: [AuthenticationDialog, MotivationCheckDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
}


