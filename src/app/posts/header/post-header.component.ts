import {Component, Input, OnInit} from '@angular/core';
import PostRepresentation = b.PostRepresentation;

@Component({
  selector: 'b-post-header',
  template: `
    <div *ngIf="post" class="post-title" fxLayout.xs="column" fxLayout.gt-xs="row" fxLayoutAlign.gt-xs="space-between flex-end">
      <div>
        <div *ngIf="post.liveTimestamp" class="date">
          <div *ngIf="(post.liveTimestamp | timeDifference) >= 0">
            Going live: {{post.liveTimestamp | displayDate}}
          </div>
          <div *ngIf="(post.liveTimestamp | timeDifference) < 0">
            Published: {{post.liveTimestamp | displayDate}}
          </div>
        </div>
        <div *ngIf="post.deadTimestamp" class="date">
          Deadline: {{post.deadTimestamp | displayDate}}
        </div>
        <h1>{{post.name}}</h1>
        <h2><em>at</em> {{post.organizationName}} <span class="location"><i class="fa fa-location-pin"></i> {{post.location.name}}</span>
        </h2>
      </div>
      <div fxLayout="column" fxLayoutAlign="space-between flex-end" class="admin-actions">
        <b-resource-actions-box [resource]="post" fxLayout="row"
                                fxLayoutAlign="space-between center"></b-resource-actions-box>
      </div>
    </div>`,
  styleUrls: ['post-header.component.scss']
})
export class PostHeaderComponent implements OnInit {
  @Input() post: PostRepresentation & {};
  today: Date;

  constructor() {
  }

  ngOnInit() {
    this.today = new Date();
  }
}
