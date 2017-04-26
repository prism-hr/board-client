import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../post.service';
import {MenuItem} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'post-view.component.html',
  styleUrls: ['post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  board: BoardRepresentation;
  post: PostRepresentation;
  actions: MenuItem[];

  constructor(private route: ActivatedRoute, private router: Router, private translate: TranslateService, private postService: PostService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
      this.board = data['board'];
      const availableActions = ['SUSPEND', 'REJECT', 'WITHDRAW', 'RESTORE']
        .filter(a => this.post.actions.find(actionDef => actionDef.action as any === a));
      this.translate.get('definitions.action')
        .subscribe(actionTranslations => {
          this.actions = availableActions.map(a => {
            return {
              label: actionTranslations[a], command: () => {
                this.executeAction(a);
              }
            };
          });
        });
    });
  }

  gotoSettings() {
    this.router.navigate(['settings'], {relativeTo: this.route});
  }

  executeAction(action: string) {
    this.postService.executeAction(this.post, action, {}, this.board);
  }

}
