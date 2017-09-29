import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
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

        <div *ngIf="!showArchive">
          <button *ngIf="resourceScope" pButton type="button" label="Search archives"
                  (click)="setShowArchive(true)" class="ui-button-warning"></button>

          <div *ngIf="states">
            <p-selectButton styleClass="ui-button-info" [options]="states" [(ngModel)]="selectedState" name="state"
                            (onChange)="search()"></p-selectButton>
          </div>
        </div>

        <div *ngIf="showArchive">
          <button pButton type="button" label="Back" (click)="setShowArchive(false)" class="ui-button-warning"></button>

          <p-dropdown *ngIf="archiveQuarters.length > 0" [options]="archiveQuarters" [(ngModel)]="selectedQuarter"
                      (onChange)="search()" name="quarter"></p-dropdown>
          <div *ngIf="archiveQuarters.length === 0">
            There is no archives amongst the items you can see.
          </div>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class FilterComponent implements OnInit {

  @Input() resourceScope: Scope & string;
  @Output() applied: EventEmitter<EntityFilter> = new EventEmitter();
  searchTerm: string;

  definitions: { [key: string]: any };

  states: SelectItem[];
  selectedState: State;
  showArchive: boolean;
  archiveQuarters: SelectItem[];
  selectedQuarter: string;

  constructor(private translate: TranslateService, private definitionsService: DefinitionsService, private resourceService: ResourceService) {
    this.definitions = definitionsService.getDefinitions();
  }

  ngOnInit(): void {
    const states = {
      BOARD: ['DRAFT', 'ACCEPTED', 'REJECTED'],
      POST: ['DRAFT', 'SUSPENDED', 'PENDING', 'ACCEPTED', 'EXPIRED', 'REJECTED', 'WITHDRAWN']
    };

    this.translate.get('definitions.state').subscribe(stateTranslations => {
      if (states[this.resourceScope]) {
        this.states = states[this.resourceScope].map(state => ({value: state, label: stateTranslations[state]}));
        this.selectedState = 'ACCEPTED';
      }
    });
  }

  clear() {
    this.searchTerm = null;
    this.search();
  }

  search() {
    this.applied.emit({searchTerm: this.searchTerm, state: this.selectedState, quarter: this.selectedQuarter});
  }

  setShowArchive(show) {
    let quarters$;
    if (!this.archiveQuarters) {
      quarters$ = this.resourceService.getArchiveQuarters(this.resourceScope)
        .do(quarters => {
          this.archiveQuarters = quarters.map(quarter => {
            const year = quarter.slice(0, 4);
            const quarterDigit = quarter[4];
            return {value: quarter, label: year + '/' + quarterDigit}
          });
        });
    } else {
      quarters$ = Observable.of(this.archiveQuarters);
    }
    quarters$.subscribe(() => {
      this.showArchive = show;
      if (!show) {
        this.selectedQuarter = null;
        this.search();
      }
    });
  }
}

export interface EntityFilter {
  searchTerm: string;
  state?: State;
  quarter?: string;
}
