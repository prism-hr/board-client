import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import {Account, Stormpath} from 'angular-stormpath';
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'board-list.component.html',
  styleUrls: ['board-list.component.scss']
})
export class BoardListComponent implements OnInit {

  user: Account | boolean;
  boards: BoardRepresentation[];

  constructor(private resourceService: ResourceService, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.stormpath.user$.subscribe(user => {
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
