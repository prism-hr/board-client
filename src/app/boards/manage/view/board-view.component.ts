import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
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
  canEdit: boolean;
  posts: PostRepresentation[];
  boardForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private fb: FormBuilder,
              private postService: PostService, private resourceService: ResourceService) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.canEdit = this.resourceService.canEdit(this.board);
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

  gotoSettings(post: PostRepresentation) {
    this.router.navigate([post.id, 'settings'], {relativeTo: this.route});
  }

  private preprocessPost(p: PostRepresentation): PostRepresentation {
    (p as any).actionView = this.postService.getActionView(p);
    this.postService.getActionItems(p, this.board)
      .subscribe(actions => (p as any).actions = actions);
    return p;
  }
}
