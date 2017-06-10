import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AuthenticationDialogComponent} from './authentication/authentication.dialog';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found.component';
import {RouterModule} from '@angular/router';
import {MdCardModule, MdDialogModule, MdSnackBarModule} from '@angular/material';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AuthedComponent} from './authentication/authed.component';
import {AuthGuard} from './authentication/auth-guard.service';
import {FileUploadComponent} from './general/file-upload.component';
import {ResourceService} from './services/resource.service';
import {BoardManageComponent} from './boards/manage/board-manage.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {StudentLogoComponent} from './home/student-logo.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CloudinaryModule} from '@cloudinary/angular-4.x';
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
import {ResourceHandleComponent} from './controls/resource-handle.component';
import {ControlMessagesComponent} from './validation/control-messages.component';
import {PostEditComponent} from './posts/edit/post-edit.component';
import {PostViewComponent} from './posts/view/post-view.component';
import {PostResolver} from './posts/post-resolver.service';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {PlacesModule} from './general/places/places.module';
import {AccountComponent} from './account/account.component';
import {ResourceUsersComponent} from './resource/users/resource-users.component';
import {DepartmentManageComponent} from './departments/department-manage.component';
import {
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  ChipsModule,
  DataTableModule,
  DropdownModule,
  EditorModule,
  InputTextModule,
  MessagesModule,
  RadioButtonModule,
  SplitButtonModule,
  TabMenuModule, ToggleButtonModule
} from 'primeng/primeng';
import {PostService} from './posts/post.service';
import {XeditableInputComponent} from './controls/xeditable-input.component';
import {DateTimeComponent} from './controls/datetime.component';
import {BoardListComponent} from './boards/list/board-list.component';
import {BoardHeaderComponent} from './boards/header/board-header.component';
import {DepartmentListComponent} from './departments/list/department-list.component';
import {PostItemComponent} from './posts/item/post-item.component';
import {PostActionsBoxComponent} from './posts/actions-box/post-actions-box.component';
import {PostCommentDialogComponent} from './posts/post-comment.dialog';
import {MomentModule} from 'angular2-moment';
import {UserService} from './services/user.service';
import {UserImageDialogComponent} from './authentication/user-image.dialog';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {ResourceUsersResolver} from './resource/resource-users-resolver.service';
import {ResourceUsersBulkComponent} from './resource/users/resource-users-bulk.component';
import {FileUploadService} from './services/file-upload.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {MyAuthConfig} from './auth.config';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {ResourceUserEditDialogComponent} from './resource/users/resource-user-edit-dialog.component';
import {ResourceUserRoleFormPartComponent} from './resource/users/resource-user-role-form-part.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlMessagesComponent,
    HeaderComponent,
    FooterComponent,
    AccountComponent,
    AuthenticationDialogComponent,
    NotFoundComponent,
    HomeComponent,
    HomePublicComponent,
    UniLogoComponent,
    EmployerLogoComponent,
    StudentLogoComponent,
    FileUploadComponent,
    DateTimeComponent,
    XeditableInputComponent,
    AuthedComponent,
    BoardListComponent,
    ResourceHandleComponent,
    BoardHeaderComponent,
    BoardNewComponent,
    BoardManageComponent,
    BoardViewComponent,
    BoardSettingsComponent,
    DepartmentListComponent,
    DepartmentManageComponent,
    DepartmentViewComponent,
    ResourceUsersComponent,
    ResourceUserRoleFormPartComponent,
    ResourceUserEditDialogComponent,
    ResourceUsersBulkComponent,
    PostEditComponent,
    PostViewComponent,
    PostItemComponent,
    PostActionsBoxComponent,
    PostCommentDialogComponent,
    UserImageDialogComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'boards', component: BoardListComponent},
      {path: 'departments', component: DepartmentListComponent},
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
            data: {
              resourceScope: 'department'
            },
            resolve: {
              department: DepartmentResolver,
            },
            children: [
              {
                path: '',
                component: DepartmentViewComponent
              },
              {
                path: 'users',
                component: ResourceUsersComponent,
                canActivate: [AuthGuard],
                resolve: {
                  users: ResourceUsersResolver
                }
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
                component: PostEditComponent,
                canActivate: [AuthGuard]
              },
              {
                path: ':postId',
                resolve: {
                  post: PostResolver
                },
                children: [
                  {
                    path: '',
                    component: PostViewComponent,
                  },
                  {
                    path: 'settings',
                    component: PostEditComponent,
                    canActivate: [AuthGuard]
                  }
                ]
              }
            ]
          }
        ]
      },
      {path: '**', component: NotFoundComponent}
    ]),
    // PrimeNG modules
    InputTextModule,
    ButtonModule,
    MessagesModule,
    ChipsModule,
    RadioButtonModule,
    TabMenuModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    SplitButtonModule,
    EditorModule,
    DataTableModule,
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
    Ng2UiAuthModule.forRoot(MyAuthConfig),
    PlacesModule,
    MomentModule,
    ShareButtonsModule.forRoot(),
    ClipboardModule
  ],
  providers: [
    DefinitionsService,
    {
      provide: APP_INITIALIZER,
      useFactory: DefinitionsLoader,
      deps: [DefinitionsService],
      multi: true
    },
    AuthGuard, ResourceService, DepartmentResolver, BoardResolver, PostResolver, ResourceUsersResolver, PostService, UserService,
    FileUploadService
  ],
  entryComponents: [AuthenticationDialogComponent, PostCommentDialogComponent, UserImageDialogComponent, ResourceUserEditDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}


