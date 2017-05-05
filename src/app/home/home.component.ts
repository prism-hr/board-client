import {Component, OnInit} from '@angular/core';
import {Account, Stormpath} from 'angular-stormpath';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: Account | boolean;
  boards: BoardRepresentation[];

  constructor(private resourceService: ResourceService, private stormpath: Stormpath) {
  }

  ngOnInit(): void {
    this.stormpath.user$.subscribe(user => {
      this.user = user;
      this.boards = null;
      if (user) {
        this.resourceService.getPosts().subscribe(posts => {
          const boardsIndex: { [index: number]: BoardRepresentation } = {};
          posts.forEach(p => {
            const board = p.board;
            p.board = null;
            if (!boardsIndex[board.id]) {
              (board as any).posts = [];
              boardsIndex[board.id] = board;
            }
            (boardsIndex[board.id] as any).posts.push(p);
          });
          const boardIds = Object.keys(boardsIndex);
          this.boards = boardIds.map(id => boardsIndex[id]);
        });
      }
    });
  }

}
