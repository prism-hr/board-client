import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;
import PostRepresentation = b.PostRepresentation;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserRepresentation | boolean;
  posts: PostRepresentation[];
  boards: BoardRepresentation[];
  showPostNewDialog: boolean;

  constructor(private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
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
