import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ResourceService} from '../services/resource.service';
import UniversityRepresentation = b.UniversityRepresentation;

@Component({
  selector: 'b-home-public',
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent {

  departmentForm: FormGroup;
  universitySuggestions: UniversityRepresentation[];

  constructor(private router: Router, private fb: FormBuilder, private resourceService: ResourceService) {
    this.departmentForm = this.fb.group({
      university: [null, Validators.required],
      departmentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  submit() {
    this.departmentForm['submitted'] = true;
    if (this.departmentForm.invalid) {
      return;
    }
    const university = this.departmentForm.get('university').value;
    const departmentName: string = this.departmentForm.get('departmentName').value;
    localStorage.setItem('newDepartmentPrepopulate', JSON.stringify({university, departmentName}));
    this.router.navigate(['newDepartment'], {queryParams: {prepopulate: true}});
  }

  searchUniversities(event) {
    this.resourceService.lookupResources('UNIVERSITY', event.query).subscribe((universities: UniversityRepresentation[]) => {
      this.universitySuggestions = universities;
    });
  }

  universityOnBlur() {
    const universityField = this.departmentForm.get('university');
    if (typeof universityField.value === 'string') {
      universityField.setValue(null);
    }
  }

}
