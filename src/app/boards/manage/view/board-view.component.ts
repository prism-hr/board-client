import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {ResourceService} from '../../../services/resource.service';
import {AuthGuard} from '../../../authentication/auth-guard.service';
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

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private authGuard: AuthGuard,
              private resourceService: ResourceService) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.canEdit = this.resourceService.canEdit(this.board);
      this.boardForm.setValue(_.pick(this.board, ['name', 'summary']));
    });
    this.resourceService.getBoardPosts(this.board.id)
      .subscribe(posts => this.posts = posts);
  }

  newPost() {
    this.authGuard.ensureAuthenticated(true).first() // open dialog if not authenticated
      .subscribe(authenticated => {
        if (!authenticated) {
          return;
        }
        this.router.navigate([this.board.department.handle, this.board.handle, 'newPost']);
      });
  }

}
