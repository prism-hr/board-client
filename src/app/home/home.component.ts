import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Account, Stormpath} from 'angular-stormpath';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

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
