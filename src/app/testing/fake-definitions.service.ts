import BoardRepresentation = b.BoardRepresentation;
import DepartmentRepresentation = b.DepartmentRepresentation;

export class FakeDefinitionsService {

  private definitions = {applicationUrl: 'http://localhost:9876'};

  getDefinitions() {
    return this.definitions;
  }

}
