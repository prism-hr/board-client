import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentBoardDTO = b.DepartmentBoardDTO;

@Component({
  templateUrl: 'new-board.component.html',
  styleUrls: ['new-board.component.scss']
})
export class NewBoardComponent implements OnInit {
  private departments: DepartmentDTO[];
  private selectedDepartment: DepartmentDTO;
  private model: DepartmentBoardDTO;
  private newDepartment: DepartmentDTO;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http) {
    this.model = {department: {}, board: {}};
  }

  ngOnInit() {
    this.departments = this.route.snapshot.data['departments'];
    this.departments.push({name: "Create a new department"});
  }

  submit() {
    this.http.post('/api/boards', this.model)
      .subscribe(() => {
        this.router.navigate(['/activities']);
      });
  }

  departmentSelected() {
    if(this.selectedDepartment.id) {
      this.model.department = this.selectedDepartment;
    } else {
      this.newDepartment = {};
      this.model.department = this.newDepartment;
    }
  }

}
