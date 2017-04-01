import {Component, OnInit, Input} from '@angular/core';
import {DefinitionsService} from '../services/definitions.service';
import {FormGroupName, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'board-aliases',
  template: `
    <div [formGroup]="formGroupName.control" class="grid url-builder">
      <div class="grid__item one-third">
        <md-input-container class="md-block">
          <input mdInput name="applicationUrl" value="{{applicationUrl}}" disabled>
        </md-input-container>
        <span class="separator-right">/</span>
      </div>
      <div class="grid__item one-third">
        <md-input-container class="md-block">
          <input mdInput formControlName="departmentHandle" placeholder="Department alias" required>
        </md-input-container>
        <control-messages [control]="formGroupName.control.controls.departmentHandle"></control-messages>
      </div>
      <div class="grid__item one-third" *ngIf="!hideBoard">
        <span class="separator-left">/</span>
        <md-input-container class="md-block">
          <input mdInput formControlName="boardHandle" placeholder="Board alias" required>
        </md-input-container>
        <control-messages [control]="formGroupName.control.controls.boardHandle"></control-messages>
      </div>
    </div>
    `,
  styleUrls: [],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: BoardAliasesComponent, multi: true}
  ]
})
export class BoardAliasesComponent implements OnInit {
  @Input() disableDepartment: boolean;
  @Input() hideBoard: boolean;
  applicationUrl: string;

  constructor(private definitionsService: DefinitionsService, public formGroupName: FormGroupName) {
  }

  ngOnInit() {
    this.applicationUrl = this.definitionsService.getDefinitions().applicationUrl;
  }


}
