import {Component, OnInit,} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import {Title} from '@angular/platform-browser';

@Component({
  templateUrl: 'board-list.component.html',
  styleUrls: ['board-list.component.scss']
})
export class BoardListComponent implements OnInit {

  boards: BoardRepresentation[];

  constructor(private title: Title, private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Boards');
    this.resourceService.getResources('BOARD').subscribe(boards => {
      this.boards = boards;
    });
  }

  filterApplied(filter) {
    this.resourceService.getResources('BOARD', filter).subscribe(boards => {
      this.boards = boards;
    });
  }
}
