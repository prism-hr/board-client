import {Component, Input} from '@angular/core';
import BoardRepresentation = b.BoardRepresentation;

@Component({
  selector: 'b-board-item',
  templateUrl: 'board-item.component.html',
  styles: [``]
})
export class BoardItemComponent {
  @Input() board: BoardRepresentation & {};

  constructor() {
  }

}
