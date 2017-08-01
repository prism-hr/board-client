import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import PostRepresentation = b.PostRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserRepresentation | boolean;
  posts: PostRepresentation[];
  boards: BoardRepresentation[];

  constructor(private route: ActivatedRoute, private authGuard: AuthGuard,
              private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.authGuard.showInitialModalIfNecessary(this.route.snapshot.paramMap);
    });

    this.userService.user$.subscribe(user => {
      this.user = user;
      this.posts = null;
      if (user) {
        this.resourceService.getPosts().subscribe(posts => {
          this.posts = posts;
        });
      }
    });
  }
}
