import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'home-public',
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent {

  boardForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      departmentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]]
    });
  }

  submit() {
    localStorage.setItem('newBoardPrepopulate', JSON.stringify(this.boardForm.value));
    this.router.navigate(['newBoard'], {queryParams: {prepopulate: true}});
  }

}
