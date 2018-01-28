import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data} from '@angular/router';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit, OnDestroy {
  department: DepartmentRepresentation;

  canEdit: boolean;
  boards: BoardRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;
  showTasksSidebar: boolean;

  constructor(private route: ActivatedRoute, private title: Title, private resourceService: ResourceService,
              private userService: UserService) {
  }

  ngOnInit() {
    combineLatest(this.route.parent.data, this.userService.user$.first())
      .subscribe(([data, user]: [Data, Data, UserRepresentation]) => {
        this.department = data['department'];
        this.title.setTitle(this.department.name);
        this.canEdit = this.resourceService.canEdit(this.department);

        this.user = user;
        this.loadBoards();

        if (this.canEdit) {
          this.showTasksSidebar = true;

          // if (!this.user.seenWalkThrough) {
          //   setTimeout(() => {
          //     this.showWalkthrough();
          //   });
          // } else {
          //   this.showTasksSidebar = true;
          // }
        }
      });
  }

  ngOnDestroy(): void {
  }

  filterApplied(filter: EntityFilter) {
    this.loadBoards(filter);
  }

  loadBoards(filter?: EntityFilter) {
    this.filter = filter || this.filter || {};
    this.filter.includePublic = !this.user;
    this.filter.parentId = this.department.id;
    this.resourceService.getBoards(this.filter).subscribe(boards => {
      this.boards = boards;
    });
  }

  showWalkthrough() {
  }
}
