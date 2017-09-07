import {Component, Input, OnInit} from '@angular/core';
import BoardRepresentation = b.BoardRepresentation;
import {ResourceService} from '../../services/resource.service';

@Component({
  selector: 'b-board-item',
  templateUrl: 'board-item.component.html',
  styles: [``]
})
export class BoardItemComponent implements OnInit {
  @Input() board: BoardRepresentation & {};
  canEdit: boolean;

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.canEdit = this.resourceService.canEdit(this.board);
  }

}
