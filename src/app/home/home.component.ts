import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  user: UserRepresentation;
  posts: PostRepresentation[];
  boards: BoardRepresentation[];
  destroyStreams$ = new Subject();

  constructor(private title: Title, private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroyStreams$))
      .subscribe(user => {
        this.user = user;
        this.title.setTitle(user ? 'Posts' : 'Board - Home');
        this.posts = null;
        if (user) {
          this.resourceService.getResources('POST')
            .pipe(takeUntil(this.destroyStreams$))
            .subscribe(posts => {
              this.posts = posts;
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyStreams$.next();
  }

}
