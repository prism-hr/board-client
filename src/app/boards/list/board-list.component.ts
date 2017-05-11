import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {Account, Stormpath} from 'angular-stormpath';
import BoardRepresentation = b.BoardRepresentation;
import {UserService} from '../../services/user.service';
import UserRepresentation = b.UserRepresentation;

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

}
