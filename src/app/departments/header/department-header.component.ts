import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import {WalkthroughOverlayService} from '../../walkthrough-overlay/walkthrough-overlay.service';

@Component({
  selector: 'b-department-header',
  templateUrl: 'department-header.component.html',
  styleUrls: ['department-header.component.scss']
})
export class DepartmentHeaderComponent implements OnChanges {

  @Input() department: any;
  canEdit: boolean;

  constructor(private resourceService: ResourceService, private userService: UserService,
              private walkthroughOverlayService: WalkthroughOverlayService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canEdit = this.department && this.resourceService.canEdit(this.department);
    this.userService.user$.first().
      subscribe(user => {
      if (this.canEdit) {
        if (!user.seenWalkThrough) {
          setTimeout(() => {
            this.showWalkthrough();
          });
        }
      }
    });
  }

  showWalkthrough() {
    this.walkthroughOverlayService.open()
      .subscribe();
  }

  logoChanged() {
    this.resourceService.patchDepartment(this.department.id, {documentLogo: this.department.documentLogo})
      .subscribe();
  }
}
