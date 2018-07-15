import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {DefinitionsService} from '../../services/definitions.service';
import {ResourceService} from '../../services/resource.service';
import DepartmentRepresentation = b.DepartmentRepresentation;

@Component({
  templateUrl: 'department-posts.component.html',
  styleUrls: ['department-posts.component.scss']
})
export class DepartmentPostsComponent implements OnInit {
  department: DepartmentRepresentation;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private title: Title,
              private snackBar: MatSnackBar, private resourceService: ResourceService, private definitionsService: DefinitionsService) {
  }

  ngOnInit() {
  }

}
