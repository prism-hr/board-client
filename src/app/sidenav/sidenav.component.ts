import {Component, OnInit} from '@angular/core';
import {Stormpath, Account} from 'angular-stormpath';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {BoardsService} from '../boards/boards.service';
import * as _ from 'lodash';
import BoardRepresentation = b.BoardRepresentation;

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  private user$: Observable<Account | boolean>;
  private boards: Observable<BoardRepresentation[]>;
  private groupedBoards: any;

  constructor(private router: Router, private stormpath: Stormpath, private boardsService: BoardsService) {
  }

  ngOnInit(): void {
    this.user$ = this.stormpath.user$;
    this.boards = this.boardsService.getBoards();
  }

  logout() {
    this.stormpath.logout();
    return this.router.navigate(['']);
  }
}
