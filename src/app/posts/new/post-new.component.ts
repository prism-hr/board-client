import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../validation/validation.service';
import * as _ from 'lodash';
import {MdSnackBar} from '@angular/material';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import PostRepresentation = b.PostRepresentation;
import Role = b.Role;

@Component({
  templateUrl: 'post-new.component.html',
  styleUrls: ['post-new.component.scss']
})
export class PostNewComponent implements OnInit {
  board: BoardRepresentation;
  post: PostRepresentation;
  postForm: FormGroup;
  showExistingRelationSpecify: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private fb: FormBuilder,
              private snackBar: MdSnackBar) {
    this.postForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      organizationName: ['', [Validators.required, Validators.maxLength(255)]],
      location: [null, Validators.required],
      existingRelationSpecify: [null, Validators.required],
      existingRelation: [null],
      postCategories: [[]],
      memberCategories: [[]],
      applyType: [null, Validators.required],
      applyWebsite: [null, Validators.maxLength(255)],
      applyDocument: [],
      applyEmail: [null, Validators.maxLength(254)]
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['board']) {
        this.board = data['board'];
      } else if (data['post']) {
        this.post = data['post'];
        this.board = this.post.board;
        const formValue: any = Object.assign({}, this.post);
        formValue.existingRelationSpecify = !!formValue.existingRelationSpecify;
        formValue.applyType = formValue.applyWebsite ? 'website' : (formValue.applyDocument ? 'document' : (formValue.applyEmail ? 'email' : null));
        this.postForm.reset(formValue);
      }
      if(_.intersection(this.board.roles as any as string[], ['ADMINISTRATOR', 'CONTRIBUTOR']).length === 0) {
        this.showExistingRelationSpecify = true;
      }
    });
    this.postForm.get('existingRelationSpecify').valueChanges
      .subscribe((specify: boolean) => {
        this.postForm.get('existingRelation').setValidators(specify ? Validators.required : null);
        this.postForm.get('existingRelation').setValue(null);
        this.postForm.get('existingRelation').updateValueAndValidity();
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
    const post = _.pick(this.postForm.value, ['name', 'description', 'organizationName', 'location', 'existingRelation',
      'postCategories', 'memberCategories']);
    const applyProperty = 'apply' + _.capitalize(this.postForm.value.applyType);
    post[applyProperty] = this.postForm.value[applyProperty];

    const errorHandler = (error: Response) => {
      if (error.status === 422) {
        if(error.json().exceptionCode === 'MISSING_RELATION_DESCRIPTION') {
          this.postForm.get('existingRelationSpecify').setErrors({missingRelationDescription: true});
        }
      }
    };

    if (this.post) {
      this.http.put('/api/posts/' + this.post.id, post)
        .subscribe(() => {
          this.snackBar.open("Board Saved!");
        }, errorHandler);
    } else {
      this.http.post('/api/boards/' + this.board.id + '/posts', post)
        .subscribe(() => {
          this.router.navigate([this.board.department.handle, this.board.handle]);
        }, errorHandler);
    }
  }

}
