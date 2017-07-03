import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {ResourceService} from '../../services/resource.service';
import Action = b.Action;
import BoardRepresentation = b.BoardRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  selector: 'b-resource-actions-box',
  templateUrl: 'resource-actions-box.component.html',
  styleUrls: ['resource-actions-box.component.scss']
})
export class ResourceActionsBoxComponent implements OnChanges {
  @Input() resource: any;
  actionView: string;
  actions: MenuItem[];

  constructor(private router: Router, private route: ActivatedRoute, private snackBar: MdSnackBar,
              private resourceService: ResourceService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateActionItems();
  }

  gotoSettings() {
    return this.router.navigate(['edit'], {relativeTo: this.route});
  }

  openActionDialog(action: Action) {
    this.resourceService.openActionDialog(this.resource, action, post => this.postActionHandler(post));
  }

  private generateActionItems() {
    this.actionView = this.resourceService.getActionView(this.resource);
    this.resourceService.getActionItems(this.resource, post => this.postActionHandler(post))
      .subscribe(actions => {
        this.actions = actions;
      });
  }

  private postActionHandler(post) {
    Object.assign(this.resource, post);
    this.generateActionItems();
    this.snackBar.open('Your action was executed successfully.', null, {duration: 3000});
  }
}
