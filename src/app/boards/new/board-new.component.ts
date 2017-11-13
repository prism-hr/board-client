import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {pick} from 'lodash';
import {AuthGuard} from '../../authentication/auth-guard.service';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  applicationUrl: string;
  board: BoardDTO;
  boardForm: FormGroup;
  departmentOptions: DepartmentRepresentation[];
  department: DepartmentRepresentation;
  user: UserRepresentation;

  constructor(private router: Router, private route: ActivatedRoute, private title: Title, private resourceService: ResourceService,
              private fb: FormBuilder, private definitionsService: DefinitionsService, private userService: UserService,
              private authGuard: AuthGuard) {
    this.applicationUrl = this.definitionsService.getDefinitions()['applicationUrl'];
    this.boardForm = this.fb.group({
      department: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      summary: ['', [Validators.required, Validators.maxLength(1000)]],
      postCategories: [[]],
      documentLogo: []
    });
  }

  ngOnInit() {
    this.title.setTitle('New board');

    this.route.parent.data.subscribe(data => {
      if (data['departments'] instanceof Array) { // either array or one department can be resolved
        this.departmentOptions = (<DepartmentRepresentation[]>data['departments'])
          .map(b => ({label: b.university.name + ' - ' + b.name, value: b}));
      } else {
        this.department = data['departments'];
        this.boardForm.get('department').setValue(this.department);
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

    const board: BoardDTO = pick(this.boardForm.value, ['name', 'summary', 'postCategories', 'documentLogo']);
    const department: DepartmentRepresentation = this.boardForm.get('department').value;

    this.resourceService.postBoard(department, board)
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
  }

}
