import {Component, OnInit,} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;

@Component({
  templateUrl: 'board-list.component.html',
  styleUrls: ['board-list.component.scss']
})
export class BoardListComponent implements OnInit {

  boards: BoardRepresentation[];

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.resourceService.getResources('BOARD').subscribe(boards => {
      this.boards = boards;
    });
  }

  filterApplied(filter) {
    this.resourceService.getResources('BOARD', filter.searchTerm).subscribe(boards => {
      this.boards = boards;
    });
  }
}
