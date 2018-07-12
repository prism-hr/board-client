import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MenuItem} from 'primeng/components/common/menuitem';
import {Subject} from 'rxjs/index';
import {Subscription} from 'rxjs/internal/Subscription';
import {takeUntil} from 'rxjs/operators';
import {EntityFilter, stateFilterConfigurations} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import PostRepresentation = b.PostRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-list',
  templateUrl: 'post-list.component.html',
  styleUrls: ['post-list.component.scss']
})
export class PostListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() resource: ResourceRepresentation<any>;
  posts: PostRepresentation[];
  user: UserRepresentation;
  newPostLink: any[];
  tabDefinitions = stateFilterConfigurations;
  tabs: MenuItem[] = [];
  activeTab: MenuItem;
  stateCategory: string;
  subscription = new Subscription();
  destroyStreams$ = new Subject();

  constructor(private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit() {
    this.newResourceApplied();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resource) {
      this.newResourceApplied();
    }
  }

  filterApplied(filter: EntityFilter) {
    this.loadPosts(filter);
  }

  loadPosts(appliedFilter?: EntityFilter) {
    const filter = Object.assign({}, appliedFilter) || {};
    filter.includePublic = !this.user;
    filter.parentId = this.resource && this.resource.id;
    this.resourceService.getPosts(filter)
      .pipe(takeUntil(this.destroyStreams$))
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.destroyStreams$.next();
  }

  private newResourceApplied() {
    this.subscription.unsubscribe();
    this.subscription = this.userService.user$
      .pipe(takeUntil(this.destroyStreams$))
      .subscribe(user => {
        this.user = user;
        this.initializeFilterCategories(user);
        this.loadPosts();
      });
    const newPostLinkParams = {};
    if (this.resource) {
      newPostLinkParams[this.resource.scope.toLowerCase() + 'Id'] = this.resource.id;
    }
    this.newPostLink = ['/newPost', newPostLinkParams]
  }

  private initializeFilterCategories(user: UserRepresentation) {
    this.tabs = [];
      const isStaffMember = user && (user.postCreator || user.departmentAdministrator)
    for (let category in stateFilterConfigurations) {
      if (category === 'ARCHIVED' && !isStaffMember) {
        continue;
      }
      const tabDefinition = stateFilterConfigurations[category];
      this.tabs.push({
        label: tabDefinition.label, command: () => {
          this.stateCategory = category;
        }
      });
    }
    this.activeTab = this.tabs[0];
    this.stateCategory = Object.keys(this.tabDefinitions)[0];
  }
}

