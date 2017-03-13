///<reference path="../../board.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {Account, Stormpath} from 'angular-stormpath';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private user: Account | boolean;
  private boards: BoardRepresentation[];
  private departments: DepartmentRepresentation[];

  constructor(private resourceService: ResourceService, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.stormpath.user$.subscribe(user => {
      this.user = user;
      this.boards = null;
      this.departments = null;
      if(user) {
        this.resourceService.getBoards().subscribe(boards => {
          this.boards = boards;
        });
        this.resourceService.getDepartments().subscribe(departments => {
          this.departments = departments;
        });
      }
    });
  }

}
