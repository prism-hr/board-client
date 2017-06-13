import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import {UserService} from '../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;
import {AuthGuard} from '../authentication/auth-guard.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserRepresentation | boolean;
  posts: BoardRepresentation[];

  constructor(private resourceService: ResourceService, private userService: UserService, private authGuard: AuthGuard) {
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
