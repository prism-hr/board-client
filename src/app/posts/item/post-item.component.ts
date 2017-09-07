import {Component, Input, OnInit} from '@angular/core';
import PostRepresentation = b.PostRepresentation;
import {ResourceService} from '../../services/resource.service';

@Component({
  selector: 'b-post-item',
  templateUrl: 'post-item.component.html',
  styles: [``]
})
export class PostItemComponent implements OnInit {
  @Input() post: PostRepresentation & {};
  canEdit: boolean;

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.canEdit = this.resourceService.canEdit(this.post);
  }

}
