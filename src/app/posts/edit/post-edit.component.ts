import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {get, pick, upperFirst} from 'lodash';
import {SelectItem} from 'primeng/components/common/selectitem';
import {combineLatest, of} from 'rxjs';
import {first} from 'rxjs/operators';
import {ResourceCommentDialogComponent} from '../../resource/resource-comment.dialog';
import {RollbarService} from '../../rollbar/rollbar.service';
import {DefinitionsService} from '../../services/definitions.service';
import {ExternalApisService} from '../../services/external-apis.service';
import {ResourceActionView, ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import {Utils} from '../../services/utils';
import {ValidationUtils} from '../../validation/validation.utils';
import {PostService} from '../post.service';
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import MemberCategory = b.MemberCategory;
import PostPatchDTO = b.PostPatchDTO;
import PostRepresentation = b.PostRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  departmentOptions: SelectItem[];
  boardOptions: SelectItem[];
  post: PostRepresentation;
  department: BoardRepresentation;
  postForm: FormGroup;
  definitions: { [key: string]: any };
  showExistingRelation: boolean;
  actionView: ResourceActionView;
  availableActions: Action[];
  organizationSuggestions: string[];
  availablePostCategories: string[];
  availableMemberCategories: MemberCategory[];
  formProperties = ['name', 'summary', 'description', 'organization', 'location', 'existingRelation',
    'liveTimestamp', 'deadTimestamp', 'applyWebsite', 'applyDocument', 'applyEmail', 'postCategories', 'memberCategories'];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cdf: ChangeDetectorRef,
              private rollbar: RollbarService, private title: Title, private dialog: MatDialog,
              private definitionsService: DefinitionsService, private postService: PostService, private resourceService: ResourceService,
              private externalApisService: ExternalApisService, private userService: UserService) {
    this.definitions = definitionsService.getDefinitions();
  }

  get postCategories(): FormArray {
    return this.postForm.get('postCategories') as FormArray;
  };

  get memberCategories(): FormArray {
    return this.postForm.get('memberCategories') as FormArray;
  };

  ngOnInit() {
    this.postForm = this.fb.group({
      department: [],
      board: [],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      description: [''],
      organization: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      location: [null, Validators.required],
      existingRelation: [],
      existingRelationExplanation: [],
      postCategories: [],
      memberCategories: [],
      applyType: [null, Validators.required],
      applyWebsite: [null, Validators.maxLength(255)],
      applyDocument: [],
      applyEmail: [null, Validators.maxLength(254)],
      hideLiveTimestamp: [],
      liveTimestamp: [],
      hideDeadTimestamp: [],
      deadTimestamp: []
    });

    combineLatest(this.route.data, this.userService.user$.pipe(first()), this.userService.departments$.pipe(first()))
      .subscribe(([data, user, departments]: [Data, UserRepresentation, DepartmentRepresentation[]]) => {
        this.department = data['department'];

        this.departmentOptions = departments
          .map(b => ({label: b.name, value: b}));

        let postObservable = of<PostRepresentation>(null);
        if (data['post']) {
          const postId = (<PostRepresentation>data['post']).id;
          postObservable = this.resourceService.getResource('POST', postId).pipe(first());
        }

        postObservable.subscribe(post => {
          this.post = post;
          if (post) {
            this.title.setTitle(this.post.name + ' - Edit');
          } else {
            this.title.setTitle('New post');
          }

          if (post) {
            this.postForm.get('board').setValue(post.board);
            const department = post.board.department;
            this.setupMemberCategories(department);
            this.setupBoards(department);
          } else {
            this.postForm.get('department').setValidators(Validators.required);
            if (this.department) {
              this.postForm.get('department').setValue(this.department);
            } else if (this.departmentOptions.length === 1) {
              this.postForm.get('department').setValue(this.departmentOptions[0].value);
            }
          }

          if (post) {
            const formValue: any = pick(post, this.formProperties);
            formValue.applyType = formValue.applyWebsite ? 'website' :
              (formValue.applyDocument ? 'document' : (formValue.applyEmail ? 'email' : null));
            formValue.hideLiveTimestamp = !formValue.liveTimestamp;
            formValue.hideDeadTimestamp = !formValue.deadTimestamp;
            this.postForm.patchValue(formValue);
          } else {
            const deadTimestamp = new Date();
            deadTimestamp.setHours(17);
            deadTimestamp.setMinutes(0 - deadTimestamp.getTimezoneOffset());
            deadTimestamp.setDate(deadTimestamp.getDate() + 28);
            this.postForm.patchValue({
              hideLiveTimestamp: true,
              deadTimestamp: deadTimestamp.toISOString(),
              organization: user.defaultOrganization,
              location: user.defaultLocation
            });
          }

          this.configureTimestampControl('liveTimestamp');
          this.configureTimestampControl('deadTimestamp');

          this.actionView = this.post ? this.resourceService.getActionView(this.post) : 'CREATE';
          this.availableActions = this.post ? this.post.actions.map(a => a.action) : [];

          this.postForm.get('existingRelation').valueChanges.subscribe((existingRelation: string) => {
            this.postForm.patchValue({existingRelationExplanation: null});
            this.postForm.get('existingRelationExplanation')
              .setValidators(existingRelation === 'OTHER' && [Validators.required, Validators.maxLength(1000)]);
          });

          this.postForm.get('applyType').valueChanges.subscribe((applyType: string) => {
            this.postForm.get('applyWebsite').setValidators(applyType === 'website' && [Validators.required, ValidationUtils.urlValidator]);
            this.postForm.get('applyDocument').setValidators(applyType === 'document' && Validators.required);
            this.postForm.get('applyEmail').setValidators(applyType === 'email' && [Validators.required, ValidationUtils.emailValidator]);
            this.postForm.get('applyWebsite').updateValueAndValidity();
            this.postForm.get('applyDocument').updateValueAndValidity();
            this.postForm.get('applyEmail').updateValueAndValidity();
          });

          this.postForm.get('hideLiveTimestamp').valueChanges.subscribe(hide => {
            const liveTimestamp = new Date();
            liveTimestamp.setHours(9);
            liveTimestamp.setMinutes(0 - liveTimestamp.getTimezoneOffset());
            liveTimestamp.setDate(liveTimestamp.getDate() + 1);
            const patchValue = hide ? null : liveTimestamp.toISOString();
            this.postForm.patchValue({liveTimestamp: patchValue});
            this.configureTimestampControl('liveTimestamp');
          });

          this.postForm.get('hideDeadTimestamp').valueChanges.subscribe(hide => {
            // this.setDefaultDeadTimestamp();
            this.configureTimestampControl('deadTimestamp');
          });

          this.postForm.get('liveTimestamp').valueChanges.subscribe(hide => {
            this.setDefaultDeadTimestamp();
          });

          this.boardChanged();

          this.cdf.detectChanges();
        });
      });
  }

  update() {
    this.postForm['submitted'] = true;
    if (this.postForm.invalid) {
      this.rollbar.warn('Post update validation error: ' + Utils.getFormErrors(this.postForm));
      return;
    }
    this.postService.update(this.post, this.generatePostRequestBody())
      .subscribe(post => {
        return this.router.navigate(this.resourceService.routerLink(post));
      });
  }

  create() {
    this.postForm['submitted'] = true;
    if (this.postForm.invalid) {
      this.rollbar.warn('Post create validation error: ' + Utils.getFormErrors(this.postForm));
      return;
    }
    this.postService.create(this.postForm.get('board').value, this.generatePostRequestBody())
      .subscribe(post => {
        return this.router.navigate(this.resourceService.routerLink(post));
      });
  }

  executeAction(action: Action, sendForm?: boolean) {
    this.postForm['submitted'] = true;
    if (this.postForm.invalid) {
      this.rollbar.warn('Post action validation error: ' + Utils.getFormErrors(this.postForm));
      return;
    }
    const dialogRef = this.dialog.open(ResourceCommentDialogComponent, {data: {action, resource: this.post}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const requestBody = sendForm ? this.generatePostRequestBody() : {};
        requestBody.comment = result.comment;
        this.resourceService.executeAction(this.post, action, requestBody)
          .subscribe(() => {
            return this.router.navigate(this.resourceService.routerLink(this.post));
          });
      }
    });
  }

  departmentChanged() {
    this.boardOptions = [];
    this.postForm.get('board').setValue(null);
    const department: DepartmentRepresentation = this.postForm.get('department').value;

    this.setupMemberCategories(department);
    this.setupBoards(department);
  }

  boardChanged() {
    const board = this.postForm.get('board').value;

    this.setupPostCategories(board);

    // initialize existing relation
    const extendAction = board && board.actions && board.actions
      .find(a => (a.action as any as string) === 'EXTEND' && a.scope === 'POST');
    const creatingNewPostAsUntrustedPerson = !this.post && extendAction && extendAction.state === 'DRAFT';
    this.showExistingRelation = creatingNewPostAsUntrustedPerson || !!get(this.post, 'existingRelation');
    this.postForm.get('existingRelation').setValue(this.post && this.post.existingRelation);
    this.postForm.get('existingRelationExplanation').setValue(
      this.post && this.post.existingRelationExplanation && this.post.existingRelationExplanation.text);
    this.postForm.get('existingRelation').setValidators(this.showExistingRelation && Validators.required);
  }

  searchOrganizations(event) {
    this.postService.lookupOrganizations(event.query).subscribe((organizations: string[]) => {
      this.organizationSuggestions = organizations;
    })
  }

  cancelLink() {
    if (this.post) {
      return this.resourceService.routerLink(this.post);
    } else if (this.department) {
      return this.resourceService.routerLink(this.department);
    }
    return ['/'];
  }

  private setupMemberCategories(department: b.DepartmentRepresentation) {
    this.availableMemberCategories = department && department.memberCategories.length > 0 ? department.memberCategories : [];
    const selectedMemberCategories = this.post ? this.post.memberCategories : [];
    this.postForm.get('memberCategories').setValidators(this.availableMemberCategories.length > 0 && Validators.required);
    this.postForm.get('memberCategories').setValue(selectedMemberCategories);
  }

  private setupPostCategories(board) {
    this.availablePostCategories = board && board.postCategories.length > 0 ? board.postCategories : [];
    const selectedPostCategories = this.post ? this.post.postCategories : [];
    this.postForm.get('postCategories').setValidators(this.availablePostCategories.length > 0 && Validators.required);
    this.postForm.get('postCategories').setValue(selectedPostCategories);
  }

  private setupBoards(department: b.DepartmentRepresentation) {
    this.resourceService.getResources('BOARD', {parentId: department.id})
      .subscribe(boards => {
        this.boardOptions = boards
          .map(b => ({label: b.name, value: b}));
        if (this.boardOptions.length === 1) {
          this.postForm.get('board').setValue(this.boardOptions[0].value);
          this.boardChanged();
        }
      });
  }

  private setDefaultDeadTimestamp() {
    const hideDeadTimestamp = this.postForm.get('hideDeadTimestamp').value;
    if (hideDeadTimestamp) {
      this.postForm.patchValue({deadTimestamp: null});
    }
    const isTouched = this.postForm.get('deadTimestamp').touched;
    if (!isTouched || !this.postForm.get('deadTimestamp').value) { // set default value only if not touched or not specified
      const liveTimestampString = this.postForm.get('liveTimestamp').value;
      const liveTimestamp = liveTimestampString ? new Date(liveTimestampString) : new Date();
      liveTimestamp.setHours(17);
      liveTimestamp.setMinutes(0 - liveTimestamp.getTimezoneOffset());
      liveTimestamp.setDate(liveTimestamp.getDate() + 28);
      const patchValue = liveTimestamp.toISOString();
      this.postForm.patchValue({deadTimestamp: patchValue});
    }
  }

  private generatePostRequestBody(): PostPatchDTO {
    const post: PostPatchDTO = pick(this.postForm.value, this.formProperties);
    post.applyWebsite = this.postForm.value.applyType === 'website' ? this.postForm.value.applyWebsite : null;
    post.applyDocument = this.postForm.value.applyType === 'document' ? this.postForm.value.applyDocument : null;
    post.applyEmail = this.postForm.value.applyType === 'email' ? this.postForm.value.applyEmail : null;
    if (this.postForm.value.existingRelationExplanation) {
      post.existingRelationExplanation = {text: this.postForm.value.existingRelationExplanation};
    }
    post.liveTimestamp = post.liveTimestamp || null;
    post.deadTimestamp = post.deadTimestamp || null;
    return post;
  }

  private configureTimestampControl(controlName: string) {
    const control = this.postForm.get(controlName);
    const hide = this.postForm.get('hide' + upperFirst(controlName)).value;
    control.setValidators(!hide && [Validators.required]);
    if (hide) {
      control.disable();
    } else {
      control.enable();
    }
  }
}
