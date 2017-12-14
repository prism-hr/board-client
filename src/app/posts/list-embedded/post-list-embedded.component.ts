import {Component, Input, OnInit} from '@angular/core';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-list-embedded',
  templateUrl: 'post-list-embedded.component.html',
  styleUrls: ['post-list-embedded.component.scss']
})
export class PostListEmbeddedComponent implements OnInit {
  @Input() resource: ResourceRepresentation<any>;
  posts: PostRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;
  newPostLink: any[];

  constructor(private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
      this.loadPosts();
    });
    this.newPostLink = ['/newPost', {[this.resource.scope.toLowerCase() + 'Id']: this.resource.id}]
  }

  filterApplied(filter: EntityFilter) {
    this.loadPosts(filter);
  }

  loadPosts(filter?: EntityFilter) {
    this.filter = filter || this.filter || {};
    this.filter.includePublic = !this.user;
    this.filter.parentId = this.resource.id;
    this.resourceService.getPosts(this.filter).subscribe(posts => {
      this.posts = posts;
    });
  }

}
