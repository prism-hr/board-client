import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {DefinitionsService} from '../services/definitions.service';
import DocumentDTO = b.DocumentDTO;

@Component({
  selector: 'b-image',
  template: `
    <img *ngIf="url" src="{{url}}" />
  `,
  styles: []
})
export class ImageComponent implements OnInit, OnChanges {
  @Input() publicId: string;
  @Input() background: string;
  @Input() width: number;
  @Input() height: number;
  @Input() gravity: string;
  @Input() crop: string;
  @Input() radius: string;
  cloudinaryFolder: string;
  url: string;

  constructor(private definitionsService: DefinitionsService) {
  }

  ngOnInit(): void {
    this.cloudinaryFolder = this.definitionsService.getDefinitions()['cloudinaryFolder'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const transformations = [];
    if(this.height) {
      transformations.push('h_' + this.height);
    }
    if(this.width) {
      transformations.push('w_' + this.width);
    }
    if(this.gravity) {
      transformations.push('g_' + this.gravity);
    }
    if(this.crop) {
      transformations.push('c_' + this.crop);
    }
    if(this.radius) {
      transformations.push('r_' + this.radius);
    }
    if(this.background) {
      transformations.push('b_rgb:' + this.background);
    }
    let transformation = transformations.join(',');
    if(transformation.length > 0) {
      transformation += '/';
    }
    this.url = this.publicId && ('http://res.cloudinary.com/board-prism-hr/image/upload/' + transformation + this.publicId);
  }

}
