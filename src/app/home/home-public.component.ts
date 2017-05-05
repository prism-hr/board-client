import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';

@Component({
  selector: 'b-home-public',
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent {

  boardForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authGuard: AuthGuard) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      departmentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  submit() {
    this.authGuard.ensureAuthenticated(true) // open dialog if not authenticated
      .subscribe(authenticated => {
        if (!authenticated) {
          return;
        }
        localStorage.setItem('newBoardPrepopulate', JSON.stringify(this.boardForm.value));
        this.router.navigate(['newBoard'], {queryParams: {prepopulate: true}});
      });
  }

}
