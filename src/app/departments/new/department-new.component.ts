import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {pick} from 'lodash';
import {AuthGuard} from '../../authentication/auth-guard.service';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import DepartmentRepresentation = b.DepartmentRepresentation;
import UniversityRepresentation = b.UniversityRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'department-new.component.html',
  styleUrls: ['department-new.component.scss']
})
export class DepartmentNewComponent implements OnInit {
  department: DepartmentRepresentation;
  departmentForm: FormGroup;
  universitySuggestions: UniversityRepresentation[];
  user: UserRepresentation;
  customLogoUploaded: boolean;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private title: Title,
              private snackBar: MatSnackBar, private resourceService: ResourceService, private userService: UserService,
              private authGuard: AuthGuard) {
    this.departmentForm = this.fb.group({
      university: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      documentLogo: []
    });
  }

  get memberCategories(): FormArray {
    return this.departmentForm.get('memberCategories') as FormArray;
  };

  ngOnInit() {
    this.title.setTitle('New department');
    this.route.queryParams.subscribe(params => {
      if (params['prepopulate']) {
        const prepopulateDetails = JSON.parse(localStorage.getItem('newDepartmentPrepopulate'));
        if (prepopulateDetails) {
          this.departmentForm.patchValue({
            university: prepopulateDetails.university,
            name: prepopulateDetails.departmentName,
            documentLogo: prepopulateDetails.university.documentLogo
          });
        }
      }
    });

    this.userService.user$.subscribe(user => {
      this.user = user;
    })
  }

  submit() {
    this.departmentForm['submitted'] = true;
    if (this.departmentForm.invalid) {
      return;
    }

    this.authGuard.ensureAuthenticated({initialView: 'REGISTER'}).first() // open dialog if not authenticated
      .subscribe(authenticationOutcome => {
        if (!authenticationOutcome) {
          return;
        }

        const university = this.departmentForm.get('university').value;
        this.resourceService.postDepartment(university, pick(this.departmentForm.value, ['name', 'summary', 'documentLogo']))
          .flatMap(savedDepartment => {
            return this.userService.loadUser().then(() => savedDepartment);
          })
          .subscribe(department => {
            this.router.navigate(this.resourceService.routerLink(department))
              .then(() => {
                this.snackBar.open('Department Created!', null, {duration: 3000});
              });
          }, (error: HttpErrorResponse) => {
            this.handleErrors(error);
          });
      });

  }

  private handleErrors(error: HttpErrorResponse) {
    if (error.status === 409) {
      if (error.error.exceptionCode === 'DUPLICATE_DEPARTMENT') {
        this.departmentForm.get('name').setErrors({duplicateDepartment: true});
      }
    }
  }

  searchUniversities(event) {
    this.resourceService.lookupResources('UNIVERSITY', event.query).subscribe((universities: UniversityRepresentation[]) => {
      this.universitySuggestions = universities;
    });
  }

  universitySelected(value: UniversityRepresentation) {
    if(!this.customLogoUploaded) {
      this.departmentForm.get('documentLogo').setValue(value.documentLogo);
    }
  }

  logoUploaded() {
    this.customLogoUploaded = true;
  }

  universityOnBlur() {
    const universityField = this.departmentForm.get('university');
    if (typeof universityField.value === 'string') {
      universityField.setValue(null);
    }
  }

}
