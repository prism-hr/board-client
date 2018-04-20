import {Component, Input, OnInit} from '@angular/core';
import PostRepresentation = b.PostRepresentation;
import {ResourceService} from '../../services/resource.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'b-post-header',
  templateUrl: 'post-header.component.html',
  styleUrls: ['post-header.component.scss']
})
export class PostHeaderComponent implements OnInit {
  @Input() post: PostRepresentation & {};
  today: Date;
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private title: Title, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.today = new Date();
    this.route.paramMap
      .subscribe(post => {
        this.canEdit = this.resourceService.canEdit(this.post);
      });
  }
}
