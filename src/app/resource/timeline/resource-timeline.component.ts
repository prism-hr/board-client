import {Component, Input, OnInit} from '@angular/core';
import {ResourceService} from '../../services/resource.service';
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;
import ResourceRepresentation = b.ResourceRepresentation;

@Component({
  selector: 'b-resource-timeline',
  templateUrl: 'resource-timeline.component.html',
  styleUrls: ['resource-timeline.component.scss']
})
export class ResourceTimelineComponent implements OnInit {
  @Input() resource: ResourceRepresentation<any> & {};
  canEdit: boolean;
  operations: ResourceOperationRepresentation[];
  operationsLoading: boolean;
  showOperationDetails: boolean;
  selectedOperation: ResourceOperationRepresentation;

  constructor(private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.canEdit = this.resourceService.canEdit(this.resource);
    if (this.canEdit) {
      this.operationsLoading = true;
      this.resourceService.loadOperations(this.resource)
        .subscribe(operations => {
          this.operations = operations;
          this.operationsLoading = false;
        });
    }
  }

  openChangeDetails(operation) {
    this.selectedOperation = operation;
    this.showOperationDetails = true;
  }
}
