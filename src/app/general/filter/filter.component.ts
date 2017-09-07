import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'b-filter',
  template: `
    <input type="text" size="30" pInputText [(ngModel)]="searchTerm" placeholder="Search Member">
    <button pButton (click)="search()" label="Filter" icon="fa-magnifier" class="ui-button-success small">
    </button>
  `,
  styles: []
})
export class FilterComponent implements OnInit {

  @Input() showState: string;
  @Output() applied: EventEmitter<{searchTerm: string}> = new EventEmitter();
  searchTerm: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  search() {
    this.applied.emit({searchTerm: this.searchTerm});
  }
}
