import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import BoardWithDepartmentDTO = b.BoardWithDepartmentDTO;

@Component({
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.scss']
})
export class NewBoardComponent implements OnInit {
  private departments: DepartmentDTO[];
  private model: BoardWithDepartmentDTO;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http) {
    this.model = {department: {}, board: {}};
  }

  ngOnInit() {
    this.departments = this.route.snapshot.data['departments'];
  }

  submit() {
    this.http.post('/api/boards', this.model)
      .subscribe(() => {
        this.router.navigate(['/boards']);
      });
  }
}
