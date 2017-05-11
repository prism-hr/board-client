import {Component, Input} from '@angular/core';
import {ResourceService} from '../../services/resource.service';

@Component({
  selector: 'b-board-header',
  templateUrl: 'board-header.component.html',
  styleUrls: ['board-header.component.scss']
})
export class BoardHeaderComponent {

  @Input() board: any;
  @Input() canEdit: boolean;

  constructor(private resourceService: ResourceService) {
  }

  logoChanged() {
    this.resourceService.patchBoard(this.board.id, {documentLogo: this.board.documentLogo})
      .subscribe();
  }
}
