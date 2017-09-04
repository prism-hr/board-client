import {Component, Input, OnInit} from '@angular/core';
import PostRepresentation = b.PostRepresentation;

@Component({
  selector: 'b-post-header',
  template: `
    <div *ngIf="post" class="post-title" fxLayout="row" fxLayoutAlign="space-between top">
      <div>
        <div *ngIf="publishedTimestamp" class="date">
          <div *ngIf="(publishedTimestamp | amDifference: today) >= 0">
            Going live: {{publishedTimestamp | amCalendar}}
          </div>
          <div *ngIf="(publishedTimestamp | amDifference: today) < 0">
            Published: {{publishedTimestamp | amCalendar}}
          </div>
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
  publishedTimestamp: string;
  today: Date;

  constructor() {
  }

  ngOnInit() {
    this.today = new Date();
    this.publishedTimestamp = <any>this.post.liveTimestamp;
  }
}