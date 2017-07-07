import {Component, OnInit} from '@angular/core';
import {ResourceService} from '../services/resource.service';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-new-panel',
  template: `
    <div class="overlay-content">
      <div class="overlay-title">
        <h5>Select a board you want to create a post for:</h5>
      </div>
      <div *ngFor="let board of boards" class="boards">
        <a pButton [routerLink]="['/', board.department.handle, board.handle, 'newPost']" class="ui-button-warning" icon="fa-folder"
           [label]=board.name></a>
        </div>
      <div class="overlay-footer">
        <h6>Otherwise create a new board:</h6>
        <a pButton routerLink="/newBoard" class="ui-button-success small" icon="fa-plus" label="New Board"></a>
      </div>
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
