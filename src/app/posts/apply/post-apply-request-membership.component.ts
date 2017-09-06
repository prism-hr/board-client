import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {PostService} from '../post.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRoleDTO = b.UserRoleDTO;

@Component({
  selector: 'b-post-apply-request-membership',
  template: `
    <h2>Request membership for {{post.board.department.name}}</h2>
    <form [formGroup]="membershipForm" novalidate>
      <div>
        <label for="category">Which category describes you best?</label>
        <p-dropdown id="category" formControlName="category" [options]="memberCategoryOptions"
                    placeholder="Select a category" (onChange)="categoryChanged($event)"></p-dropdown>
        <control-messages [control]="membershipForm.get('category')"></control-messages>
      </div>

      <div *ngIf="membershipForm.get('category').value">
        <div class="input-holder">
          <label>{{expiryLabel | translate}}</label>
          <p-calendar formControlName="expiryDate" dateFormat="yy-mm-dd" dataType="string"></p-calendar>
          <control-messages [control]="membershipForm.get('expiryDate')"></control-messages>
        </div>
      </div>
    </form>
    <button pButton (click)="submit()" class="ui-button-success" label="Submit"></button>
  `,
  styles: [`
  `]
})
export class PostApplyRequestMembershipComponent implements OnInit {

  @Input() department: DepartmentRepresentation & {};
  @Output() requested: EventEmitter<boolean> = new EventEmitter();
  membershipForm: FormGroup;
  memberCategoryOptions: { label: string, value: any }[];
  expiryLabel: string;

  constructor(private fb: FormBuilder, private translate: TranslateService, private postService: PostService) {
    this.membershipForm = this.fb.group({
      expiryDate: [],
      category: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.translate.get('definitions.memberCategory').subscribe(categoryTranslations => {
      this.memberCategoryOptions = this.department.memberCategories.map(c => ({label: categoryTranslations[c], value: c}));
    });
  }

  categoryChanged(event) {
    if (event.value === 'RESEARCH_STAFF') {
      this.expiryLabel = 'When does your contract finish?';
    } else {
      this.expiryLabel = 'When do you graduate?';
    }
  }

  submit() {
    const form = this.membershipForm;
    form['submitted'] = true;
    if (form.invalid) {
      return;
    }
    const userRoleDTO: UserRoleDTO = {expiryDate: form.get('expiryDate').value, categories: [form.get('category').value]};
    this.postService.requestDepartmentMembership(this.department, userRoleDTO).subscribe(() => {
      this.requested.emit(true);
    });
  }

}
