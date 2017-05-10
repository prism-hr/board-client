import {Component, Input} from '@angular/core';
import PostRepresentation = b.PostRepresentation;
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  selector: 'b-post-item',
  templateUrl: 'post-item.component.html',
  styleUrls: ['post-item.component.scss']
})
export class PostItemComponent {
  @Input() post: any;

  constructor() {
  }

}
