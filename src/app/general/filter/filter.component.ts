import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from 'primeng/primeng';
import {DefinitionsService} from '../../services/definitions.service';
import Scope = b.Scope;
import State = b.State;

@Component({
  selector: 'b-filter',
  template: `
    <div class="search-filter">
      <form fxLayout="row" fxLayoutAlign="space-between center" (submit)="search()">
        <div class="input-holder" fxLayout="row" fxLayoutAlign="flex-start center">
          <input name="text-filter" [(ngModel)]="searchTerm" placeholder="Search" class="ui-inputtext">
          <button pButton icon="fa-magnifier" class="ui-button-success"></button>
          <button pButton icon="fa-close" type="button" *ngIf="searchTerm" (click)="clear()" class="ui-button-warning"></button>
        </div>
        <div *ngIf="resourceScope">
          <p-selectButton styleClass="ui-button-info" [options]="states" [(ngModel)]="state" name="selected"></p-selectButton>
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

  definitions: { [key: string]: any };

  state: State = 'ACCEPTED';
  states: SelectItem[];

  constructor(private translate: TranslateService, private definitionsService: DefinitionsService) {
    this.definitions = definitionsService.getDefinitions();
  }

  ngOnInit(): void {
    const states = {
      BOARD: ['DRAFT', 'ACCEPTED', 'REJECTED'],
      POST: ['DRAFT', 'SUSPENDED', 'PENDING', 'ACCEPTED', 'REJECTED']
    };

    this.translate.get('definitions.state').subscribe(stateTranslations => {
      if (states[this.resourceScope]) {
        this.states = states[this.resourceScope].map(state => ({value: state, label: stateTranslations[state]}));
      }
    });
  }

  clear() {
    this.searchTerm = null;
    this.search();
  }

  search() {
    this.applied.emit({searchTerm: this.searchTerm});
  }
}
