import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data} from '@angular/router';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {EntityFilter} from '../../general/filter/filter.component';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import {WalkthroughOverlayService} from '../../walkthrough-overlay/walkthrough-overlay.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'department-view.component.html',
  styleUrls: ['department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit {

  department: DepartmentRepresentation;

  canEdit: boolean;
  boards: BoardRepresentation[];
  user: UserRepresentation;
  filter: EntityFilter;
  showTasksSidebar: boolean;

  constructor(private route: ActivatedRoute, private title: Title, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.department = data['department'];
        this.title.setTitle(this.department.name);
        this.canEdit = this.resourceService.canEdit(this.department);
      });

  }


}
