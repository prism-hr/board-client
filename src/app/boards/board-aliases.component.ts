import {Component, OnInit, Input} from '@angular/core';
import {DefinitionsService} from '../services/definitions.service';
import {FormGroupName, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'board-aliases',
  template: `
    <div [formGroup]="formGroupName.control">
      <md-input-container class="md-block">
        <input mdInput name="applicationUrl" value="{{applicationUrl}}" disabled>
      </md-input-container>
      /
      <md-input-container class="md-block">
        <input mdInput formControlName="departmentHandle" placeholder="Department alias" required>
      </md-input-container>
      <control-messages [control]="formGroupName.control.controls.departmentHandle"></control-messages>

      <span *ngIf="!hideBoard">
        /
        <md-input-container class="md-block">
          <input mdInput formControlName="boardHandle" placeholder="Board alias" required>
        </md-input-container>
        <control-messages [control]="formGroupName.control.controls.boardHandle"></control-messages>
      </span>
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
