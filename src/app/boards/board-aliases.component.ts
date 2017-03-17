import {Component, OnInit, Input} from '@angular/core';
import {DefinitionsService} from '../services/definitions.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'board-aliases',
  template: `
    <md-input-container class="md-block">
      <input mdInput name="applicationUrl" [(ngModel)]="applicationUrl"
             disabled required>
    </md-input-container>

    <md-input-container class="md-block">
      <input mdInput placeholder="Department alias" name="departmentHandle" [(ngModel)]="department.handle"
             [disabled]="department.id" required>
    </md-input-container>

    <md-input-container class="md-block">
      <input mdInput placeholder="Board alias" name="boardHandle" [(ngModel)]="boardSettings.handle"
             nameTaken="dupa"
             required>
    </md-input-container>
    `,
  styleUrls: []
})
export class BoardAliasesComponent implements OnInit {
  @Input() boardSettings: any;
  @Input() department: any;
  @Input() form: NgForm;
  private applicationUrl: string;

  constructor(private definitionsService: DefinitionsService) {
  }

  ngOnInit() {
    this.applicationUrl = this.definitionsService.getDefinitions().applicationUrl;
    this.form.statusChanges
      .subscribe(status => {
        console.log(status);
      })
  }


}
