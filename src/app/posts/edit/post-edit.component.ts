import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
import * as _ from 'lodash';
import {MdDialog} from '@angular/material';
import {DefinitionsService} from '../../services/definitions.service';
import {SelectItem} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';
import {PostService} from '../post.service';
import {PostCommentDialogComponent} from '../post-comment.dialog';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;
import PostPatchDTO = b.PostPatchDTO;

@Component({
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  board: BoardRepresentation;
  post: PostRepresentation;
  postForm: FormGroup;
  relations: SelectItem[];
  showExistingRelation: boolean;
  actionView: string;
  availableActions: Action[];
  formProperties = ['name', 'summary', 'description', 'organizationName', 'location', 'existingRelation', 'postCategories', 'memberCategories',
    'liveTimestamp', 'deadTimestamp'];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private dialog: MdDialog,
              private translationService: TranslateService, private definitionsService: DefinitionsService,
              private postService: PostService) {
    const definitions = definitionsService.getDefinitions();
    translationService.get('definitions.existingRelation')
      .subscribe(relationTranslations => {
        this.relations = (definitions['existingRelation'] as string[]).map(relation => {
          return {label: relationTranslations[relation].name, value: relation};
        });
      });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['board']) {
        this.board = data['board'];
      }
      if (data['post']) {
        this.post = data['post'];
      }

      this.postForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        summary: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
        organizationName: ['', [Validators.required, Validators.maxLength(255)]],
        location: [null, Validators.required],
        existingRelation: [],
        existingRelationExplanation: [],
        postCategories: [[]],
        memberCategories: [[]],
        applyType: [null, Validators.required],
        applyWebsite: [null, Validators.maxLength(255)],
        applyDocument: [],
        applyEmail: [null, Validators.maxLength(254)],
        hideLiveTimestamp: [],
        liveTimestamp: [],
        hideDeadTimestamp: [],
        deadTimestamp: []
      });
      if (this.post) {
        this.postForm.addControl('description', new FormControl());
      }

      this.postForm.patchValue({hideTimestamps: !this.post});

      if (this.post) {
        const formValue: any = Object.assign({}, this.post);
        formValue.applyType = formValue.applyWebsite ? 'website' :
          (formValue.applyDocument ? 'document' : (formValue.applyEmail ? 'email' : null));
        formValue.hideLiveTimestamp = !formValue.liveTimestamp;
        formValue.hideDeadTimestamp = !formValue.deadTimestamp;
        this.postForm.patchValue(formValue);
      } else {
        this.postForm.patchValue({hideLiveTimestamp: true});
      }
      this.configureTimestampControl('liveTimestamp');
      this.configureTimestampControl('deadTimestamp');

      // initialize existing relation
      const extendAction = this.board.actions.find(a => (a.action as any as string) === 'EXTEND' && (a.scope as any as string) === 'POST');
      const creatingNewPostAsUntrustedPerson = !this.post && (extendAction.state as any as string) === 'DRAFT';
      if (creatingNewPostAsUntrustedPerson || _.get(this.post, 'existingRelation')) {
        this.showExistingRelation = true;
        if (this.post.existingRelationExplanation) {
          this.postForm.patchValue({existingRelationExplanation: this.post.existingRelationExplanation['text']});
        }
        this.postForm.get('existingRelation').setValidators([Validators.required]);
      }
    });

    this.postForm.get('existingRelation').valueChanges.subscribe((existingRelation: string) => {
      this.postForm.patchValue({existingRelationExplanation: null});
      this.postForm.get('existingRelationExplanation')
        .setValidators(existingRelation === 'OTHER' && [Validators.required, Validators.maxLength(1000)]);
    });

    this.postForm.get('applyType').valueChanges.subscribe((applyType: string) => {
      this.postForm.get('applyWebsite').setValidators(applyType === 'website' && [Validators.required, Validators.maxLength(255)]);
      this.postForm.get('applyDocument').setValidators(applyType === 'document' && Validators.required);
      this.postForm.get('applyEmail').setValidators(applyType === 'email' && [Validators.required, ValidationService.emailValidator]);
      this.postForm.get('applyWebsite').updateValueAndValidity();
      this.postForm.get('applyDocument').updateValueAndValidity();
      this.postForm.get('applyEmail').updateValueAndValidity();
    });

    this.postForm.get('hideLiveTimestamp').valueChanges.subscribe((hide: boolean) => {
      this.postForm.patchValue({liveTimestamp: null});
      this.configureTimestampControl('liveTimestamp');
    });

    this.postForm.get('hideDeadTimestamp').valueChanges.subscribe((hide: boolean) => {
      this.postForm.patchValue({deadTimestamp: null});
      this.configureTimestampControl('deadTimestamp');
    });

    this.actionView = this.post ? this.postService.getActionView(this.post) : 'CREATE';
    this.availableActions = this.post ? this.post.actions.map(a => a.action) : [];
  }

  update() {
    this.postService.update(this.post, this.generatePostRequestBody())
      .subscribe(() => {
        Object.assign(this.post, _.pick(this.postForm.value, this.formProperties));
        this.router.navigate([this.board.department.handle, this.board.handle, this.post.id]);
      });
  }

  create() {
    this.postService.create(this.board, this.generatePostRequestBody())
      .subscribe(() => {
        this.router.navigate([this.board.department.handle, this.board.handle]);
      });
  }

  executeAction(action: string, sendForm?: boolean) {
    const dialogRef = this.dialog.open(PostCommentDialogComponent);
    dialogRef.afterClosed().subscribe(comment => {
      if (comment) {
        const requestBody = sendForm ? this.generatePostRequestBody() : {};
        requestBody.comment = comment;
        this.postService.executeAction(this.post, action, requestBody)
          .subscribe(() => {
            this.router.navigate([this.board.department.handle, this.board.handle]);
          });
      }
    });
  }

  private generatePostRequestBody() {
    const post: PostPatchDTO = _.pick(this.postForm.value, this.formProperties);
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
