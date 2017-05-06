import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import BoardDTO = b.BoardDTO;
import BoardRepresentation = b.BoardRepresentation;
import {ResourceService} from '../../services/resource.service';

@Component({
  templateUrl: 'board-manage.component.html',
  styleUrls: ['board-manage.component.scss']
})
export class BoardManageComponent implements OnInit {
  board: BoardRepresentation;
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.board = data['board'];
        this.canEdit = this.resourceService.canEdit(this.board);
    });
  }

}
