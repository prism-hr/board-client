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
import ResourceEventRepresentation = b.ResourceEventRepresentation;

@Component({
  templateUrl: 'post-responses.component.html',
  styleUrls: ['post-responses.component.scss']
})
export class PostResponsesComponent implements OnInit {

  post: PostRepresentation;
  responses: ResourceEventRepresentation[];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cdf: ChangeDetectorRef,
              private dialog: MdDialog, private definitionsService: DefinitionsService, private postService: PostService,
              private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.parent.data
      .map(data => {
        return data['post'];
      })
      .flatMap(post => {
        return this.route.data.map(data => {
          return [post, data['responses']];
        });
      })
      .subscribe(([post, responses]) => {
        this.post = post;
        this.responses = responses;
      });
  }

}
