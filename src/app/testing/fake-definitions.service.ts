export class FakeDefinitionsService {

  private definitions = {applicationUrl: 'http://localhost:9876'};

  getDefinitions() {
    return this.definitions;
  }

}
