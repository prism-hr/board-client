import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {DefinitionsService} from '../../services/definitions.service';
import BadgeListType = b.BadgeListType;
import BadgeType = b.BadgeType;
import DepartmentBadgeOptionsDTO = b.DepartmentBadgeOptionsDTO;
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  templateUrl: 'resource-badge.component.html',
  styles: []
})
export class ResourceBadgeComponent implements OnInit {

  resource: ResourceRepresentation<any>;
  badgeSnippet: string;
  badgeType: BadgeType = 'LIST';
  badgeListType: BadgeListType = 'STATIC';
  postCount = 2;
  @ViewChild('badgePreview') badgePreview: ElementRef;
  badgeOptionsStringified: string;
  resourceStringified: string;

  constructor(private route: ActivatedRoute, private title: Title, private definitionsService: DefinitionsService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const resourceScope = data['resourceScope'];
      this.resource = data[resourceScope];
      this.title.setTitle(this.resource.name + ' - Badge');
      this.refreshSnippet();
    });
  }

  refreshSnippet() {
    const widgetsUrlPrefix = this.definitionsService.getDefinitions()['applicationUrl'];
    const badgeOptions: DepartmentBadgeOptionsDTO = {badgeType: this.badgeType, preview: true};
    if (this.badgeType === 'LIST') {
      badgeOptions.badgeListType = this.badgeListType;
      badgeOptions.postCount = this.postCount;
    }
    this.badgeOptionsStringified = JSON.stringify(badgeOptions);
    const resourceStringified = this.resource.scope.toLowerCase() + '#' + this.resource.id;
    this.resourceStringified = resourceStringified;
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
<div data-prism-widget="badge" data-resource="${resourceStringified}" data-options='${JSON.stringify(badgeOptions)}'></div>`;

    setTimeout(() => {
      const badgePreview = this.badgePreview;
      window['alumeniPrismJQuery'](document).ready(function ($) {
        $(badgePreview.nativeElement).prismInitializeWidget();
      });
    }, 1000);
  }

}
