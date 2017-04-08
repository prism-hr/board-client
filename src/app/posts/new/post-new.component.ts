import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
import * as _ from 'lodash';
import {MdSnackBar} from '@angular/material';
import {DefinitionsService} from '../../services/definitions.service';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import PostRepresentation = b.PostRepresentation;

@Component({
  templateUrl: 'post-new.component.html',
  styleUrls: ['post-new.component.scss']
})
export class PostNewComponent implements OnInit {
  definitions: { [key: string]: any };
  board: BoardRepresentation;
  post: PostRepresentation;
  postForm: FormGroup;
  showExistingRelation: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private fb: FormBuilder,
              private snackBar: MdSnackBar, private definitionsService: DefinitionsService) {
    this.definitions = definitionsService.getDefinitions();
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['board']) {
        this.board = data['board'];
      }
      if (data['post']) {
        this.post = data['post'];
      }

      const existingPostCategories = this.post ? this.post.postCategories : [];
      const existingMemberCategories = this.post ? this.post.memberCategories : [];

      this.postForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
        description: ['', [Validators.required, Validators.maxLength(2000)]],
        organizationName: ['', [Validators.required, Validators.maxLength(255)]],
        location: [null, Validators.required],
        existingRelation: [],
        postCategoriesMap: this.fb.array(this.board.postCategories.map(c => this.fb.control(existingPostCategories.includes(c)))),
        memberCategoriesMap: this.fb.array(this.board.department.memberCategories.map(c => this.fb.control(existingMemberCategories.includes(c)))),
        applyType: [null, Validators.required],
        applyWebsite: [null, Validators.maxLength(255)],
        applyDocument: [],
        applyEmail: [null, Validators.maxLength(254)]
      });

      if (this.post) {
        const formValue: any = Object.assign({}, this.post);
        formValue.applyType = formValue.applyWebsite ? 'website' : (formValue.applyDocument ? 'document' : (formValue.applyEmail ? 'email' : null));
        this.postForm.patchValue(formValue);
      }

      if (_.intersection(this.board.actions as any as string[], ['EXTEND']).length === 0) {
        // user has no permission to create trusted post, has to specify relation type
        this.showExistingRelation = true;
      }
    });

    this.postForm.get('applyType').valueChanges
      .subscribe((applyType: string) => {
        this.postForm.get('applyWebsite').setValidators(applyType === 'website' && [Validators.required, Validators.maxLength(255)]);
        this.postForm.get('applyDocument').setValidators(applyType === 'document' && Validators.required);
        this.postForm.get('applyEmail').setValidators(applyType === 'email' && [Validators.required, ValidationService.emailValidator]);
        this.postForm.get('applyWebsite').updateValueAndValidity();
        this.postForm.get('applyDocument').updateValueAndValidity();
        this.postForm.get('applyEmail').updateValueAndValidity();
      });
  }

  submit() {
    const post: PostDTO = _.pick(this.postForm.value, ['name', 'description', 'organizationName', 'location', 'existingRelation']);
    post.postCategories = _.without(this.postForm.value.postCategoriesMap.map((c, i) => c ? this.board.postCategories[i] : null), null);
    post.memberCategories = _.without(this.postForm.value.memberCategoriesMap.map((c, i) => c ? this.board.department.memberCategories[i] : null), null);
    const applyProperty = 'apply' + _.capitalize(this.postForm.value.applyType);
    post[applyProperty] = this.postForm.value[applyProperty];

    if (this.post) {
      this.http.patch('/api/posts/' + this.post.id, post)
        .subscribe(() => {
          this.snackBar.open("Board Saved!");
        });
    } else {
      this.http.post('/api/boards/' + this.board.id + '/posts', post)
        .subscribe(() => {
          this.router.navigate([this.board.department.handle, this.board.handle]);
        });
    }
  }

}
