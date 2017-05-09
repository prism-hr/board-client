import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ResourceService} from '../services/resource.service';

@Component({
  selector: 'b-xeditable-logo',
  template: `
    <b-file-upload [(ngModel)]="logo" (change)="logoChanged()" type="logo"></b-file-upload>
  `,
  styleUrls: []
})
export class XeditableLogoComponent implements OnChanges {

  @Input() canEdit: boolean;
  @Input() resource: any;
  @Input() propertyName: string;

  logo: string;

  constructor(private resourceService: ResourceService, private eRef: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logo = changes['resource'].currentValue[this.propertyName];
  }

  logoChanged() {
    this.resourceService.patchBoard(this.resource.id, {[this.propertyName]: this.logo})
      .subscribe(board => {
        this.resource[this.propertyName] = board[this.propertyName];
      });
  }

}
