import {Component, OnInit, } from '@angular/core';
import { NgModel } from '@angular/forms'
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import UserRepresentation = b.UserRepresentation;
import {SelectItem} from 'primeng/primeng';

@Component({
  templateUrl: 'board-list.component.html',
  styleUrls: ['board-list.component.scss']
})
export class BoardListComponent implements OnInit {

  user: UserRepresentation | boolean;
  boards: BoardRepresentation[];

  constructor(private resourceService: ResourceService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
      this.boards = null;
      if (user) {
        this.resourceService.getBoards().subscribe(boards => {
          this.boards = boards;
        });
      }
    });
  }

  filterApplied(filter) {
    this.resourceService.getBoards(filter.searchTerm).subscribe(boards => {
      this.boards = boards;
    });
  }
}
