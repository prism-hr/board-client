import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;

@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  private departments: DepartmentDTO[];
  private selectedDepartment: DepartmentDTO;
  private board: BoardDTO;
  private newDepartment: DepartmentDTO;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http) {
  }

  ngOnInit() {
    this.departments = this.route.snapshot.data['departments'];
    this.departments.push({name: "Create a new department"});
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
      this.board = this.board || {};
      this.board.department = this.board.department || {};
    });
  }

  submit() {
    this.http.post('/api/boards', this.board)
      .subscribe(() => {
        this.router.navigate(['/activities']);
      });
  }

  departmentSelected() {
    if (this.selectedDepartment.id) {
      this.board.department = this.selectedDepartment;
    } else {
      this.newDepartment = {};
      this.board.department = this.newDepartment;
    }
  }

}
