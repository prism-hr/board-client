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
import {AuthGuard} from './authentication/auth-guard.service';
import {MotivationCheckDialog} from './header/motivation-check.dialog';
import {LogoUploadComponent} from './general/logo-upload.component';
import {BoardsService} from './boards/boards.service';
import {DepartmentsResolver} from './boards/manage/departments-resolver.service';
import {BoardManageComponent} from './boards/manage/board-manage.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {StudentLogoComponent} from './home/student-logo.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavComponent} from './sidenav/sidenav.component';
import {CloudinaryModule} from '@cloudinary/angular';
import * as Cloudinary from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';
import {BoardResolver} from './boards/manage/board-resolver.service';
import {BoardViewComponent} from './boards/manage/view/board-view.component';
import {BoardSettingsComponent} from './boards/manage/settings/board-settings.component';
import {DepartmentResolver} from './departments/department-resolver.service';
import {DepartmentViewComponent} from './departments/department-view.component';
import {BoardNewComponent} from './boards/new/board-new.component';
import {RlTagInputModule} from 'angular2-tag-input/dist';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    MotivationCheckDialog,
    AuthenticationDialog,
    NotFoundComponent,
    HomeComponent,
    UniLogoComponent,
    EmployerLogoComponent,
    StudentLogoComponent,
    LogoUploadComponent,
    AuthedComponent,
    BoardNewComponent,
    BoardManageComponent,
    BoardViewComponent,
    BoardSettingsComponent,
    DepartmentViewComponent,
    ActivitiesComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'activities', component: ActivitiesComponent},
      {
        path: '', component: AuthedComponent, canActivate: [AuthGuard], children: [
        {
          path: 'newBoard',
          component: BoardNewComponent,
          resolve: {
            departments: DepartmentsResolver
          }
        },
        {
          path: 'manage/board/:id',
          component: BoardManageComponent,
          resolve: {
            board: BoardResolver
          },
          children: [
            {
              path: 'view',
              component: BoardViewComponent
            },
            {
              path: 'settings',
              component: BoardSettingsComponent
            }
          ]
        },
        {
          path: 'manage/department/:id/view',
          component: DepartmentViewComponent,
          resolve: {
            department: DepartmentResolver
          }
        }
      ]
      },
      {path: '**', component: NotFoundComponent}
    ]),
    MaterialModule,
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    StormpathModule,
    CloudinaryModule.forRoot(Cloudinary, {cloud_name: 'bitfoot'}),
    FileUploadModule,
    RlTagInputModule
  ],
  providers: [{
    provide: StormpathConfiguration,
    useFactory: stormpathConfig
  }, AuthGuard, BoardsService, DepartmentsResolver, DepartmentResolver, BoardResolver],
  entryComponents: [AuthenticationDialog, MotivationCheckDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
}


