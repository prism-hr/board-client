import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DefinitionsService} from '../services/definitions.service';
import ResourceUserRepresentation = b.ResourceUserRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;
import ResourceUserDTO = b.ResourceUserDTO;
import BadgeType = b.BadgeType;
import WidgetOptionsDTO = b.WidgetOptionsDTO;
import BadgeListType = b.BadgeListType;

@Component({
  selector: 'b-resource-badge',
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
        <div>
          <p-radioButton name="badgeListType" value="STATIC" label="Static" [(ngModel)]="badgeListType"
                         (ngModelChange)="refreshSnippet($event)"></p-radioButton>
          <p-radioButton name="badgeListType" value="SLIDER" label="Slider" [(ngModel)]="badgeListType"
                         (ngModelChange)="refreshSnippet($event)"></p-radioButton>
        </div>
        <p-spinner size="30" [(ngModel)]="postCount" [min]="1" [max]="10"></p-spinner>
      </div>
    </div>

    <div class="grid__item one-whole input-holder">
      <label>Badge Snippet</label>
      <textarea pInputTextarea [(ngModel)]="badgeSnippet" required
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
         data-options='{"badgeType":"LIST","badgeListType":"STATIC","postCount":3}'>
    </div>
  `,
  styles: []
})
export class ResourceBadgeComponent implements OnInit {

  @Input() resource: any;
  badgeSnippet: string;
  badgeType: BadgeType = 'LIST';
  badgeListType: BadgeListType = 'STATIC';
  postCount = 3;
  @ViewChild('badgePreview') badgePreview: ElementRef;

  constructor(private definitionsService: DefinitionsService) {
  }

  ngOnInit() {
    this.refreshSnippet();
    const badgePreview = this.badgePreview;
    window['alumeniPrismJQuery'](document).ready(function ($) {
      $(badgePreview.nativeElement).prismInitializeWidget();
    });
  }

  refreshSnippet() {
    const widgetsUrlPrefix = this.definitionsService.getDefinitions()['applicationUrl'];
    const widgetOptions: WidgetOptionsDTO = {badgeType: this.badgeType, badgeListType: this.badgeListType, postCount: this.postCount};
    const resourceSerialized = this.resource.scope.toLowerCase() + '#' + this.resource.id;
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
<div data-prism-widget="badge" data-resource="${resourceSerialized}" data-options='${JSON.stringify(widgetOptions)}'></div>`;
  }

}
