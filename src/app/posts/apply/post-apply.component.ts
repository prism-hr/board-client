import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {DepartmentRequestMembershipDialogComponent} from '../../departments/request-membership/department-request-membership.dialog';
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import UserRepresentation = b.UserRepresentation;

@Component({
  selector: 'b-post-apply',
  templateUrl: 'post-apply.component.html',
  styleUrls: ['post-apply.component.scss']
})
export class PostApplyComponent implements OnInit, OnChanges {
  @Input() post: any;
  user: UserRepresentation;
  canPursue: boolean;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MdDialog, private userService: UserService, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
    this.canPursue = this.resourceService.canPursue(this.post);
  }

  ngOnChanges(changes: any) {
    this.canPursue = this.resourceService.canPursue(this.post);
  }

  requestMembership() {
    const config = new MdDialogConfig();
    config.data = {department: this.post.board.department};
    const dialogRef = this.dialog.open(DepartmentRequestMembershipDialogComponent, config);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.onChange.emit('membershipRequested');
      }
    });
  }
}
