import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {PostService} from '../../../posts/post.service';
import BoardRepresentation = b.BoardRepresentation;
import BoardDTO = b.BoardDTO;
import PostRepresentation = b.PostRepresentation;

@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: BoardRepresentation;
  posts: PostRepresentation[];
  boardForm: FormGroup;

  constructor(private route: ActivatedRoute, private http: Http, private router: Router, private fb: FormBuilder,
              private snackBar: MdSnackBar, private postService: PostService) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      purpose: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.boardForm.setValue(_.pick(this.board, ['name', 'purpose']));
    });
    this.http.get('/api/boards/' + this.board.id + '/posts')
      .subscribe((posts: Response) => {
        this.posts = posts.json();
        this.posts.forEach(p => {
          this.preprocessPost(p);
        });
      });
  }

  submit() {
    this.http.patch('/api/boards/' + this.board.id, this.boardForm.value)
      .subscribe(() => {
        this.snackBar.open('Board Saved!');
      }, (error: Response) => {
        if (error.status === 422) {
          if (error.json().exceptionCode === 'DUPLICATE_BOARD') {
            this.boardForm.controls['name'].setErrors({duplicateBoard: true});
          }
        }
      });
  }

  executePostAction(post: PostRepresentation, action: string) {
    this.http.post('/api/posts/' + post.id + '/' + action.toLowerCase(), {})
      .subscribe(returnedPost => {
        const idx = this.posts.indexOf(post);
        this.posts.splice(idx, 1, this.preprocessPost(returnedPost.json()));
      });
  }

  private preprocessPost(p: PostRepresentation): PostRepresentation {
    (p as any).actionView = this.postService.getActionView(p);
    return p;
  }
}
