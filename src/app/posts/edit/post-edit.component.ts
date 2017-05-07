import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
import * as _ from 'lodash';
import {MdSnackBar} from '@angular/material';
import {DefinitionsService} from '../../services/definitions.service';
import {SelectItem} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';
import {PostService} from '../post.service';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;

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

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private fb: FormBuilder,
              private snackBar: MdSnackBar, private translationService: TranslateService,
              private definitionsService: DefinitionsService, private postService: PostService) {
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
        description: ['', [Validators.required, Validators.maxLength(2000)]],
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
        hideTimestamps: [],
        liveTimestamp: [],
        deadTimestamp: []
      });

      this.postForm.patchValue({hideTimestamps: !this.post});

      if (this.post) {
        const formValue: any = Object.assign({}, this.post);
        formValue.applyType = formValue.applyWebsite ? 'website' :
          (formValue.applyDocument ? 'document' : (formValue.applyEmail ? 'email' : null));
        this.postForm.patchValue(formValue);
      }

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

    this.postForm.get('hideTimestamps').valueChanges.subscribe((hide: boolean) => {
      this.postForm.get('liveTimestamp').setValidators(!hide && [Validators.required]);
      this.postForm.get('deadTimestamp').setValidators(!hide && [Validators.required]);
    });

    this.actionView = this.post ? this.postService.getActionView(this.post) : 'CREATE';
    this.availableActions = this.post ? this.post.actions.map(a => a.action) : [];
  }

  update() {
    this.postService.update(this.post, this.generatePostRequestBody());
  }

  create() {
    this.postService.create(this.board, this.generatePostRequestBody());
  }

  executeAction(action: string, sendForm?: boolean) {
    this.postService.executeAction(this.post, action, sendForm ? this.generatePostRequestBody() : {}, this.board);
  }

  private generatePostRequestBody() {
    const post: PostDTO = _.pick(this.postForm.value,
      ['name', 'description', 'organizationName', 'location', 'existingRelation', 'postCategories', 'memberCategories', 'liveTimestamp']);
    post.applyWebsite = this.postForm.value.applyType === 'website' ? this.postForm.value.applyWebsite : null;
    post.applyDocument = this.postForm.value.applyType === 'document' ? this.postForm.value.applyDocument : null;
    post.applyEmail = this.postForm.value.applyType === 'email' ? this.postForm.value.applyEmail : null;
    if (this.postForm.value.existingRelationExplanation) {
      post.existingRelationExplanation = {text: this.postForm.value.existingRelationExplanation};
    }
    return post;
  }
}
