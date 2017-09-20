import {Component, OnInit} from '@angular/core';
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

  user: UserRepresentation;
  posts: PostRepresentation[];
  boards: BoardRepresentation[];

  constructor(private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
      this.posts = null;
      if (user) {
        this.resourceService.getResources('POST').subscribe(posts => {
          this.posts = posts;
        });
      }
    });
  }

  filterApplied(filter) {
    this.resourceService.getResources('POST',  filter.searchTerm).subscribe(posts => {
      this.posts = posts;
    });
  }
}
