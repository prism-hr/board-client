import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import BoardRepresentation = b.BoardRepresentation;
import BoardDTO = b.BoardDTO;
import PostRepresentation = b.PostRepresentation;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  post: PostRepresentation;
  postForm: FormGroup;

  constructor(private route: ActivatedRoute, private http: Http, private fb: FormBuilder,
              private snackBar: MdSnackBar) {
    this.postForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
    });
  }

}
