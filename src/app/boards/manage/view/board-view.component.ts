import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http, Response} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {PostService} from '../../../posts/post.service';
import {ResourceService} from '../../../services/resource.service';
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
  nameEditing: boolean;
  boardName: string;

  constructor(private route: ActivatedRoute, private http: Http, private fb: FormBuilder,
              private snackBar: MdSnackBar, private resourceService: ResourceService, private postService: PostService) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.boardForm.setValue(_.pick(this.board, ['name', 'description']));
    });
    this.http.get('/api/boards/' + this.board.id + '/posts')
      .subscribe((posts: Response) => {
        this.posts = posts.json();
        this.posts.forEach(p => {
          this.preprocessPost(p);
        });
      });
  }

  openNameEdit() {
    this.nameEditing = true;
    this.boardName = this.board.name;
  }

  cancelNameEdit() {
    this.nameEditing = false;
  }

  acceptNameEdit() {
    this.resourceService.patchBoard(this.board.id, {name: this.boardName})
      .subscribe(board => {
        this.board.name = board.name;
        this.nameEditing = false;
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
