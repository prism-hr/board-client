import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {SelectItem} from 'primeng/primeng';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import {PostService} from '../post.service';
import AgeRange = b.AgeRange;
import Gender = b.Gender;
import PostRepresentation = b.PostRepresentation;
import UserDTO = b.UserDTO;
import UserRoleDTO = b.UserRoleDTO;

@Component({
  selector: 'b-post-apply-request-membership',
  template: `
    <h2 style="margin-bottom: 20px;">Joining {{department.name}}</h2>
    <form [formGroup]="membershipForm" novalidate>
      <div class="grid">
        <div *ngIf="requireUserDemographicData">
          <div class="ui-radiobutton-inline">
            <p-radioButton *ngFor="let gender of availableGenders"
                           [value]="gender" [label]="'definitions.gender.' + gender | translate" name="gender"
                           formControlName="gender" class="{{gender | lowercase}}"></p-radioButton>
            <control-messages [control]="membershipForm.get('gender')"></control-messages>
          </div>

          <div class="ui-radiobutton-inline">
            <p-radioButton *ngFor="let ageRange of availableAgeRanges"
                           [value]="ageRange" [label]="'definitions.ageRange.' + ageRange | translate" name="ageRange"
                           formControlName="ageRange" class="{{ageRange | lowercase}}"></p-radioButton>
            <control-messages [control]="membershipForm.get('ageRange')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder">
            <label>Location</label>
            <b-places-autocomplete formControlName="locationNationality"></b-places-autocomplete>
            <control-messages [control]="membershipForm.get('locationNationality')"></control-messages>
          </div>
        </div>

        <div *ngIf="requireUserRoleDemographicData">

          <div class="grid__item small--one-whole medium-up--one-half input-holder dropdown-select">
            <label for="category">Which category describes you best?</label>
            <p-dropdown id="category" formControlName="memberCategory" [options]="memberCategoryOptions"
                        placeholder="Select a category" (onChange)="categoryChanged($event)"></p-dropdown>
            <control-messages [control]="membershipForm.get('memberCategory')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder dropdown-select">
            <label for="memberProgram">Program Name</label>
            <input pInputText placeholder="Program" formControlName="memberProgram">
            <control-messages [control]="membershipForm.get('memberProgram')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder dropdown-select">
            <label for="memberYear">Year of study</label>
            <p-selectButton [options]="availableYears" formControlName="memberYear"></p-selectButton>
            <control-messages [control]="membershipForm.get('memberYear')"></control-messages>
          </div>

          <div class="grid__item small--one-whole medium-up--one-half input-holder">
            <label style="display: block">{{expiryLabel | translate}}</label>
            <p-calendar formControlName="expiryDate" dateFormat="yy-mm-dd" dataType="string" [minDate]="tomorrow"></p-calendar>
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
  expiryLabel: string;
  tomorrow: Date;
  availableYears: SelectItem[];
  availableGenders: Gender[];
  availableAgeRanges: AgeRange[];

  constructor(private fb: FormBuilder, private translate: TranslateService, private postService: PostService,
              private resourceService: ResourceService, private definitionsService: DefinitionsService) {
    this.availableYears = Array.from({length: 9}, (_, k) => k).map((_, i) => i + 1)
      .map(i => ({label: '' + i, value: i}));
    this.availableGenders = definitionsService.getDefinitions()['gender'];
    this.availableAgeRanges = definitionsService.getDefinitions()['ageRange'];
  }

  ngOnInit() {
    this.tomorrow = moment().add(1, 'day').toDate();
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      this.memberCategoryOptions = this.department.memberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });

    this.membershipForm = this.fb.group({
      gender: [null, this.requireUserRoleDemographicData && Validators.required],
      ageRange: [null, this.requireUserRoleDemographicData && Validators.required],
      locationNationality: [null, this.requireUserRoleDemographicData && Validators.required],
      memberCategory: [null, this.requireUserRoleDemographicData && Validators.required],
      memberProgram: [null, this.requireUserRoleDemographicData && Validators.required],
      memberYear: [null, this.requireUserRoleDemographicData && Validators.required],
      expiryDate: [null, this.requireUserRoleDemographicData && Validators.required]
    });
  }

  get department() {
    return this.post.board.department;
  }

  get requireUserRoleDemographicData() {
    return this.post.responseReadiness.requireUserRoleDemographicData;
  }

  get requireUserDemographicData() {
    return this.post.responseReadiness.requireUserDemographicData;
  }

  categoryChanged(event) {
    if (event.value === 'RESEARCH_STAFF') {
      this.expiryLabel = 'When will your contract come to an end?';
    } else {
      this.expiryLabel = 'When will you graduate?';
    }
  }

  submit() {
    const form = this.membershipForm;
    form['submitted'] = true;
    if (form.invalid) {
      return;
    }
    const canPursue = this.resourceService.canPursue(this.post);
    const userDTO: UserDTO = _.pick(form.value, ['gender', 'ageRange', 'locationNationality']);
    const userRoleDTO: UserRoleDTO = {
      user: userDTO,
      ..._.pick(form.value, ['memberCategory', 'memberProgram', 'memberYear', 'expiryDate'])
    };
    this.postService.requestDepartmentMembership(this.department, userRoleDTO, canPursue).subscribe(() => {
      this.requested.emit(true);
    });
  }

}
