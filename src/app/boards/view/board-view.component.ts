import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, ParamMap} from '@angular/router';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {UnsubscribeDialogComponent} from '../../authentication/unsubscribe.dialog';
import {ResourceService} from '../../services/resource.service';
import {Utils} from '../../services/utils';
import BoardRepresentation = b.BoardRepresentation;


@Component({
  templateUrl: 'board-view.component.html',
  styleUrls: ['board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: BoardRepresentation;
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private location: Location, private title: Title, private dialog: MatDialog,
              private resourceService: ResourceService) {
  }

  ngOnInit() {
    combineLatest(this.route.parent.data, this.route.queryParamMap)
      .subscribe(([parentData, queryParamMap]: [Data, ParamMap]) => {
        this.board = parentData['board'];
        this.title.setTitle(this.board.name);
        this.canEdit = this.resourceService.canEdit(this.board);

        const unsubscribeUuid = queryParamMap.get('unsubscribeUuid');

        // removing UUID from URL
        let path: string = Utils.removeURLParameter(this.location.path(), 'unsubscribeUuid');
        this.location.replaceState(path);

        if (unsubscribeUuid) {
          const config = new MatDialogConfig();
          config.data = {uuid: unsubscribeUuid, resource: this.board};
          setTimeout(() => {
            this.dialog.open(UnsubscribeDialogComponent, config);
          });
        }
      });
  }

}
