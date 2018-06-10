import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {ValidationUtils} from '../../../validation/validation.utils';
import {PostService} from '../../post.service';
import PostRepresentation = b.PostRepresentation;

@Component({
  selector: 'b-post-apply-form',
  template: `
    <form [formGroup]="eventForm" novalidate>
      <div class="grid">
        <div class="grid__item one-whole input-holder">
          <b-file-upload formControlName="documentResume" type="document" class="uploader"></b-file-upload>
          <control-messages [control]="eventForm.get('documentResume')"></control-messages>
        </div>
        <div class="grid__item one-whole input-holder">
          <label>Covering Note</label>
          <p-editor formControlName="coveringNote" [style]="{'height':'150px'}">
            <p-header>
                <span class="ql-formats">
                  <button class="ql-bold"></button>
                  <button class="ql-italic"></button>
                  <button class="ql-underline"></button>
                </span>
              <span class="ql-formats">
                  <button class="ql-list" value="ordered" aria-label="Ordered List"></button>
                  <button class="ql-list" value="bullet" aria-label="Unordered List"></button>
                </span>
            </p-header>
          </p-editor>
          <control-messages [control]="eventForm.get('coveringNote')"></control-messages>
        </div>
        <div class="grid__item one-whole input-holder">
          <label>Your Resume URL</label>
          <input pInputText type="url" formControlName="websiteResume" id="websiteResume">
          <control-messages [control]="eventForm.get('websiteResume')"></control-messages>
        </div>
        <control-messages [control]="eventForm"></control-messages>
        <div class="grid__item one-whole input-holder">
          <div class="ui-checkbox-inline">
            <p-checkbox formControlName="defaultResume" [binary]="true" label="Save Resume as default"></p-checkbox>
          </div>
        </div>
      </div>
    </form>
    <div fxLayout="row" fxLayoutAlign="space-between center">
      <button pButton (click)="submit()" class="ui-button-success" label="Submit"></button>
    </div>
  `,
  styles: [`
  `]
})
export class PostApplyFormComponent implements OnInit, OnDestroy {
  @Input() post: PostRepresentation & {};
  @Output() applied: EventEmitter<boolean> = new EventEmitter();
  eventForm: FormGroup;
  private userSubscription: Subscription;

  constructor(private fb: FormBuilder, private postService: PostService, private userService: UserService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.user$.subscribe(user => {
      if (user) {
        const coveringNoteValidators = [Validators.maxLength(1000)];
        if (this.post.applyEmail) {
          coveringNoteValidators.push(Validators.required);
        }
        this.eventForm = this.fb.group({
          defaultResume: [true],
          documentResume: [user.documentResume, Validators.required],
          websiteResume: [user.websiteResume, ValidationUtils.urlValidator],
          coveringNote: [null, coveringNoteValidators]
        });
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  submit() {
    const form = this.eventForm;
    form['submitted'] = true;
    if (form.invalid) {
      return;
    }
    this.postService.respond(this.post, form.value).subscribe(response => {
      this.applied.emit(true);
    });
  }


}
