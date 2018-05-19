import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';
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
  subscription: Subscription = new Subscription();

  constructor(private title: Title, private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.userService.user$.subscribe(user => {
      this.user = user;
      this.title.setTitle(user ? 'Posts' : 'Board - Home');
      this.posts = null;
      if (user) {
        this.subscription.add(this.resourceService.getResources('POST').subscribe(posts => {
          this.posts = posts;
        }));
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterApplied(filter) {
    this.resourceService.getResources('POST', filter).subscribe(posts => {
      this.posts = posts;
    });
  }

}
