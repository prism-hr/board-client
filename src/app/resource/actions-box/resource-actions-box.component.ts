import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceService} from '../../services/resource.service';
import {ResourceCommentDialogComponent} from '../resource-comment.dialog';
import Action = b.Action;

@Component({
  selector: 'b-resource-actions-box',
  template: `
    <div *ngIf="actions.length > 0">
      <span *ngIf="actionView !== 'VIEW' && actionView !== 'EDIT'">
        <a pButton class="ui-button-info small-xs" routerLink="edit" [label]="'actionView.' + actionView | translate"></a>
      </span>
      <span *ngFor="let action of actions">
        <button pButton class="ui-button-warning small-xs" (click)="openActionDialog(action)"
              [label]="'definitions.action.' + action | translate"></button>
      </span>
    </div>
  `,
  styles: ['button.small-xs { margin-left: 4px;}']
})
export class ResourceActionsBoxComponent implements OnChanges {
  @Input() resource: any;
  actionView: string;
  actions: Action[];

  constructor(private router: Router, private route: ActivatedRoute, private snackBar: MdSnackBar, private dialog: MdDialog,
              private resourceService: ResourceService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateActionItems();
  }

  gotoSettings() {
    return this.router.navigate(['edit'], {relativeTo: this.route});
  }

  openActionDialog(action: Action) {
    const dialogRef = this.dialog.open(ResourceCommentDialogComponent, {data: {action, resource: this.resource}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const requestBody: any = {};
        requestBody.comment = result.comment;
        this.resourceService.executeAction(this.resource, action, requestBody)
          .subscribe(newPost => {
            this.postActionHandler(newPost);
          });
      }
    });
  }

  private generateActionItems() {
    this.actionView = this.resourceService.getActionView(this.resource);
    this.actions = this.resourceService.getActions(this.resource);
  }

  private postActionHandler(post) {
    Object.assign(this.resource, post);
    this.generateActionItems();
    this.snackBar.open('Your action was executed successfully.', null, {duration: 3000});
  }
}
