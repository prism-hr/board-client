import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ResourceService} from '../../services/resource.service';

@Component({
  selector: 'b-board-header',
  templateUrl: 'board-header.component.html',
  styleUrls: ['board-header.component.scss']
})
export class BoardHeaderComponent implements OnChanges {

  @Input() board: any;
  canEdit: boolean;
  canEditDepartment: boolean;

  constructor(private resourceService: ResourceService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board']) {
      this.canEdit = this.resourceService.canEdit(this.board);
      this.canEditDepartment = this.resourceService.canEdit(this.board.department);
    }
  }

  logoChanged() {
    this.resourceService.patchDepartment(this.board.department.id, {documentLogo: this.board.department.documentLogo})
      .subscribe();
  }
}
