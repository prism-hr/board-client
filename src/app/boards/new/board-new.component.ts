import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  applicationUrl: string;
  availableMemberCategories: string[];
  board: BoardDTO;
  boardForm: FormGroup;
  departmentSuggestions: string[];
  selectedDepartment: DepartmentRepresentation;

  constructor(private router: Router, private route: ActivatedRoute, private resourceService: ResourceService, private fb: FormBuilder,
              private definitionsService: DefinitionsService) {
    this.applicationUrl = this.definitionsService.getDefinitions()['applicationUrl'];
    this.availableMemberCategories = definitionsService.getDefinitions()['memberCategory'];
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.maxLength(1000)]],
      postCategories: [[]],
      documentLogo: [],
      department: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        memberCategories: [[]]
      })
    });
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params['prepopulate']) {
          const prepopulateDetails = JSON.parse(localStorage.getItem('newBoardPrepopulate'));
          if (prepopulateDetails) {
            this.boardForm.patchValue({
              name: prepopulateDetails.name,
              department: {name: prepopulateDetails.departmentName}
            });
          }
        }
      });
  }

  submit() {
    this.boardForm['submitted'] = true;
    if (this.boardForm.invalid) {
      return;
    }
    const board: BoardDTO = _.pick(this.boardForm.value, ['name', 'summary', 'postCategories', 'documentLogo', 'department']);
    board.department.documentLogo = board.documentLogo;

    this.resourceService.postBoard(board)
      .subscribe(saved => {
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
  }

  searchDepartments(event) {
    this.resourceService.getDepartments(event.query).subscribe((departments: DepartmentRepresentation[]) => {
      this.departmentSuggestions = departments.map(d => d.name);
    })
  }

  departmentChosen() {
    const departmentName = this.boardForm.get('department').get('name').value;
    if (departmentName) {
      this.resourceService.getDepartments(departmentName).subscribe((departments: DepartmentRepresentation[]) => {
        this.selectedDepartment = departments.find(d => d.name === departmentName);
      });
    }

  }

}
