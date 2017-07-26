import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DefinitionsService} from '../services/definitions.service';
import BadgeListType = b.BadgeListType;
import BadgeType = b.BadgeType;
import ResourceRepresentation = b.ResourceRepresentation;
import WidgetOptionsDTO = b.WidgetOptionsDTO;

@Component({
  template: `
    <div class="grid__item one-whole">
      <label>Badge Options</label>
      <div>
        <div>
          <p-radioButton name="badgeType" value="SIMPLE" label="Simple" [(ngModel)]="badgeType"
                         (ngModelChange)="refreshSnippet($event)"></p-radioButton>
          <p-radioButton name="badgeType" value="LIST" label="List" [(ngModel)]="badgeType"
                         (ngModelChange)="refreshSnippet($event)"></p-radioButton>
        </div>
        <div *ngIf="badgeType === 'LIST'">
          <div>
            <p-radioButton name="badgeListType" value="STATIC" label="Static" [(ngModel)]="badgeListType"
                           (ngModelChange)="refreshSnippet($event)"></p-radioButton>
            <p-radioButton name="badgeListType" value="SLIDER" label="Slider" [(ngModel)]="badgeListType"
                           (ngModelChange)="refreshSnippet($event)"></p-radioButton>
          </div>
          <div>
            <p-radioButton name="postCount" [value]="1" [(ngModel)]="postCount" label="Show 1 post"
                           (ngModelChange)="refreshSnippet($event)"></p-radioButton>
            <p-radioButton name="postCount" [value]="2" [(ngModel)]="postCount" label="Show 2 posts"
                           (ngModelChange)="refreshSnippet($event)"></p-radioButton>
          </div>
        </div>
      </div>
    </div>

    <div class="grid__item one-whole input-holder">
      <label>Badge Snippet</label>
      <textarea pInputTextarea [ngModel]="badgeSnippet" required
                class="ui-inputtext ui-corner-all ui-state-default ui-widget" readonly></textarea>
    </div>

    <script>
      var js, fjs = document.getElementsByTagName("script")[0];
      if (!document.getElementById("alumeni-prism-widgets")) {
        js = document.createElement("script");
        js.id = "alumeni-prism-widgets";
        js.src = "http://localhost:4200/assets/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
      }
    </script>

    <div #badgePreview data-prism-widget="badge" data-resource="board#3"
         [attr.data-options]="widgetOptionsStringified">
    </div>
  `,
  styles: []
})
export class ResourceBadgeComponent implements OnInit {

  resource: ResourceRepresentation<any>;
  badgeSnippet: string;
  badgeType: BadgeType = 'LIST';
  badgeListType: BadgeListType = 'STATIC';
  postCount = 2;
  @ViewChild('badgePreview') badgePreview: ElementRef;
  widgetOptionsStringified: string;

  constructor(private route: ActivatedRoute, private definitionsService: DefinitionsService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.resource = data[resourceScope];
      this.refreshSnippet();
    });
  }

  refreshSnippet() {
    const widgetsUrlPrefix = this.definitionsService.getDefinitions()['applicationUrl'];
    const widgetOptions: WidgetOptionsDTO = {badgeType: this.badgeType, badgeListType: this.badgeListType, postCount: this.postCount};
    this.widgetOptionsStringified = JSON.stringify(widgetOptions);
    const resourceStringified = this.resource.scope.toLowerCase() + '#' + this.resource.id;
    this.badgeSnippet =
      `<script>
var js, fjs = document.getElementsByTagName("script")[0];
if (!document.getElementById("alumeni-prism-widgets")) {
js = document.createElement("script");
js.id = "alumeni-prism-widgets";
js.src = "${widgetsUrlPrefix}/assets/widgets.js";
fjs.parentNode.insertBefore(js, fjs);
}
</script>
<div data-prism-widget="badge" data-resource="${resourceStringified}" data-options='${JSON.stringify(widgetOptions)}'></div>`;

    const badgePreview = this.badgePreview;
    window['alumeniPrismJQuery'](document).ready(function ($) {
      $(badgePreview.nativeElement).prismInitializeWidget();
    });
  }

}
