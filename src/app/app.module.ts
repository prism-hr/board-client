import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ClipboardModule} from 'ngx-clipboard';
import {OverlayPanelModule} from 'primeng/components/overlaypanel/overlaypanel';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {MenuModule} from 'primeng/menu';
import {PanelMenuModule, TabMenuModule} from 'primeng/primeng';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {authConfig} from './auth.config';
import {AuthGuard} from './authentication/auth-guard.service';
import {AuthenticationDialogComponent} from './authentication/authentication.dialog';
import {InitializeGuard} from './authentication/initialize-guard.service';
import {CustomNg2UiAuthModule} from './authentication/ng2-ui-auth.module';
import {ResetPasswordDialogComponent} from './authentication/reset-password.dialog';
import {UnsubscribeDialogComponent} from './authentication/unsubscribe.dialog';
import {UserImageDialogComponent} from './authentication/user-image.dialog';
import {BoardResolver} from './boards/board-resolver.service';
import {BoardTabsComponent} from './boards/board-tabs.component';
import {BoardHeaderComponent} from './boards/header/board-header.component';
import {DepartmentsResolver} from './boards/new/departments-resolver.service';
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
import {PostHeaderComponent} from './posts/header/post-header.component';
import {PostResolver} from './posts/post-resolver.service';
import {PostTabsComponent} from './posts/post-tabs.component';
import {PostService} from './posts/post.service';
import {PostResponsesComponent} from './posts/responses/post-responses.component';
import {ResourceActionsBoxComponent} from './resource/actions-box/resource-actions-box.component';
import {ResourceCommentDialogComponent} from './resource/resource-comment.dialog';
import {RollbarConfig} from './rollbar/rollbar.config';
import {RollbarService} from './rollbar/rollbar.service';
import {DefinitionsLoader, DefinitionsService} from './services/definitions.service';
import {DisplayDatePipe} from './services/display-date.pipe';
import {ExternalApisService} from './services/external-apis.service';
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
          {path: '', loadChildren: './home/home.module#HomeModule'},
          {path: 'home', loadChildren: './home/home.module#HomeModule'},
          {
            path: 'boards',
            loadChildren: './boards/list/board-list.module#BoardListModule',
            canActivate: [AuthGuard]
          },
          {path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard]},
          {
            path: 'newDepartment',
            loadChildren: './departments/new/department-new.module#DepartmentNewModule'
          },
          {
            path: 'newBoard',
            loadChildren: './boards/new/board-new.module#BoardNewModule',
            resolve: {
              departments: DepartmentsResolver
            },
            canActivate: [AuthGuard]
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
            loadChildren: './posts/edit/post-edit.module#PostEditModule',
            data: {modalView: 'REGISTER'},
            resolve: {
              department: DepartmentResolver
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'account',
            loadChildren: './account/account.module#AccountModule',
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
                            loadChildren: './departments/view/department-view.module#DepartmentViewModule'
                          },
                          {
                            path: 'edit',
                            loadChildren: './departments/edit/department-edit.module#DepartmentEditModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'posts',
                            loadChildren: './departments/posts/department-posts.module#DepartmentPostsModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'users',
                            loadChildren: './resource/users/resource-users.module#ResourceUsersModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'badge',
                            loadChildren: './resource/badge/resource-badge.module#ResourceBadgeModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'subscription',
                            loadChildren: './departments/subscription/department-subscription.module#DepartmentSubscriptionModule',
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
                            loadChildren: './boards/view/board-view.module#BoardViewModule'
                          },
                          {
                            path: 'edit',
                            loadChildren: './boards/edit/board-edit.module#BoardEditModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'badge',
                            loadChildren: './resource/badge/resource-badge.module#ResourceBadgeModule',
                            canActivate: [AuthGuard]
                          }
                        ]
                      },
                      {
                        path: ':postId',
                        data: {
                          resourceScope: 'post'
                        },
                        resolve: {
                          post: PostResolver,
                        },
                        component: PostTabsComponent,
                        children: [
                          {
                            path: '',
                            loadChildren: './posts/view/post-view.module#PostViewModule'
                          },
                          {
                            path: 'edit',
                            loadChildren: './posts/edit/post-edit.module#PostEditModule',
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
    ], {paramsInheritanceStrategy: 'always'}),
    // Board modules
    SharedModule,
    FilterModule,
    ImageModule,
    FileUploadModule,
    // PrimeNG modules
    MenuModule,
    TabMenuModule,
    PanelMenuModule,
    SidebarModule,
    OverlayPanelModule,
    // Material modules
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    CustomNg2UiAuthModule.forRoot(authConfig),
    ClipboardModule // TODO remove when https://github.com/maxisam/ngx-clipboard/issues/133 is fixed
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
        enabled: true,
        verbose: true,
        accessToken: 'da4d675c8c5340819eac1c080f5b1e76',
        payload: {
          environment: environment.id
        }
      }
    },
    RollbarService,
    {provide: ErrorHandler, useClass: RollbarService},
    AuthGuard, InitializeGuard, ResourceService, DepartmentResolver, BoardResolver, PostResolver, PostService, DepartmentsResolver,
    DepartmentService, UserService, ValidationService, ExternalApisService
  ],
  entryComponents: [AuthenticationDialogComponent, ResetPasswordDialogComponent, UnsubscribeDialogComponent, ResourceCommentDialogComponent,
    UserImageDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}


