import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {DefinitionsService} from '../../services/definitions.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {AuthGuard} from '../../authentication/auth-guard.service';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  selector: 'board-new',
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  departments: DepartmentDTO[];
  selectedDepartment: DepartmentDTO;
  board: BoardDTO;
  newDepartment: Boolean;
  boardForm: FormGroup;
  applicationUrl: string;

  constructor(private router: Router, private route: ActivatedRoute, private http: Http, private fb: FormBuilder,
              private definitionsService: DefinitionsService, private authGuard: AuthGuard) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      purpose: ['', [Validators.required, Validators.maxLength(2000)]],
      postCategories: [[]],
      department: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
        memberCategories: [[]],
        documentLogo: []
      }),
      // selectedDepartment: ['', Validators.required],
      handles: this.fb.group({
        departmentHandle: ['', [Validators.required, Validators.maxLength(15)]],
        boardHandle: ['', [Validators.required, Validators.maxLength(15)]]
      })
    });
    this.newDepartment = true; // department select turned off
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params['prepopulate']) {
          const prepopulateDetails = JSON.parse(localStorage.getItem("newBoardPrepopulate"));
          if (prepopulateDetails) {
            this.boardForm.patchValue({
              name: prepopulateDetails.name,
              department: {name: prepopulateDetails.departmentName}
            })
          }
        }
      });
    // this.departments = this.route.snapshot.data['departments'];
    // this.departments.push({name: "Create a new department"});
    this.applicationUrl = this.definitionsService.getDefinitions().applicationUrl;
  }

  cancelNewDepartment() {
    this.newDepartment = null;
    this.boardForm.patchValue({selectedDepartment: null, department: {name: ''}});
    this.boardForm.reset();
  }

  submit() {
    let board: BoardDTO = _.pick(this.boardForm.value, ['name', 'purpose', 'postCategories', 'department']);
    board = Object.assign({}, board);
    board.handle = this.boardForm.value.handles.boardHandle;
    board.department.handle = this.boardForm.value.handles.departmentHandle;
    this.authGuard.ensureAuthenticated(true) // open dialog if not authenticated
      .subscribe(authenticated => {
        if (!authenticated) {
          return;
        }
        this.http.post('/api/boards', board)
          .subscribe(res => {
            const saved: BoardRepresentation = res.json();
            this.router.navigate([saved.department.handle, saved.handle]);
          }, (error: Response) => {
            if (error.status === 422) {
              if (error.json().exceptionCode === 'DUPLICATE_DEPARTMENT_HANDLE') {
                (this.boardForm.controls['handles'] as FormGroup).controls['departmentHandle'].setErrors({duplicateHandle: true});
              } else if (error.json().exceptionCode === 'DUPLICATE_BOARD_HANDLE') {
                (this.boardForm.controls['handles'] as FormGroup).controls['boardHandle'].setErrors({duplicateHandle: true});
              }
            }
          });
      });
  }

  departmentSelected() {
    const selected: DepartmentRepresentation = this.boardForm.value.selectedDepartment;
    const departmentHandle: FormControl = this.boardForm.controls['handles']['controls'].departmentHandle;
    if (selected.id) {
      this.boardForm.patchValue({department: selected, handles: {departmentHandle: selected.handle}});
      departmentHandle.disable();
      this.newDepartment = false;
    } else {
      this.newDepartment = true;
      this.boardForm.patchValue({department: {name: ''}, handles: {departmentHandle: ''}});
      departmentHandle.enable();
    }
  }
}
