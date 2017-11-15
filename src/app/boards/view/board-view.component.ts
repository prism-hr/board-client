import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, ParamMap} from '@angular/router';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {UnsubscribeDialogComponent} from '../../authentication/unsubscribe.dialog';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;
import UserRepresentation = b.UserRepresentation;


@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: BoardRepresentation;
  canEdit: boolean;
  posts: PostRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;

  constructor(private route: ActivatedRoute, private title: Title, private dialog: MatDialog, private resourceService: ResourceService,
              private userService: UserService) {
  }

  ngOnInit() {
    combineLatest(this.route.parent.data, this.route.queryParamMap)
      .subscribe(([parentData, queryParamMap]: [Data, ParamMap]) => {
        this.board = parentData['board'];
        this.title.setTitle(this.board.name);
        this.canEdit = this.resourceService.canEdit(this.board);

        const modalType = queryParamMap.get('modal');
        const uuid = queryParamMap.get('uuid');

        if (modalType === 'unsubscribe') {
          const config = new MatDialogConfig();
          config.data = {uuid, resource: this.board};
          setTimeout(() => {
            this.dialog.open(UnsubscribeDialogComponent, config);
          });
        }
      });

    this.userService.user$.subscribe(user => {
      this.user = user;
      this.loadPosts();
    });
  }

  filterApplied(filter: EntityFilter) {
    this.loadPosts(filter);
  }

  loadPosts(filter?: EntityFilter) {
    this.filter = filter || this.filter || {};
    this.filter.includePublic = !this.user;
    this.filter.parentId = this.board.id;
    this.resourceService.getPosts(this.filter).subscribe(posts => {
      this.posts = posts;
    });
  }

}
