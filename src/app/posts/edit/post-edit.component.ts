import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ResourceCommentDialogComponent} from '../../resource/resource-comment.dialog';
import {CheckboxUtils} from '../../services/checkbox.utils';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceActionView, ResourceService} from '../../services/resource.service';
import {ValidationUtils} from '../../validation/validation.utils';
import {PostService} from '../post.service';
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;
import MemberCategory = b.MemberCategory;
import PostPatchDTO = b.PostPatchDTO;
import PostRepresentation = b.PostRepresentation;

@Component({
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {

  boardOptions: any[];
  post: PostRepresentation;
  board: BoardRepresentation;
  postForm: FormGroup;
  definitions: { [key: string]: any };
  showExistingRelation: boolean;
  actionView: ResourceActionView;
  availableActions: Action[];
  organizationSuggestions: string[];
  availablePostCategories: string[];
  availableMemberCategories: MemberCategory[];
  paramsSubscription: Subscription;
  formProperties = ['name', 'summary', 'description', 'organizationName', 'location', 'existingRelation',
    'liveTimestamp', 'deadTimestamp', 'applyWebsite', 'applyDocument', 'applyEmail'];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cdf: ChangeDetectorRef,
              private dialog: MdDialog, private definitionsService: DefinitionsService, private postService: PostService,
              private resourceService: ResourceService) {
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
      board: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      description: [''],
      organizationName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      location: [null, Validators.required],
      existingRelation: [],
      existingRelationExplanation: [],
      postCategories: this.fb.array([]),
      memberCategories: this.fb.array([]),
      applyType: [null, Validators.required],
      applyWebsite: [null, Validators.maxLength(255)],
      applyDocument: [],
      applyEmail: [null, Validators.maxLength(254)],
      hideLiveTimestamp: [],
      liveTimestamp: [],
      hideDeadTimestamp: [],
      deadTimestamp: []
    });

    this.route.parent.data.flatMap(parentData => {
      if (parentData['board']) {
        this.board = parentData['board'];
      }
      return this.route.data;
    }).subscribe(data => {
      if (data['boards']) {
        this.boardOptions = data['boards'].map(b => ({label: b.name, value: b}));
      }
      this.paramsSubscription = this.route.parent.paramMap
        .flatMap(params => {
          const postObservable = params.get('postId') ? this.resourceService.getResource('POST', +params.get('postId')) : Observable.of(null);
          return postObservable.map(post => [post, params]);
        })
        .subscribe(([post, params]: [PostRepresentation, ParamMap]) => {
          this.post = post;
          if (!this.board && params.get('boardId')) {
            this.board = this.boardOptions.find(o => o.value.id === +params.get('boardId')).value;
          }

          this.postForm.get('board').setValue(this.board);

          if (this.post) {
            const formValue: any = _.pick(this.post, this.formProperties);
            formValue.applyType = formValue.applyWebsite ? 'website' :
              (formValue.applyDocument ? 'document' : (formValue.applyEmail ? 'email' : null));
            formValue.hideLiveTimestamp = !formValue.liveTimestamp;
            formValue.hideDeadTimestamp = !formValue.deadTimestamp;
            this.postForm.patchValue(formValue);
          } else {
            this.postForm.patchValue({hideLiveTimestamp: true, deadTimestamp: moment().add(1, 'month').hours(0).minutes(0).toISOString()});
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

          this.postForm.get('hideLiveTimestamp').valueChanges.subscribe(() => {
            this.postForm.patchValue({liveTimestamp: null});
            this.configureTimestampControl('liveTimestamp');
          });

          this.postForm.get('hideDeadTimestamp').valueChanges.subscribe(() => {
            this.postForm.patchValue({deadTimestamp: null});
            this.configureTimestampControl('deadTimestamp');
          });

          this.boardChanged();

          this.cdf.detectChanges();
        });
    });

  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  update() {
    this.postForm['submitted'] = true;
    if (this.postForm.invalid) {
      return;
    }
    this.postService.update(this.post, this.generatePostRequestBody())
      .subscribe(() => {
        return this.router.navigate(this.resourceService.routerLink(this.post));
      });
  }

  create() {
    this.postForm['submitted'] = true;
    if (this.postForm.invalid) {
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

  boardChanged() {
    const board = this.postForm.get('board').value;
    this.availablePostCategories = board && board.postCategories.length > 0 ? board.postCategories : [];
    const selectedPostCategories = this.post ? this.post.postCategories : [];
    this.postForm.setControl('postCategories', this.fb.array(
      this.availablePostCategories.map(c => [selectedPostCategories.includes(c)])));
    if (this.availablePostCategories) {
      this.postForm.get('postCategories').setValidators(this.availablePostCategories.length > 0 && ValidationUtils.checkboxArrayMin(1));
    }

    this.availableMemberCategories = board && board.department.memberCategories.length > 0 ? board.department.memberCategories : [];
    const selectedMemberCategories = this.post ? this.post.memberCategories : [];
    this.postForm.setControl('memberCategories', this.fb.array(
      this.availableMemberCategories.map(c => [selectedMemberCategories.includes(c)])));
    if (this.availableMemberCategories) {
      this.postForm.get('memberCategories').setValidators(this.availableMemberCategories.length > 0 && ValidationUtils.checkboxArrayMin(1));
    }

    // initialize existing relation
    const extendAction = board && board.actions
      .find(a => (a.action as any as string) === 'EXTEND' && a.scope === 'POST');
    const creatingNewPostAsUntrustedPerson = !this.post && extendAction && extendAction.state === 'DRAFT';
    this.showExistingRelation = creatingNewPostAsUntrustedPerson || !!_.get(this.post, 'existingRelation');
    this.postForm.get('existingRelation').setValue(this.post && this.post.existingRelation);
    this.postForm.get('existingRelationExplanation').setValue(this.post && this.post.existingRelationExplanation);
    this.postForm.get('existingRelation').setValidators(this.showExistingRelation && Validators.required);
  }

  searchOrganizations(event) {
    this.resourceService.lookupOrganizations(event.query).subscribe((organizations: string[]) => {
      this.organizationSuggestions = organizations;
    })
  }

  cancelLink() {
    if (this.post) {
      return this.resourceService.routerLink(this.post);
    } else if (this.board) {
      return this.resourceService.routerLink(this.board);
    }
    return ['/'];
  }

  private generatePostRequestBody(): PostPatchDTO {
    const post: PostPatchDTO = _.pick(this.postForm.value, this.formProperties);
    post.postCategories = CheckboxUtils
      .fromFormFormat(this.availablePostCategories, this.postForm.get('postCategories').value);
    post.memberCategories = CheckboxUtils
      .fromFormFormat(this.availableMemberCategories, this.postForm.get('memberCategories').value);
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
    const hide = this.postForm.value['hide' + _.upperFirst(controlName)];
    control.setValidators(!hide && [Validators.required]);
    if (hide) {
      control.disable();
    } else {
      control.enable();
    }
  }
}
