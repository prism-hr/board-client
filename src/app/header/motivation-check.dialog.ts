import {MdDialogRef} from '@angular/material';
import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  template: `
    <h3 class="center">
      Select User
    </h3>
    <div fxLayout="column">
        <button md-raised-button color="primary" (click)="navigateTo('/boards')">
            Student
        </button>
        <button md-raised-button color="accent" (click)="navigateTo('/boards')">
            University
        </button>
        <button md-raised-button color="warn" (click)="navigateTo('/boards')">
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
