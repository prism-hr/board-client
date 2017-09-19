import {Component, OnInit} from '@angular/core';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {ActivatedRoute, Data, ParamMap} from '@angular/router';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {UnsubscribeDialogComponent} from '../../../authentication/unsubscribe.dialog';
import {ResourceService} from '../../../services/resource.service';
import {UserService} from '../../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;


@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: BoardRepresentation;
  canEdit: boolean;
  posts: PostRepresentation[];

  constructor(private route: ActivatedRoute, private dialog: MdDialog, private resourceService: ResourceService,
              private userService: UserService) {
  }

  ngOnInit() {
    combineLatest(this.route.parent.data, this.route.queryParamMap)
      .subscribe(([parentData, queryParamMap]: [Data, ParamMap]) => {
        this.board = parentData['board'];
        this.canEdit = this.resourceService.canEdit(this.board);

        const modalType = queryParamMap.get('modal');
        const uuid = queryParamMap.get('uuid');

        if (modalType === 'unsubscribe') {
          const config = new MdDialogConfig();
          config.data = {uuid, resource: this.board};
          setTimeout(() => {
            this.dialog.open(UnsubscribeDialogComponent, config);
          });
        }
      });

    this.userService.user$.subscribe(user => {
      this.resourceService.getBoardPosts(this.board.id, !user).subscribe(posts => {
        this.posts = posts;
      });
    });
  }

}
