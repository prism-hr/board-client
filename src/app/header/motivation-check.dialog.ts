import {MdDialogRef} from '@angular/material';
import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  template: `
    <h3 class="text-aline-center hide-xs hide-sm">
      Select User
    </h3>
    <div layout="column" layout-align="space-between stretch">
        <button md-button class="md-primary md-raised" (click)="navigateTo('/boards')">
            Student
        </button>
        <button md-button class="md-accent md-hue-2 md-raised" (click)="navigateTo('/boards')">
            University
        </button>
        <button md-button class="md-warn md-raised" (click)="navigateTo('/boards')">
            Employer
        </button>
    </div>
  `
})
export class MotivationCheckDialog {

  constructor(private dialogRef: MdDialogRef<MotivationCheckDialog>, private router: Router) {
  }

  navigateTo(target) {
    this.dialogRef.close();
      this.router.navigate([target]);
  }

}
