import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {PostService} from '../../posts/post.service';
import {UserService} from '../../services/user.service';
import {ValidationUtils} from '../../validation/validation.utils';
import PostApplyRepresentation = b.PostApplyRepresentation;
import PostRepresentation = b.PostRepresentation;

@Component({
  template: `
    <h2 *ngIf="apply.applyEmail" md-dialog-title>Apply for {{post.name}}</h2>
    <h2 *ngIf="!apply.applyEmail" md-dialog-title>Would you like to have your details be forwarded to the recruiter?</h2>
    <md-dialog-content>
      <form [formGroup]="eventForm" novalidate>
        <div class="grid__item one-whole input-holder">
          <b-file-upload formControlName="documentResume" type="document" class="uploader"></b-file-upload>
          <control-messages [control]="eventForm.get('documentResume')"></control-messages>
        </div>

        <div class="grid__item one-whole input-holder">
          <label>Your Resume URL</label>
          <input pInputText type="url" formControlName="websiteResume">
          <control-messages [control]="eventForm.get('websiteResume')"></control-messages>
        </div>

        <control-messages [control]="eventForm"></control-messages>

        <div class="grid__item one-whole">
          <label>Save Resume as default</label>
          <p-checkbox formControlName="defaultResume" [binary]="true"></p-checkbox>
        </div>

        <div *ngIf="apply.applyEmail" class="grid__item one-whole input-holder">
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

      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <button pButton (click)="submit()" class="ui-button-success" label="Submit"></button>
      <button *ngIf="!apply.applyEmail" pButton (click)="skip()" class="ui-button-warning" label="Skip"></button>
      <button pButton (click)="cancel()" class="ui-button-secondary" label="Cancel"></button>
    </md-dialog-actions>
  `,
  styles: [`
  `]
})
export class PostApplyDialogComponent implements OnInit {
  post: PostRepresentation;
  apply: PostApplyRepresentation;
  eventForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MdDialogRef<PostApplyDialogComponent>,
              @Inject(MD_DIALOG_DATA) data: any, private postService: PostService, private userService: UserService) {
    this.post = data.post;
    this.apply = data.apply;
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      const coveringNoteValidators = [Validators.maxLength(1000)];
      if (this.apply.applyEmail) {
        coveringNoteValidators.push(Validators.required);
      }
      this.eventForm = this.fb.group({
        defaultResume: [true],
        documentResume: [user.documentResume, Validators.required],
        websiteResume: [user.websiteResume, ValidationUtils.urlValidator],
        coveringNote: [null, coveringNoteValidators]
      });
    });
  }

  submit() {
    const form = this.eventForm;
    form['submitted'] = true;
    if (form.invalid) {
      return;
    }
    this.postService.respond(this.post, form.value).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  skip() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
