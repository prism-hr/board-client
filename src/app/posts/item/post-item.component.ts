import {Component, Input} from '@angular/core';
import PostRepresentation = b.PostRepresentation;

@Component({
  selector: 'b-post-item',
  templateUrl: 'post-item.component.html',
  styles: [``]
})
export class PostItemComponent {
  @Input() post: PostRepresentation & {};

  constructor() {
  }

}
