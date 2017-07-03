import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';

@Component({
  selector: 'b-home-public',
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent implements OnInit {

  boardForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authGuard: AuthGuard) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      departmentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
  }

  submit() {
    this.authGuard.ensureAuthenticated(true).first() // open dialog if not authenticated
      .subscribe(authenticated => {
        if (!authenticated) {
          return;
        }
        localStorage.setItem('newBoardPrepopulate', JSON.stringify(this.boardForm.value));
        this.router.navigate(['newBoard'], {queryParams: {prepopulate: true}});
      });
  }

}
