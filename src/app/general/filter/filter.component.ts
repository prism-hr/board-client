import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from 'primeng/components/common/selectitem';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import Scope = b.Scope;
import State = b.State;

@Component({
  selector: 'b-filter',
  template: `
    <div class="search-filter">
      <form fxLayout="column" fxLayout.gt-sm="row" fxLayoutAlign.gt-sm="space-between center" (submit)="search()">
        <div *ngIf="isStaffMember">
          <div *ngIf="!showArchive">
            <div *ngIf="states">
              <p-selectButton styleClass="ui-button-info" [options]="states" [(ngModel)]="selectedState" name="state"
                              (onChange)="search()"></p-selectButton>
            </div>
          </div>
        </div>
        <div *ngIf="isStaffMember">
          <div *ngIf="showArchive" class="archives" fxLayout="row" fxLayoutAlign="space-between center">
            <button pButton type="button" label="Back" (click)="setShowArchive(false)" class="ui-button-warning"></button>
            <div class="dropdown-select">
              <p-dropdown [options]="archiveQuarters" [(ngModel)]="selectedQuarter"
                          (onChange)="search()" name="quarter"></p-dropdown>
            </div>
          </div>
          <div *ngIf="!showArchive">
            <button *ngIf="archiveQuarters && archiveQuarters.length > 0" pButton type="button" label="Search archives"
                    (click)="setShowArchive(true)" class="ui-button-warning"></button>
          </div>
        </div>
        <div class="input-holder" fxLayout="row" fxLayoutAlign="flex-start center">
          <input name="text-filter" [(ngModel)]="searchTerm" placeholder="Search" class="ui-inputtext">
          <button pButton icon="fa-magnifier" class="ui-button-success"></button>
          <button pButton icon="fa-close" type="button" *ngIf="searchTerm" (click)="clear()" class="ui-button-warning"></button>
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
  previousSelectedState: State;
  showArchive: boolean;
  archiveQuarters: SelectItem[];
  selectedQuarter: string;
  isStaffMember: boolean;

  constructor(private translate: TranslateService, private definitionsService: DefinitionsService,
              private resourceService: ResourceService, private userService: UserService) {
    this.definitions = definitionsService.getDefinitions();
  }

  ngOnInit(): void {
    const states = {
      BOARD: ['DRAFT', 'ACCEPTED', 'REJECTED'],
      POST: ['DRAFT', 'SUSPENDED', 'PENDING', 'ACCEPTED', 'EXPIRED', 'REJECTED', 'WITHDRAWN']
    };

    this.translate.get('definitions.state').subscribe(stateTranslations => {
      if (states[this.resourceScope]) {
        this.states = states[this.resourceScope].map(state => ({value: state, label: stateTranslations[state][this.resourceScope]}));
      }
    });

    this.userService.user$.subscribe(user => {
      this.isStaffMember = user && (user.postCreator || user.departmentAdministrator);
      if (this.isStaffMember && this.resourceScope) {
        this.resourceService.getArchiveQuarters(this.resourceScope)
          .subscribe(quarters => {
            this.archiveQuarters = quarters.map(quarter => {
              const year = quarter.slice(0, 4);
              const quarterDigit = quarter[4];
              return {value: quarter, label: year + '/' + quarterDigit}
            });
          })
      }
    });

  }

  clear() {
    this.searchTerm = null;
    this.search();
  }

  search() {
    if (this.previousSelectedState === this.selectedState) {
      this.selectedState = undefined;
    }

    this.previousSelectedState = this.selectedState;
    this.applied.emit({searchTerm: this.searchTerm, state: this.selectedState, quarter: this.selectedQuarter});
  }

  setShowArchive(show) {
    this.showArchive = show;
    if (!show) {
      this.selectedQuarter = null;
      this.search();
    }
  }
}

export interface EntityFilter {
  searchTerm?: string;
  state?: State;
  quarter?: string;
  includePublic?: boolean;
  parentId?: number;
}
