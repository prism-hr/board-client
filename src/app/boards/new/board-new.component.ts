import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {AuthGuard} from '../../authentication/auth-guard.service';
import {Utils} from '../../services/utils';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import MemberCategory = b.MemberCategory;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  applicationUrl: string;
  board: BoardDTO;
  boardForm: FormGroup;
  departmentSuggestions: DepartmentRepresentation[];
  availableMemberCategories: MemberCategory[];
  selectedDepartment: DepartmentRepresentation;
  user: UserRepresentation;

  constructor(private router: Router, private route: ActivatedRoute, private title: Title, private resourceService: ResourceService,
              private fb: FormBuilder, private definitionsService: DefinitionsService, private userService: UserService,
              private authGuard: AuthGuard) {
    this.applicationUrl = this.definitionsService.getDefinitions()['applicationUrl'];
    this.availableMemberCategories = definitionsService.getDefinitions()['memberCategory'];
    this.boardForm = this.fb.group({
      department: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.maxLength(1000)]],
      postCategories: [[]],
      memberCategories: this.fb.array(this.availableMemberCategories.map(c => [false])),
      documentLogo: []
    });
  }

  get memberCategories(): FormArray {
    return this.boardForm.get('memberCategories') as FormArray;
  };

  ngOnInit() {
    this.title.setTitle('New board');
    this.route.queryParams.subscribe(params => {
      if (params['prepopulate']) {
        const prepopulateDetails = JSON.parse(localStorage.getItem('newBoardPrepopulate'));
        if (prepopulateDetails) {
          this.boardForm.patchValue({
            name: prepopulateDetails.name,
            department: {name: prepopulateDetails.departmentName}
          });
          this.departmentChosen();
        }
      }
    });

    this.userService.user$.subscribe(user => {
      this.user = user;
    })
  }

  submit() {
    this.boardForm['submitted'] = true;
    if (this.boardForm.invalid) {
      return;
    }

    this.authGuard.ensureAuthenticated({modalType: 'register'}).first() // open dialog if not authenticated
      .subscribe(authenticated => {
        if (!authenticated) {
          return;
        }

        const board: BoardDTO = _.pick(this.boardForm.value, ['name', 'summary', 'postCategories', 'documentLogo']);
        let department = this.boardForm.get('department').value;
        if (typeof department === 'object') {
          department = _.pick(department, ['id', 'name']);
        } else {
          department = {name: department};
        }
        board.department = department;
        board.department.memberCategories = Utils
          .checkboxFromFormFormat(this.availableMemberCategories, this.boardForm.get('memberCategories').value);
        board.department.documentLogo = board.documentLogo;

        this.resourceService.postBoard(board)
          .flatMap(savedBoard => {
            return this.userService.loadUser().then(() => savedBoard);
          })
          .subscribe(saved => {
            this.router.navigate([saved.department.university.handle, saved.department.handle, saved.handle]);
          }, (error: Response) => {
            if (error.status === 409) {
              if (error.json().exceptionCode === 'DUPLICATE_BOARD') {
                this.boardForm.get('name').setErrors({duplicateBoard: true});
              }
            }
          });
      });
  }

  searchDepartments(event) {
    this.resourceService.getResources('DEPARTMENT', event.query).subscribe((departments: DepartmentRepresentation[]) => {
      this.departmentSuggestions = departments;
    })
  }

  departmentChosen() {
    const departmentName = this.boardForm.get('department').value.name;
    if (departmentName) {
      this.resourceService.getResources('DEPARTMENT', departmentName).subscribe((departments: DepartmentRepresentation[]) => {
        this.selectedDepartment = departments.find(d => d.name === departmentName);
      });
    }

  }
}
