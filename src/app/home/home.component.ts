import {Component, OnInit} from '@angular/core';
import {Account, Stormpath} from 'angular-stormpath';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: Account | boolean;
  posts: BoardRepresentation[];

  constructor(private resourceService: ResourceService, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.stormpath.user$.subscribe(user => {
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
