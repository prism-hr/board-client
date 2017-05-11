import {Component, OnInit} from '@angular/core';
import {Account, Stormpath} from 'angular-stormpath';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import {UserService} from '../services/user.service';
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserRepresentation | boolean;
  posts: BoardRepresentation[];

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
