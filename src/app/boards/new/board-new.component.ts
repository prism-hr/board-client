import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {DefinitionsService} from '../../services/definitions.service';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import * as _ from 'lodash';

@Component({
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  departments: DepartmentDTO[];
  selectedDepartment: DepartmentDTO;
  board: BoardDTO;
  newDepartment: boolean;
  boardForm: FormGroup;
  applicationUrl: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private fb: FormBuilder,
              private definitionsService: DefinitionsService) {
    this.boardForm = this.fb.group({
      name: ['', [Validators.minLength(3), Validators.required, Validators.maxLength(255)]],
      purpose: ['', Validators.maxLength(2000)],
      settings: this.fb.group({
        postCategories: [[]],
      }),
      department: this.fb.group({
        name: ['', [Validators.minLength(3), Validators.required, Validators.maxLength(255)]],
        memberCategories: [[]]
      }),
      selectedDepartment: ['', Validators.required],
      handles: this.fb.group({
        departmentHandle: ['', [Validators.required, Validators.maxLength(15)]],
        boardHandle: ['', [Validators.required, Validators.maxLength(15)]]
      })
    })
  }

  ngOnInit() {
    this.departments = this.route.snapshot.data['departments'];
    this.departments.push({name: "Create a new department"});
    this.applicationUrl = this.definitionsService.getDefinitions().applicationUrl;
  }

  submit() {
    let board: BoardDTO = _.pick(this.boardForm.value, ['name', 'purpose', 'settings', 'department']);
    board = Object.assign({}, board);
    board.department.handle = this.boardForm.value.handles.departmentHandle;
    board.settings.handle = this.boardForm.value.handles.boardHandle;
    this.http.post('/api/boards', board)
      .subscribe(res => {
        this.router.navigate(['/manage/board', res.json().id, 'view']);
      });
  }

  departmentSelected() {
    const selected = this.boardForm.value.selectedDepartment;
    if (selected.id) {
      this.boardForm.patchValue({department: selected});
    } else {
      this.newDepartment = true;
      this.boardForm.patchValue({department: {}})
    }
  }
}
