import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {MdSnackBar} from '@angular/material';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;

@Component({
  templateUrl: 'board-new.component.html',
  styleUrls: ['board-new.component.scss']
})
export class BoardNewComponent implements OnInit {
  private departments: DepartmentDTO[];
  private selectedDepartment: DepartmentDTO;
  private board: BoardDTO;
  private newDepartment: DepartmentDTO;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.departments = this.route.snapshot.data['departments'];
    this.departments.push({name: "Create a new department"});
    this.board = {settings: {postCategories: []}};
  }

  submit() {
    this.http.post('/api/boards', this.board)
      .subscribe(res => {
        this.router.navigate(['/manage/board', res.json().id, 'view']);
      });
  }

  departmentSelected() {
    if (this.selectedDepartment.id) {
      this.board.department = this.selectedDepartment;
    } else {
      this.newDepartment = {memberCategories: []};
      this.board.department = this.newDepartment;
    }
  }

}
