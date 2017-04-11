import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

@Injectable()
export class DefinitionsService {

  private definitions: { [key: string]: any };

  constructor(private http: Http) {
  }

  loadDefinitions(): Promise<any> {
    return this.http.get('/api/definitions')
      .toPromise()
      .then(definitions => {
        this.definitions = definitions.json();
        return this.definitions;
      });
  }

  getDefinitions() {
    return this.definitions;
  }

}

export function DefinitionsLoader(definitionsService: DefinitionsService) {
  return () => definitionsService.loadDefinitions();
}
