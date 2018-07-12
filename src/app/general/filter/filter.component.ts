import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SelectItem} from 'primeng/components/common/selectitem';
import {Subject} from 'rxjs/index';
import {takeUntil} from 'rxjs/operators';
import {PostService} from '../../posts/post.service';
import {DefinitionsService} from '../../services/definitions.service';
import {UserService} from '../../services/user.service';
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
            <div class="dropdown-select">
              <p-dropdown [options]="archiveQuarters" [(ngModel)]="selectedQuarter"
                          (onChange)="search()" name="quarter"></p-dropdown>
            </div>
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
export class FilterComponent implements OnInit, OnChanges, OnDestroy {

  @Input() stateCategory: string;
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
  destroyStreams$ = new Subject();

  constructor(private translate: TranslateService, private definitionsService: DefinitionsService,
              private postService: PostService, private userService: UserService) {
    this.definitions = definitionsService.getDefinitions();
  }

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this.destroyStreams$))
      .subscribe(user => {
        this.isStaffMember = user && (user.postCreator || user.departmentAdministrator);
        if (this.isStaffMember && this.stateCategory) {
          this.postService.getArchiveQuarters()
            .pipe(takeUntil(this.destroyStreams$))
            .subscribe(quarters => {
              this.archiveQuarters = quarters.map(quarter => {
                const year = quarter.slice(0, 4);
                const quarterDigit = quarter[4];
                return {value: quarter, label: year + '/' + quarterDigit}
              });
            });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedState = null;
    this.showArchive = this.stateCategory === 'ARCHIVED';
    this.selectedQuarter = this.showArchive ? this.archiveQuarters[0].value : null;
    this.translate.get('definitions.state').subscribe(stateTranslations => {
      const availableStates = stateFilterConfigurations[this.stateCategory].states;
      this.states = availableStates && availableStates.map(state => ({
        value: state,
        label: stateTranslations[state].POST
      }));
      this.selectedState = availableStates ? availableStates[0] : null;
      this.search();
    });
  }

  ngOnDestroy(): void {
    this.destroyStreams$.next();
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

}

export interface EntityFilter {
  searchTerm?: string;
  state?: State;
  quarter?: string;
  includePublic?: boolean;
  parentId?: number;
}

export const stateFilterConfigurations: { [index: string]: { label: string, states: State[] } } = {
  ACTIVE: {
    label: 'Active',
    states: [
      'ACCEPTED', 'PENDING'
    ]
  },
  REVIEW: {
    label: 'Under Review',
    states: [
      'DRAFT', 'SUSPENDED'
    ]
  },
  INACTIVE: {
    label: 'Inactive',
    states: [
      'EXPIRED', 'REJECTED', 'WITHDRAWN'
    ]
  },
  ARCHIVED: {label: 'Archived', states: null}
};
