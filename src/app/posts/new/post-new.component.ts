import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {DefinitionsService} from '../../services/definitions.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import DepartmentDTO = b.DepartmentDTO;
import BoardDTO = b.BoardDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import BoardRepresentation = b.BoardRepresentation;
import PostDTO = b.PostDTO;
import PostRepresentation = b.PostRepresentation;

@Component({
  templateUrl: 'post-new.component.html',
  styleUrls: ['post-new.component.scss']
})
export class PostNewComponent implements OnInit {
  board: BoardRepresentation;
  post: PostDTO;
  postForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private http: Http, private fb: FormBuilder,
              private definitionsService: DefinitionsService) {
    this.postForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      organizationName: ['', [Validators.required, Validators.maxLength(255)]],
      location: [null, Validators.required],
      existingRelationSpecify: [null, Validators.required],
      existingRelation: [null],
      postCategories: [[]],
      memberCategories: [[]],
      // applyWebsite: [null, Validators.maxLength(255)],
      // applyDocument: [],
      // applyEmail: [null, Validators.maxLength(254)]
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.board = data['board'];
    });
    this.postForm.get('existingRelationSpecify').valueChanges
      .subscribe((specify: boolean) => {
        const f = this.postForm;
        this.postForm.get('existingRelation').setValidators(specify ? Validators.required : null);
        this.postForm.get('existingRelation').setValue(null);
      });
  }

  submit() {
    this.http.post('/api/boards/' + this.board.id + '/posts', this.postForm.value)
      .subscribe(res => {
        this.router.navigate([this.board.department.handle, this.board.handle]);
      });
  }

}
