import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthGuard} from '../authentication/auth-guard.service';
import {ResourceService} from '../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  selector: 'b-home-public',
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent implements OnInit {

  boardForm: FormGroup;
  departmentSuggestions: DepartmentRepresentation[];

  constructor(private router: Router, private fb: FormBuilder, private authGuard: AuthGuard, private resourceService: ResourceService) {
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

  searchDepartments(event) {
    this.resourceService.getDepartments(event.query).subscribe((departments: DepartmentRepresentation[]) => {
      this.departmentSuggestions = departments;
    })
  }

  departmentSelected(event) {
    this.boardForm.get('departmentName').setValue(event.name);
  }

}
