import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {OverlayPanelModule, TabMenuModule} from 'primeng/primeng';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {MyAuthConfig} from './auth.config';
import {AuthGuard} from './authentication/auth-guard.service';
import {AuthenticationDialogComponent} from './authentication/authentication.dialog';
import {InitializeGuard} from './authentication/initialize-guard.service';
import {Ng2UiAuthModule} from './authentication/ng2-ui-auth.module';
import {ResetPasswordDialogComponent} from './authentication/reset-password.dialog';
import {UnsubscribeDialogComponent} from './authentication/unsubscribe.dialog';
import {UserImageDialogComponent} from './authentication/user-image.dialog';
import {BoardResolver} from './boards/board-resolver.service';
import {BoardTabsComponent} from './boards/board-tabs.component';
import {BoardHeaderComponent} from './boards/header/board-header.component';
import {DepartmentNewComponent} from './departments/department-new.component';
import {DepartmentResolver} from './departments/department-resolver.service';
import {DepartmentTabsComponent} from './departments/department-tabs.component';
import {DepartmentService} from './departments/department.service';
import {DepartmentHeaderComponent} from './departments/header/department-header.component';
import {DepartmentListComponent} from './departments/list/department-list.component';
import {FooterComponent} from './footer/footer.component';
import {FileUploadModule} from './general/file-upload/file-upload.module';
import {FilterModule} from './general/filter/filter.module';
import {ImageModule} from './general/image/image.module';
import {SharedModule} from './general/shared.module';
import {HeaderActivityComponent} from './header/header-activity.component';
import {HeaderComponent} from './header/header.component';
import {NotFoundComponent} from './not-found.component';
import {AboutUsComponent} from './pages/about/about-us.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {TermsComponent} from './pages/terms/terms.component';
import {BoardsResolver} from './posts/edit/boards-resolver.service';
import {PostHeaderComponent} from './posts/header/post-header.component';
import {PostResolver} from './posts/post-resolver.service';
import {PostTabsComponent} from './posts/post-tabs.component';
import {PostService} from './posts/post.service';
import {PostResponsesComponent} from './posts/responses/post-responses.component';
import {ResourceActionsBoxComponent} from './resource/actions-box/resource-actions-box.component';
import {ResourceCommentDialogComponent} from './resource/resource-comment.dialog';
import {RollbarHandler} from './rollbar/rollbar-handler.service';
import {RollbarConfig} from './rollbar/rollbar.config';
import {RollbarService} from './rollbar/rollbar.service';
import './rxjs-extensions';
import {DefinitionsLoader, DefinitionsService} from './services/definitions.service';
import {DisplayDatePipe} from './services/display-date.pipe';
import {ResourceService} from './services/resource.service';
import {TimeDifferencePipe} from './services/time-difference.pipe';
import {createTranslateLoader} from './services/translate.service';
import {UserService} from './services/user.service';
import {ValidationService} from './validation/validation.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderActivityComponent,
    FooterComponent,
    AuthenticationDialogComponent,
    ResetPasswordDialogComponent,
    UnsubscribeDialogComponent,
    NotFoundComponent,
    BoardHeaderComponent,
    BoardTabsComponent,
    DepartmentListComponent,
    DepartmentTabsComponent,
    DepartmentNewComponent,
    DepartmentHeaderComponent,
    PostHeaderComponent,
    PostTabsComponent,
    PostResponsesComponent,
    ResourceActionsBoxComponent,
    ResourceCommentDialogComponent,
    UserImageDialogComponent,
    AboutUsComponent,
    PrivacyComponent,
    TermsComponent,
    DisplayDatePipe,
    TimeDifferencePipe
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        canActivate: [InitializeGuard],
        children: [
          {path: '', loadChildren: 'app/home/home.module#HomeModule'},
          {path: 'home', loadChildren: 'app/home/home.module#HomeModule'},
          {
            path: 'boards',
            loadChildren: 'app/boards/list/board-list.module#BoardListModule',
            canActivate: [AuthGuard]
          },
          {path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard]},
          {
            path: 'newDepartment',
            component: DepartmentNewComponent,
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                loadChildren: 'app/departments/edit/department-edit.module#DepartmentEditModule'
              }
            ]
          },
          {
            path: 'newBoard',
            loadChildren: 'app/boards/new/board-new.module#BoardNewModule'
          },
          {
            path: 'about',
            component: AboutUsComponent
          },
          {
            path: 'privacyPolicy',
            component: PrivacyComponent
          },
          {
            path: 'termsConditions',
            component: TermsComponent
          },
          {
            path: 'newPost',
            loadChildren: 'app/posts/edit/post-edit.module#PostEditModule',
            data: {modalType: 'Register'},
            resolve: {
              boards: BoardsResolver
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'account',
            loadChildren: 'app/account/account.module#AccountModule',
            canActivate: [AuthGuard]
          },
          {
            path: ':universityHandle',
            children: [
              {
                path: ':departmentHandle',
                children: [
                  {
                    path: '',
                    data: {
                      resourceScope: 'department'
                    },
                    resolve: {
                      department: DepartmentResolver,
                    },
                    children: [
                      {
                        path: '',
                        component: DepartmentTabsComponent,
                        children: [
                          {
                            path: '',
                            loadChildren: 'app/departments/view/department-view.module#DepartmentViewModule'
                          },
                          {
                            path: 'edit',
                            loadChildren: 'app/departments/edit/department-edit.module#DepartmentEditModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'users',
                            loadChildren: 'app/resource/users/resource-users.module#ResourceUsersModule',
                            canActivate: [AuthGuard]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: ':boardHandle',
                    data: {
                      resourceScope: 'board'
                    },
                    resolve: {
                      board: BoardResolver
                    },
                    children: [
                      {
                        path: '',
                        component: BoardTabsComponent,
                        children: [
                          {
                            path: '',
                            loadChildren: 'app/boards/view/board-view.module#BoardViewModule'
                          },
                          {
                            path: 'edit',
                            loadChildren: 'app/boards/edit/board-edit.module#BoardEditModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'users',
                            loadChildren: 'app/resource/users/resource-users.module#ResourceUsersModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'badge',
                            loadChildren: 'app/resource/badge/resource-badge.module#ResourceBadgeModule',
                            canActivate: [AuthGuard]
                          }
                        ]
                      },
                      {
                        path: ':postId',
                        resolve: {
                          post: PostResolver,
                        },
                        component: PostTabsComponent,
                        children: [
                          {
                            path: '',
                            loadChildren: 'app/posts/view/post-view.module#PostViewModule'
                          },
                          {
                            path: 'edit',
                            loadChildren: 'app/posts/edit/post-edit.module#PostEditModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'responses',
                            component: PostResponsesComponent,
                            canActivate: [AuthGuard]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {path: '**', component: NotFoundComponent}]
      }
    ]),
    // Board modules
    SharedModule,
    FilterModule,
    ImageModule,
    FileUploadModule,
    // PrimeNG modules
    TabMenuModule,
    SidebarModule,
    OverlayPanelModule,
    // Material modules
    MatDialogModule,
    MatSnackBarModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    Ng2UiAuthModule.forRoot(MyAuthConfig)
  ],
  providers: [
    DefinitionsService,
    {
      provide: APP_INITIALIZER,
      useFactory: DefinitionsLoader,
      deps: [DefinitionsService],
      multi: true
    },
    {
      provide: RollbarConfig, useValue: {
      verbose: true,
      accessToken: 'da4d675c8c5340819eac1c080f5b1e76',
      payload: {
        environment: environment.id
      }
    }
    },
    RollbarService,
    {provide: ErrorHandler, useClass: RollbarHandler},
    AuthGuard, InitializeGuard, ResourceService, DepartmentResolver, BoardResolver, PostResolver, PostService, BoardsResolver,
    DepartmentService, UserService, ValidationService
  ],
  entryComponents: [AuthenticationDialogComponent, ResetPasswordDialogComponent, UnsubscribeDialogComponent, ResourceCommentDialogComponent,
    UserImageDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}


