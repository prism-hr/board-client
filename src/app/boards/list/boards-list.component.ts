import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {Account, Stormpath} from 'angular-stormpath';
import {Observable} from 'rxjs/Observable';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'boards-list.component.html',
  styleUrls: ['boards-list.component.scss']
})
export class BoardsListComponent implements OnInit {

  user: Account | boolean;
  departments: DepartmentRepresentation[];

  constructor(private resourceService: ResourceService, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.stormpath.user$.subscribe(user => {
      this.user = user;
      this.departments = null;
      if (user) {
        Observable.forkJoin([this.resourceService.getBoards(), this.resourceService.getDepartments()]).subscribe(results => {
          const boards: BoardRepresentation[] = results[0];
          this.departments = results[1];
          boards.forEach(b => {
            const department = this.departments.find(d => b.department.id === d.id);
            department.boards = department.boards || [];
            department.boards.push(b);
          })
        });
      }
    });
  }

}
