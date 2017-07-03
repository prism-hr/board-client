import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-new-panel',
  template: `
    <div>
      <div>Select a board you want to create a post for:</div>
      <div *ngFor="let board of boards">
        <a pButton [routerLink]="['/', board.department.handle, board.handle, 'newPost']" class="ui-button-success" icon="fa-folder"
           [label]=board.name></a>
      </div>
      Otherwise create a new board:
      <a pButton routerLink="/newBoard" class="ui-button-success" icon="fa-plus" label="New Board"></a>
    </div>
  `,
  styles: []
})
export class PostNewPanelComponent implements OnInit {

  boards: BoardRepresentation[];

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit(): void {
    this.resourceService.getBoards().subscribe(boards => {
      this.boards = boards;
    });
  }

}
