import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {difference} from 'lodash';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Subject';
import {EntityFilter} from '../general/filter/filter.component';
import {Utils} from './utils';
import Action = b.Action;
import BoardDTO = b.BoardDTO;
import BoardPatchDTO = b.BoardPatchDTO;
import BoardRepresentation = b.BoardRepresentation;
import DepartmentDTO = b.DepartmentDTO;
import DepartmentPatchDTO = b.DepartmentPatchDTO;
import DepartmentRepresentation = b.DepartmentRepresentation;
import PostRepresentation = b.PostRepresentation;
import ResourceOperationRepresentation = b.ResourceOperationRepresentation;
import ResourcePatchDTO = b.ResourcePatchDTO;
import ResourceRepresentation = b.ResourceRepresentation;
import Scope = b.Scope;
import UniversityRepresentation = b.UniversityRepresentation;
import UserRepresentation = b.UserRepresentation;
import UserRoleDTO = b.UserRoleDTO;
import UserRoleRepresentation = b.UserRoleRepresentation;
import UserRolesRepresentation = b.UserRolesRepresentation;

@Injectable()
export class ExternalApisService {

  constructor(private http: HttpClient) {
  }

    lookupOrganizations(text: string) {
      const headers = new HttpHeaders({'Authorization': 'pk_1c49d926642d601db96056cf286bfe63'});
      return this.http.get('https://autocomplete.clearbit.com/v1/companies/suggest?query=' + text.trim(),
        {headers});
    }
}

