import {Component, Input} from '@angular/core';

@Component({
  selector: 'b-board-header',
  templateUrl: 'board-header.component.html',
  styleUrls: ['board-header.component.scss']
})
export class BoardHeaderComponent {
  @Input() board: any;
  @Input() canEdit: boolean;
}
