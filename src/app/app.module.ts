import {HttpClient, HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MdCardModule, MdDialogModule, MdSnackBarModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {MetaGuard, MetaLoader, MetaModule} from '@ngx-meta/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {MomentModule} from 'angular2-moment';
import {RlTagInputModule} from 'angular2-tag-input/dist';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {NgUploaderModule} from 'ngx-uploader';
import {
  AutoCompleteModule,
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  ChipsModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  EditorModule,
  InputMaskModule,
  InputTextModule,
  MessagesModule,
  OverlayPanelModule,
  RadioButtonModule,
  SelectButtonModule,
  SplitButtonModule,
  TabMenuModule,
  ToggleButtonModule,
  TooltipModule
} from 'primeng/primeng';
import {AccountNotificationsComponent} from './account/account-notifications.component';
import {AccountSuppressionsResolver} from './account/account-suppressions-resolver';
import {AccountComponent} from './account/account.component';
import {AppComponent} from './app.component';
import {MyAuthConfig} from './auth.config';
import {AuthGuard} from './authentication/auth-guard.service';
import {AuthedComponent} from './authentication/authed.component';
import {AuthenticationDialogComponent} from './authentication/authentication.dialog';
import {ResetPasswordDialogComponent} from './authentication/reset-password.dialog';
import {UserImageDialogComponent} from './authentication/user-image.dialog';
import {BoardHeaderComponent} from './boards/header/board-header.component';
import {BoardItemComponent} from './boards/item/board-item.component';
import {BoardListComponent} from './boards/list/board-list.component';
import {BoardManageComponent} from './boards/manage/board-manage.component';
import {BoardResolver} from './boards/manage/board-resolver.service';
import {BoardsResolver} from './boards/manage/boards-resolver.service';
import {BoardEditComponent} from './boards/manage/edit/board-edit.component';
import {BoardViewComponent} from './boards/manage/view/board-view.component';
import {BoardNewComponent} from './boards/new/board-new.component';
import {DateTimeComponent} from './controls/datetime.component';
import {ResourceHandleComponent} from './controls/resource-handle.component';
import {DepartmentManageComponent} from './departments/department-manage.component';
import {DepartmentNewComponent} from './departments/department-new.component';
import {DepartmentResolver} from './departments/department-resolver.service';
import {DepartmentEditComponent} from './departments/edit/department-edit.component';
import {DepartmentHeaderComponent} from './departments/header/department-header.component';
import {DepartmentListComponent} from './departments/list/department-list.component';
import {DepartmentRequestMembershipDialogComponent} from './departments/request-membership/department-request-membership.dialog';
import {DepartmentViewComponent} from './departments/view/department-view.component';
import {FooterComponent} from './footer/footer.component';
import {FileUploadComponent} from './general/file-upload.component';
import {PlacesModule} from './general/places/places.module';
import {UserLookupComponent} from './general/user-lookup';
import {HeaderActivityComponent} from './header/header-activity.component';
import {HeaderComponent} from './header/header.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {HomePublicComponent} from './home/home-public.component';
import {HomeComponent} from './home/home.component';
import {StudentLogoComponent} from './home/student-logo.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {NotFoundComponent} from './not-found.component';
import {PostApplyComponent} from './posts/apply/post-apply.component';
import {PostApplyDialogComponent} from './posts/apply/post-apply.dialog';
import {PostEditComponent} from './posts/edit/post-edit.component';
import {PostItemComponent} from './posts/item/post-item.component';
import {PostService} from './posts/post.service';
import {PostViewComponent} from './posts/view/post-view.component';
import {ResourceActionsBoxComponent} from './resource/actions-box/resource-actions-box.component';
import {ResourceBadgeComponent} from './resource/resource-badge.component';
import {ResourceCommentDialogComponent} from './resource/resource-comment.dialog';
import {ResourceUsersResolver} from './resource/resource-users-resolver.service';
import {ResourceUserEditDialogComponent} from './resource/users/resource-user-edit-dialog.component';
import {ResourceUserRoleFormPartComponent} from './resource/users/resource-user-role-form-part.component';
import {ResourceUsersBulkComponent} from './resource/users/resource-users-bulk.component';
import {ResourceUsersComponent} from './resource/users/resource-users.component';
import './rxjs-extensions';
import {DefinitionsLoader, DefinitionsService} from './services/definitions.service';
import {metaFactory} from './services/meta.service';
import {ResourceService} from './services/resource.service';
import {createTranslateLoader} from './services/translate.service';
import {UserService} from './services/user.service';
import {ControlMessagesComponent} from './validation/control-messages.component';
import {ValidationService} from './validation/validation.service';
import {ImageComponent} from './general/image.component';
import {Ng2UiAuthModule} from './authentication/ng2-ui-auth.module';
import {PapaParseModule} from 'ngx-papaparse';
import {ResourceTimelineComponent} from './resource/timeline/resource-timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlMessagesComponent,
    ImageComponent,
    HeaderComponent,
    HeaderActivityComponent,
    FooterComponent,
    AccountComponent,
    AccountNotificationsComponent,
    AuthenticationDialogComponent,
    ResetPasswordDialogComponent,
    NotFoundComponent,
    HomeComponent,
    HomePublicComponent,
    UniLogoComponent,
    EmployerLogoComponent,
    StudentLogoComponent,
    FileUploadComponent,
    DateTimeComponent,
    AuthedComponent,
    UserLookupComponent,
    BoardListComponent,
    ResourceHandleComponent,
    BoardHeaderComponent,
    BoardNewComponent,
    BoardManageComponent,
    BoardViewComponent,
    BoardEditComponent,
    BoardItemComponent,
    DepartmentListComponent,
    DepartmentManageComponent,
    DepartmentViewComponent,
    DepartmentEditComponent,
    DepartmentNewComponent,
    DepartmentHeaderComponent,
    DepartmentRequestMembershipDialogComponent,
    ResourceUsersComponent,
    ResourceUserRoleFormPartComponent,
    ResourceUserEditDialogComponent,
    ResourceUsersBulkComponent,
    ResourceBadgeComponent,
    ResourceTimelineComponent,
    PostEditComponent,
    PostViewComponent,
    PostApplyComponent,
    PostApplyDialogComponent,
    PostItemComponent,
    ResourceActionsBoxComponent,
    ResourceCommentDialogComponent,
    UserImageDialogComponent
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        canActivateChild: [MetaGuard],
        children: [
          {path: '', component: HomeComponent},
          {path: 'home', component: HomeComponent},
          {path: 'boards', component: BoardListComponent},
          {path: 'departments', component: DepartmentListComponent},
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
            component: BoardNewComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'newPost',
            component: PostEditComponent,
            canActivate: [AuthGuard],
            data: {showRegister: true},
            resolve: {
              boards: BoardsResolver
            },
          },
          {
            path: 'account',
            component: AccountComponent,
            canActivate: [AuthGuard],
            resolve: {
              suppressions: AccountSuppressionsResolver
            }
          },
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
                    component: DepartmentViewComponent,
                  },
                  {
                    path: '',
                    component: DepartmentManageComponent,
                    canActivate: [AuthGuard],
                    children: [
                      {
                        path: 'edit',
                        component: DepartmentEditComponent
                      },
                      {
                        path: 'users',
                        component: ResourceUsersComponent,
                        resolve: {
                          users: ResourceUsersResolver
                        }
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
                    component: BoardViewComponent
                  },
                  {
                    path: '',
                    component: BoardManageComponent,
                    canActivate: [AuthGuard],
                    children: [
                      {
                        path: 'edit',
                        component: BoardEditComponent
                      },
                      {
                        path: 'users',
                        component: ResourceUsersComponent,
                        resolve: {
                          users: ResourceUsersResolver
                        }
                      },
                      {
                        path: 'badge',
                        component: ResourceBadgeComponent
                      }
                    ]
                  },
                  {
                    path: ':postId',
                    children: [
                      {
                        path: '',
                        component: PostViewComponent,
                      },
                      {
                        path: 'edit',
                        component: PostEditComponent,
                        canActivate: [AuthGuard]
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
    // PrimeNG modules
    InputTextModule,
    TooltipModule,
    ButtonModule,
    MessagesModule,
    ChipsModule,
    RadioButtonModule,
    TabMenuModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule,
    SplitButtonModule,
    EditorModule,
    DataTableModule,
    SelectButtonModule,
    AutoCompleteModule,
    DialogModule,
    OverlayPanelModule,
    // Material modules
    ToggleButtonModule,
    MdDialogModule,
    MdSnackBarModule,
    MdCardModule,
    FlexLayoutModule,
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDmaVzQjUgftYVHNfTfoSszjaUe8hie8e8',
      libraries: ['places']
    }),
    Ng2UiAuthModule.forRoot(MyAuthConfig),
    PlacesModule,
    MomentModule,
    ShareButtonsModule.forRoot(),
    ClipboardModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: metaFactory
    }),
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
    AuthGuard, ResourceService, DepartmentResolver, BoardResolver, BoardsResolver, ResourceUsersResolver,
    AccountSuppressionsResolver, PostService, UserService, ValidationService
  ],
  entryComponents: [AuthenticationDialogComponent, ResetPasswordDialogComponent, ResourceCommentDialogComponent, UserImageDialogComponent,
    ResourceUserEditDialogComponent, DepartmentRequestMembershipDialogComponent, PostApplyDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}


