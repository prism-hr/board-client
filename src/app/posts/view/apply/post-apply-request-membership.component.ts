import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {pick} from 'lodash';
import {SelectItem} from 'primeng/components/common/selectitem';
import {DepartmentService} from '../../../departments/department.service';
import {DefinitionsService} from '../../../services/definitions.service';
import {ResourceService} from '../../../services/resource.service';
import {Utils} from '../../../services/utils';
import {PostService} from '../../post.service';
import AgeRange = b.AgeRange;
import Gender = b.Gender;
import PostRepresentation = b.PostRepresentation;
import UserDTO = b.UserDTO;
import UserRoleDTO = b.UserRoleDTO;
import MemberDTO = b.MemberDTO;

@Component({
  selector: 'b-post-apply-request-membership',
  template: `
    <div *ngIf="!canPursue">
      <p-messages
        [value]="[{severity:'info', detail:'Please provide your personal information. We collect this so we can ' +
         'monitor trends and improve the relevance of posts. We never share it with advertisers.'}]"
        [closable]="false"></p-messages>
    </div>
    <div *ngIf="canPursue">
      <p-messages
        [value]="[{severity:'info', detail:'Please update your personal information. We maintain this so we can ' +
         'monitor trends and improve the relevance of posts. We never share it with advertisers.'}]"
        [closable]="false"></p-messages>
    </div>
    <form [formGroup]="membershipForm" novalidate>
      <div class="grid">
        <div *ngIf="requireUserDemographicData">
          <div class="grid__item small--one-whole medium-up--one-whole input-holder">
            <div class="ui-radiobutton-inline">
              <p-radioButton *ngFor="let gender of availableGenders"
                             [value]="gender" [label]="'definitions.gender.' + gender | translate" name="gender"
                             formControlName="gender" class="{{gender | lowercase}}"></p-radioButton>
            </div>
            <control-messages [control]="membershipForm.get('gender')"></control-messages>
          </div>
          <div class="grid__item small--one-whole medium-up--one-whole input-holder">
            <div class="ui-radiobutton-inline">
              <p-radioButton *ngFor="let ageRange of availableAgeRanges"
                             [value]="ageRange" [label]="'definitions.ageRange.' + ageRange | translate" name="ageRange"
                             formControlName="ageRange" class="{{ageRange | lowercase}}"></p-radioButton>
            </div>
            <control-messages [control]="membershipForm.get('ageRange')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder clearfix">
            <label>Home Town</label>
            <b-places-autocomplete formControlName="locationNationality"></b-places-autocomplete>
            <control-messages [control]="membershipForm.get('locationNationality')"></control-messages>
          </div>
        </div>

        <div *ngIf="requireUserRoleDemographicData">

          <div class="grid__item small--one-whole medium-up--one-half input-holder dropdown-select">
            <label for="category">Which category describes you best?</label>
            <p-dropdown id="category" formControlName="memberCategory" [options]="memberCategoryOptions"
                        placeholder="Select a category" inputId="category"></p-dropdown>
            <control-messages [control]="membershipForm.get('memberCategory')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder dropdown-select">
            <label for="memberProgram">Program Name</label>
            <p-autoComplete formControlName="memberProgram" [suggestions]="programSuggestions" (completeMethod)="searchPrograms($event)"
                            inputId="memberProgram" placeholder="Start typing to see suggestions"></p-autoComplete>
            <control-messages [control]="membershipForm.get('memberProgram')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder dropdown-select">
            <label for="memberYear">Year of study</label>
            <div style="margin-top: 6px; margin-bottom: 10px;">
              <p-selectButton [options]="availableYears" formControlName="memberYear" styleClass="ui-button-info"></p-selectButton>
            </div>
            <control-messages [control]="membershipForm.get('memberYear')"></control-messages>
          </div>

          <div *ngIf="membershipForm.get('memberCategory').value" class="grid__item small--one-whole medium-up--one-half input-holder">
            <label style="display: block">{{expiryLabel}}</label>
            <p-calendar formControlName="expiryDate" dateFormat="yy-mm-dd" dataType="string" [minDate]="tomorrow"
                        [yearNavigator]="true" [monthNavigator]="true" [yearRange]="yearRange"></p-calendar>
            <control-messages [control]="membershipForm.get('expiryDate')"></control-messages>
          </div>

        </div>
      </div>
      <button pButton (click)="submit()" class="ui-button-success" label="Submit"></button>
    </form>
  `,
  styles: [`
  `]
})
export class PostApplyRequestMembershipComponent implements OnInit {

  @Input() post: PostRepresentation & {};
  @Output() requested: EventEmitter<boolean> = new EventEmitter();
  membershipForm: FormGroup;
  memberCategoryOptions: { label: string, value: any }[];
  tomorrow: Date;
  availableYears: SelectItem[];
  availableGenders: Gender[];
  availableAgeRanges: AgeRange[];
  programSuggestions: string[];
  canPursue: boolean;
  yearRange = Utils.getYearRange();

  constructor(private fb: FormBuilder, private translate: TranslateService, private postService: PostService,
              private resourceService: ResourceService, private departmentService: DepartmentService,
              private definitionsService: DefinitionsService) {
    this.availableYears = Array.from({length: 9}, (_, k) => k).map((_, i) => i + 1)
      .map(i => ({label: '' + i, value: i}));
    this.availableGenders = definitionsService.getDefinitions()['gender'];
    this.availableAgeRanges = definitionsService.getDefinitions()['ageRange'];
  }

  ngOnInit() {
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      this.memberCategoryOptions = this.post.memberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });

    this.canPursue = this.resourceService.canPursue(this.post);
    const readiness = this.post.responseReadiness;
    this.membershipForm = this.fb.group({
      gender: [null, this.requireUserDemographicData && Validators.required],
      ageRange: [null, this.requireUserDemographicData && Validators.required],
      locationNationality: [null, this.requireUserDemographicData && Validators.required],
      memberCategory: [readiness.memberCategory, this.requireUserRoleDemographicData && Validators.required],
      memberProgram: [readiness.memberProgram, this.requireUserRoleDemographicData && Validators.required],
      memberYear: [readiness.memberYear, this.requireUserRoleDemographicData && Validators.required],
      expiryDate: [readiness.expiryDate, this.requireUserRoleDemographicData && Validators.required]
    });
  }

  get department() {
    return this.post.board.department;
  }

  get requireUserRoleDemographicData() {
    return this.post.responseReadiness.requireMemberData;
  }

  get requireUserDemographicData() {
    return this.post.responseReadiness.requireUserData;
  }

  get expiryLabel() {
    if (this.membershipForm.get('memberCategory').value === 'RESEARCH_STAFF') {
      return 'When will your contract come to an end?';
    }
    return 'When will you graduate?';
  }

  searchPrograms(event) {
    this.departmentService.searchPrograms(this.department, {searchTerm: event.query}).subscribe(programs => {
      this.programSuggestions = programs;
    });
  }

  submit() {
    const form = this.membershipForm;
    form['submitted'] = true;
    if (form.invalid) {
      return;
    }

    const userDTO: UserDTO = pick(form.value, ['gender', 'ageRange', 'locationNationality']);
    const memberDTO: MemberDTO = {
      user: userDTO,
      ...pick(form.value, ['memberCategory', 'memberProgram', 'memberYear', 'expiryDate'])
    };
    this.postService.requestDepartmentMembership(this.department, memberDTO, this.canPursue).subscribe(() => {
      this.requested.emit(true);
    });
  }

}
