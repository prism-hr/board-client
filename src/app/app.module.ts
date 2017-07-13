import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {MdCardModule, MdDialogModule, MdSnackBarModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {CloudinaryModule} from '@cloudinary/angular-4.x';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {MomentModule} from 'angular2-moment';
import {RlTagInputModule} from 'angular2-tag-input/dist';
import * as Cloudinary from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {ShareButtonsModule} from 'ngx-sharebuttons';
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
  RadioButtonModule,
  SelectButtonModule, SpinnerModule,
  SplitButtonModule,
  TabMenuModule,
  ToggleButtonModule
} from 'primeng/primeng';
import {AccountComponent} from './account/account.component';
import {AppComponent} from './app.component';
import {MyAuthConfig} from './auth.config';
import {AuthGuard} from './authentication/auth-guard.service';
import {AuthedComponent} from './authentication/authed.component';
import {AuthenticationDialogComponent} from './authentication/authentication.dialog';
import {UserImageDialogComponent} from './authentication/user-image.dialog';
import {BoardHeaderComponent} from './boards/header/board-header.component';
import {BoardListComponent} from './boards/list/board-list.component';
import {BoardManageComponent} from './boards/manage/board-manage.component';
import {BoardResolver} from './boards/manage/board-resolver.service';
import {BoardEditComponent} from './boards/manage/edit/board-edit.component';
import {BoardViewComponent} from './boards/manage/view/board-view.component';
import {BoardNewComponent} from './boards/new/board-new.component';
import {DateTimeComponent} from './controls/datetime.component';
import {ResourceHandleComponent} from './controls/resource-handle.component';
import {XeditableInputComponent} from './controls/xeditable-input.component';
import {DepartmentManageComponent} from './departments/department-manage.component';
import {DepartmentNewComponent} from './departments/department-new.component';
import {DepartmentResolver} from './departments/department-resolver.service';
import {DepartmentEditComponent} from './departments/edit/department-edit.component';
import {DepartmentHeaderComponent} from './departments/header/department-header.component';
import {DepartmentListComponent} from './departments/list/department-list.component';
import {DepartmentViewComponent} from './departments/view/department-view.component';
import {FooterComponent} from './footer/footer.component';
import {FileUploadComponent} from './general/file-upload.component';
import {PlacesModule} from './general/places/places.module';
import {UserLookupComponent} from './general/user-lookup';
import {HeaderComponent} from './header/header.component';
import {EmployerLogoComponent} from './home/employer-logo.component';
import {HomePublicComponent} from './home/home-public.component';
import {HomeComponent} from './home/home.component';
import {StudentLogoComponent} from './home/student-logo.component';
import {UniLogoComponent} from './home/uni-logo.component';
import {NotFoundComponent} from './not-found.component';
import {PostEditComponent} from './posts/edit/post-edit.component';
import {PostItemComponent} from './posts/item/post-item.component';
import {PostResolver} from './posts/post-resolver.service';
import {PostService} from './posts/post.service';
import {PostViewComponent} from './posts/view/post-view.component';
import {ResourceActionsBoxComponent} from './resource/actions-box/resource-actions-box.component';
import {ResourceCommentDialogComponent} from './resource/resource-comment.dialog';
import {ResourceUsersResolver} from './resource/resource-users-resolver.service';
import {ResourceUserEditDialogComponent} from './resource/users/resource-user-edit-dialog.component';
import {ResourceUserRoleFormPartComponent} from './resource/users/resource-user-role-form-part.component';
import {ResourceUsersBulkComponent} from './resource/users/resource-users-bulk.component';
import {ResourceUsersComponent} from './resource/users/resource-users.component';
import './rxjs-extensions';
import {DefinitionsLoader, DefinitionsService} from './services/definitions.service';
import {FileUploadService} from './services/file-upload.service';
import {ResourceService} from './services/resource.service';
import {createTranslateLoader} from './services/translate.service';
import {UserService} from './services/user.service';
import {ControlMessagesComponent} from './validation/control-messages.component';
import {ResourceBadgeComponent} from './resource/resource-badge.component';

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
    UserLookupComponent,
    BoardListComponent,
    ResourceHandleComponent,
    BoardHeaderComponent,
    BoardNewComponent,
    BoardManageComponent,
    BoardViewComponent,
    BoardEditComponent,
    DepartmentListComponent,
    DepartmentManageComponent,
    DepartmentViewComponent,
    DepartmentEditComponent,
    DepartmentNewComponent,
    DepartmentHeaderComponent,
    ResourceUsersComponent,
    ResourceUserRoleFormPartComponent,
    ResourceUserEditDialogComponent,
    ResourceUsersBulkComponent,
    ResourceBadgeComponent,
    PostEditComponent,
    PostViewComponent,
    PostItemComponent,
    ResourceActionsBoxComponent,
    ResourceCommentDialogComponent,
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
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard]
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
                component: DepartmentViewComponent
              },
              {
                path: '',
                component: DepartmentManageComponent,
                children: [
                  {
                    path: 'edit',
                    component: DepartmentEditComponent
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
                children: [
                  {
                    path: 'edit',
                    component: BoardEditComponent
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
                path: 'newPost',
                component: PostEditComponent,
                canActivate: [AuthGuard],
                data: {showRegister: true}
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
    InputMaskModule,
    SplitButtonModule,
    EditorModule,
    DataTableModule,
    SelectButtonModule,
    AutoCompleteModule,
    DialogModule,
    SpinnerModule,
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
  entryComponents: [AuthenticationDialogComponent, ResourceCommentDialogComponent, UserImageDialogComponent,
    ResourceUserEditDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}


