import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {DefinitionsService} from '../../services/definitions.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  board: BoardDTO;
  boardForm: FormGroup;
  applicationUrl: string;

  constructor(private router: Router, private route: ActivatedRoute, private http: Http, private fb: FormBuilder,
              private definitionsService: DefinitionsService) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      postCategories: [[]],
      department: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
        memberCategories: [[]],
        documentLogo: []
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
    this.applicationUrl = this.definitionsService.getDefinitions()['applicationUrl'];
  }

  submit() {
    const board: BoardDTO = _.pick(this.boardForm.value, ['name', 'description', 'postCategories', 'department']);

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
  }

}
