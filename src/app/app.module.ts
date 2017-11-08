import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MatCardModule, MatDialogModule, MatSnackBarModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RlTagInputModule} from 'angular2-tag-input/dist';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {PapaParseModule} from 'ngx-papaparse';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {NgUploaderModule} from 'ngx-uploader';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {
  AutoCompleteModule,
  CalendarModule,
  ChipsModule,
  DropdownModule,
  EditorModule,
  OverlayPanelModule,
  RadioButtonModule,
  SplitButtonModule,
  TabMenuModule
} from 'primeng/primeng';
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
import {BoardHeaderComponent} from './boards/header/board-header.component';
import {BoardItemComponent} from './boards/item/board-item.component';
import {BoardListComponent} from './boards/list/board-list.component';
import {BoardResolver} from './boards/manage/board-resolver.service';
import {BoardTabsComponent} from './boards/manage/board-tabs.component';
import {BoardEditComponent} from './boards/manage/edit/board-edit.component';
import {BoardViewComponent} from './boards/manage/view/board-view.component';
import {BoardNewComponent} from './boards/new/board-new.component';
import {DateTimeModule} from './controls/datetime.component';
import {ResourceHandleComponent} from './controls/resource-handle.component';
import {DepartmentNewComponent} from './departments/department-new.component';
import {DepartmentResolver} from './departments/department-resolver.service';
import {DepartmentTabsComponent} from './departments/department-tabs.component';
import {DepartmentService} from './departments/department.service';
import {DepartmentEditComponent} from './departments/edit/department-edit.component';
import {DepartmentHeaderComponent} from './departments/header/department-header.component';
import {DepartmentListComponent} from './departments/list/department-list.component';
import {DepartmentViewComponent} from './departments/view/department-view.component';
import {FooterComponent} from './footer/footer.component';
import {FileUploadModule} from './general/file-upload/file-upload.module';
import {FilterModule} from './general/filter/filter.module';
import {ImageModule} from './general/image/image.module';
import {PlacesAutocompleteModule} from './general/places/places.module';
import {SharedModule} from './general/shared.module';
import {HeaderActivityComponent} from './header/header-activity.component';
import {HeaderComponent} from './header/header.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {HomePublicComponent} from './home/home-public.component';
import {HomeComponent} from './home/home.component';
import {StudentLogoComponent} from './home/student-logo.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {NotFoundComponent} from './not-found.component';
import {AboutUsComponent} from './pages/about/about-us.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {TermsComponent} from './pages/terms/terms.component';
import {BoardsResolver} from './posts/edit/boards-resolver.service';
import {PostHeaderComponent} from './posts/header/post-header.component';
import {PostItemComponent} from './posts/item/post-item.component';
import {PostResolver} from './posts/post-resolver.service';
import {PostTabsComponent} from './posts/post-tabs.component';
import {PostService} from './posts/post.service';
import {PostResponsesComponent} from './posts/responses/post-responses.component';
import {ResourceActionsBoxComponent} from './resource/actions-box/resource-actions-box.component';
import {ResourceBadgeComponent} from './resource/resource-badge.component';
import {ResourceCommentDialogComponent} from './resource/resource-comment.dialog';
import {ResourceTimelineModule} from './resource/timeline/resource-timeline.module';
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
    HomeComponent,
    HomePublicComponent,
    UniLogoComponent,
    EmployerLogoComponent,
    StudentLogoComponent,
    BoardListComponent,
    ResourceHandleComponent,
    BoardHeaderComponent,
    BoardNewComponent,
    BoardTabsComponent,
    BoardViewComponent,
    BoardEditComponent,
    BoardItemComponent,
    DepartmentListComponent,
    DepartmentTabsComponent,
    DepartmentViewComponent,
    DepartmentEditComponent,
    DepartmentNewComponent,
    DepartmentHeaderComponent,
    ResourceBadgeComponent,
    PostHeaderComponent,
    PostTabsComponent,
    PostResponsesComponent,
    PostItemComponent,
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
          {path: '', component: HomeComponent},
          {path: 'home', component: HomeComponent},
          {path: 'boards', component: BoardListComponent, canActivate: [AuthGuard]},
          {path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard]},
          {
            path: 'newDepartment',
            component: DepartmentNewComponent,
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                component: DepartmentEditComponent
              }
            ]
          },
          {
            path: 'newBoard',
            component: BoardNewComponent
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
            data: {modalType: 'register'},
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
                            component: DepartmentViewComponent,
                          },
                          {
                            path: 'edit',
                            component: DepartmentEditComponent,
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
                            component: BoardViewComponent
                          },
                          {
                            path: 'edit',
                            component: BoardEditComponent,
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'users',
                            loadChildren: 'app/resource/users/resource-users.module#ResourceUsersModule',
                            canActivate: [AuthGuard]
                          },
                          {
                            path: 'badge',
                            component: ResourceBadgeComponent,
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
    ResourceTimelineModule,
    DateTimeModule,
    // PrimeNG modules
    ChipsModule,
    RadioButtonModule,
    TabMenuModule,
    DropdownModule,
    CalendarModule,
    SplitButtonModule,
    SidebarModule,
    EditorModule,
    AutoCompleteModule,
    OverlayPanelModule,
    // Material modules
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgUploaderModule,
    RlTagInputModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    Ng2UiAuthModule.forRoot(MyAuthConfig),
    ShareButtonsModule.forRoot(),
    ClipboardModule,
    PapaParseModule
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


