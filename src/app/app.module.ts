import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {StormpathConfiguration, StormpathModule} from 'angular-stormpath';
import {AppComponent} from './app.component';
import {AuthenticationDialog} from './authentication/authentication.dialog';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {stormpathConfig} from './stormpath.config';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AuthedComponent} from './authentication/authed.component';
import {AuthGuard} from './authentication/auth-guard.service';
import {MotivationCheckDialog} from './header/motivation-check.dialog';
import {FileUploadComponent} from './general/file-upload.component';
import {ResourceService} from './services/resource.service';
import {BoardManageComponent} from './boards/manage/board-manage.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {StudentLogoComponent} from './home/student-logo.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CloudinaryModule} from '@cloudinary/angular';
import * as Cloudinary from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';
import {BoardResolver} from './boards/manage/board-resolver.service';
import {BoardViewComponent} from './boards/manage/view/board-view.component';
import {BoardSettingsComponent} from './boards/manage/settings/board-settings.component';
import {DepartmentResolver} from './departments/department-resolver.service';
import {DepartmentViewComponent} from './departments/view/department-view.component';
import {BoardNewComponent} from './boards/new/board-new.component';
import {RlTagInputModule} from 'angular2-tag-input/dist';
import {HomePublicComponent} from './home/home-public.component';
import {DefinitionsLoader, DefinitionsService} from './services/definitions.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from './services/translate.service';
import {BoardAliasesComponent} from './boards/board-aliases.component';
import {ControlMessagesComponent} from './validation/control-messages.component';
import {PostNewComponent} from './posts/new/post-new.component';
import {PostViewComponent} from './posts/view/post-view.component';
import {PostResolver} from './posts/post-resolver.service';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {PlacesModule} from './general/places/places.module';
import {AccountComponent} from './account/account.component';
import {DepartmentUsersComponent} from './departments/users/department-users.component';
import {DepartmentManageComponent} from './departments/department-manage.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlMessagesComponent,
    HeaderComponent,
    FooterComponent,
    AccountComponent,
    MotivationCheckDialog,
    AuthenticationDialog,
    NotFoundComponent,
    HomeComponent,
    HomePublicComponent,
    UniLogoComponent,
    EmployerLogoComponent,
    StudentLogoComponent,
    FileUploadComponent,
    AuthedComponent,
    BoardAliasesComponent,
    BoardNewComponent,
    BoardManageComponent,
    BoardViewComponent,
    BoardSettingsComponent,
    DepartmentManageComponent,
    DepartmentViewComponent,
    DepartmentUsersComponent,
    PostNewComponent,
    PostViewComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {
        path: 'newBoard',
        component: BoardNewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':departmentHandle',
        children: [
          {
            path: '',
            component: DepartmentManageComponent,
            resolve: {
              department: DepartmentResolver
            },
            children: [
              {
                path: '',
                component: DepartmentViewComponent
              },
              {
                path: 'users',
                component: DepartmentUsersComponent,
                canActivate: [AuthGuard]
              }
            ]
          },
          {
            path: ':boardHandle',
            resolve: {
              board: BoardResolver
            },
            children: [
              {
                path: '',
                component: BoardManageComponent,
                children: [
                  {
                    path: '',
                    component: BoardViewComponent
                  },
                  {
                    path: 'settings',
                    component: BoardSettingsComponent,
                    canActivate: [AuthGuard]
                  }
                ]
              },
              {
                path: 'newPost',
                component: PostNewComponent,
                canActivate: [AuthGuard]
              },
              {
                path: ':postId',
                component: PostNewComponent,
                resolve: {
                  post: PostResolver
                },
                canActivate: [AuthGuard]
              }
            ]
          }
        ]
      },
      {path: '**', component: NotFoundComponent}
    ]),
    MaterialModule,
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    StormpathModule,
    CloudinaryModule.forRoot(Cloudinary, {cloud_name: 'bitfoot'}),
    FileUploadModule,
    RlTagInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDmaVzQjUgftYVHNfTfoSszjaUe8hie8e8',
      libraries: ['places']
    }),
    PlacesModule
  ],
  providers: [
    {
      provide: StormpathConfiguration,
      useFactory: stormpathConfig
    },
    DefinitionsService,
    {
      provide: APP_INITIALIZER,
      useFactory: DefinitionsLoader,
      deps: [DefinitionsService],
      multi: true
    }, AuthGuard, ResourceService, DepartmentResolver, BoardResolver, PostResolver
  ],
  entryComponents: [AuthenticationDialog, MotivationCheckDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
}


