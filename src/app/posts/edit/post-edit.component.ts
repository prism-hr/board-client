import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, ParamMap, Router} from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
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
export class PostEditComponent implements OnInit {

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
  formProperties = ['name', 'summary', 'description', 'organizationName', 'location', 'existingRelation',
    'liveTimestamp', 'deadTimestamp', 'applyWebsite', 'applyDocument', 'applyEmail'];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cdf: ChangeDetectorRef,
              private title: Title, private dialog: MdDialog, private definitionsService: DefinitionsService,
              private postService: PostService, private resourceService: ResourceService) {
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

    combineLatest(this.route.parent.data, this.route.data, this.route.paramMap)
      .subscribe(([parentData, data, params]: [Data, Data, ParamMap]) => {
        this.board = parentData['board'];
        this.boardOptions = data['boards'] && data['boards'].map(b => ({label: b.name, value: b}));
        if (!this.board && params.get('boardId')) {
          this.board = this.boardOptions.find(o => o.value.id === +params.get('boardId')).value;
        }

        let postObservable = Observable.of<PostRepresentation>(null);
        if (parentData['post']) {
          const postId = (<PostRepresentation>parentData['post']).id;
          postObservable = this.resourceService.getResource('POST', postId).first();
        }

        postObservable.subscribe(post => {
          this.post = post;
          if(post) {
            this.title.setTitle(this.post.name + ' - Edit');
          } else {
            this.title.setTitle('New post');
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
            this.postForm.patchValue({
              hideLiveTimestamp: true,
              deadTimestamp: moment().add(20, 'day').hours(17).minutes(0).toISOString()
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
            const patchValue = hide ? null : moment().hours(9).minutes(0).toISOString();
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

  private setDefaultDeadTimestamp() {
    const hideDeadTimestamp = this.postForm.get('hideDeadTimestamp').value;
    if (hideDeadTimestamp) {
      this.postForm.patchValue({deadTimestamp: null});
    }
    const isTouched = this.postForm.get('deadTimestamp').touched;
    if (!isTouched || !this.postForm.get('deadTimestamp').value) { // set default value only if not touched or not specified
      const liveTimestampString = this.postForm.get('liveTimestamp').value;
      const liveTimestamp = liveTimestampString ? moment(liveTimestampString) : moment();
      const patchValue = liveTimestamp.add(20, 'day').hours(17).minutes(0).toISOString();
      this.postForm.patchValue({deadTimestamp: patchValue});
    }
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
    const hide = this.postForm.get('hide' + _.upperFirst(controlName)).value;
    control.setValidators(!hide && [Validators.required]);
    if (hide) {
      control.disable();
    } else {
      control.enable();
    }
  }
}
