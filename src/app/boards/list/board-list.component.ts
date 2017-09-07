import {Component, OnInit, } from '@angular/core';
import { NgModel } from '@angular/forms'
import {ResourceService} from '../../services/resource.service';
import {UserService} from '../../services/user.service';
import BoardRepresentation = b.BoardRepresentation;
import UserRepresentation = b.UserRepresentation;
import {SelectItem} from 'primeng/primeng';

@Component({
  templateUrl: 'board-list.component.html',
  styleUrls: ['board-list.component.scss']
})
export class BoardListComponent implements OnInit {

  user: UserRepresentation | boolean;
  boards: BoardRepresentation[];

  categories: SelectItem[];
  selectedCategories: string[] = ['PRIVATE', 'PUBLIC', 'PART-PRIVATE'];

  statuses: SelectItem[];
  selectedStatuses: string[] = ['ACCEPTED'];

  constructor(private resourceService: ResourceService, private userService: UserService) {
    this.categories = [
      {label: 'Private', value: 'PRIVATE'},
      {label: 'Public', value: 'PUBLIC'},
      {label: 'Part-private', value: 'PART-PRIVATE'},
      ];
    this.statuses = [
      {label: 'Accepted', value: 'ACCEPTED'},
      {label: 'Pending', value: 'PENDING'},
      {label: 'Suspended', value: 'SUSPENDED'},
      {label: 'Expired', value: 'EXPIRED'},
      {label: 'Rejected', value: 'REJECTED'},
      {label: 'Draft', value: 'DRAFT'},
    ];
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
      this.boards = null;
      if (user) {
        this.resourceService.getBoards().subscribe(boards => {
          this.boards = boards;
        });
      }
    });
  }

}
