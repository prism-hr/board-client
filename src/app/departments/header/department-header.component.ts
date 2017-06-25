import {Component, Input} from '@angular/core';
import {ResourceService} from '../../services/resource.service';

@Component({
  selector: 'b-department-header',
  templateUrl: 'department-header.component.html',
  styleUrls: ['department-header.component.scss']
})
export class DepartmentHeaderComponent {

  @Input() department: any;
  @Input() canEdit: boolean;

  constructor(private resourceService: ResourceService) {
  }

  logoChanged() {
    this.resourceService.patchDepartment(this.department.id, {documentLogo: this.department.documentLogo})
      .subscribe();
  }
}
