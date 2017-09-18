import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import Scope = b.Scope;

@Component({
  selector: 'b-filter',
  template: `
    <div class="search-filter">
      <form fxLayout="row" fxLayoutAlign="space-between center" (submit)="search()">
        <div class="input-holder" fxLayout="row" fxLayoutAlign="flex-start center">
          <input name="text-filter" [(ngModel)]="searchTerm" placeholder="Search" class="ui-inputtext" >
          <button pButton icon="fa-magnifier" class="ui-button-success"></button>
          <button pButton icon="fa-close" type="button" *ngIf="searchTerm" (click)="clear()" class="ui-button-warning"></button>
        </div>
        <div *ngIf="resourceScope">
          <p-selectButton styleClass="ui-button-info" [options]="statuses" [(ngModel)]="selectedStatuses" multiple="multiple"
                          name="selected"></p-selectButton>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class FilterComponent implements OnInit {

  @Input() resourceScope: Scope & string;
  @Output() applied: EventEmitter<{ searchTerm: string }> = new EventEmitter();
  searchTerm: string;

  statuses: SelectItem[];
  selectedStatuses: string[] = ['ACCEPTED'];

  constructor() {
    this.statuses = [
      {label: 'Accepted', value: 'ACCEPTED'},
      {label: 'Pending', value: 'PENDING'},
      {label: 'Suspended', value: 'SUSPENDED'},
      {label: 'Expired', value: 'EXPIRED'},
      {label: 'Rejected', value: 'REJECTED'},
      {label: 'Draft', value: 'DRAFT'},
    ];
  }

  ngOnInit(): void {
  }

  clear() {
    this.searchTerm = null;
    this.search();
  }

  search() {
    this.applied.emit({searchTerm: this.searchTerm});
  }
}
