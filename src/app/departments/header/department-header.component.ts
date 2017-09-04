import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ResourceService} from '../../services/resource.service';

@Component({
  selector: 'b-department-header',
  templateUrl: 'department-header.component.html',
  styleUrls: ['department-header.component.scss']
})
export class DepartmentHeaderComponent implements OnChanges {

  @Input() department: any;
  canEdit: boolean;

  constructor(private resourceService: ResourceService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canEdit = this.department && this.resourceService.canEdit(this.department);
  }

  logoChanged() {
    this.resourceService.patchDepartment(this.department.id, {documentLogo: this.department.documentLogo})
      .subscribe();
  }
}
