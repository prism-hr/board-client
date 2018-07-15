import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'b-department-header',
  templateUrl: 'department-header.component.html',
  styleUrls: ['department-header.component.scss']
})
export class DepartmentHeaderComponent implements OnChanges {

  @Input() department: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
