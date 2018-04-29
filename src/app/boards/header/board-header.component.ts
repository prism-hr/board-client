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

  constructor(private resourceService: ResourceService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.canEdit = this.board && this.resourceService.canEdit(this.board);
  }

}
