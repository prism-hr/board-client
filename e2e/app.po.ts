import {browser, by, ElementFinder, ProtractorBrowser} from 'protractor';

export class HomePage {
  constructor(private browser: ProtractorBrowser) {
  }

  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return this.browser.element(by.tagName('h2')).getText();
  }

  getUniversityInput() {
    return this.browser.element(by.id('university'));
  }

  getUniversityAutocompleteItemsList() {
    return this.browser.element.all(by.css('.ui-autocomplete-list-item'));
  }

  getDepartmentNameInput() {
    return this.browser.element(by.id('departmentName'));
  }
}

export class DepartmentNewPage {
  constructor(private browser: ProtractorBrowser) {
  }

  getParagraphText() {
    return this.browser.element(by.tagName('h2')).getText();
  }

  getUniversityInput() {
    return this.browser.element(by.id('university'));
  }

  getNameInput() {
    return this.browser.element(by.id('name'));
  }

  getSummaryTextarea() {
    return this.browser.element(by.id('summary'));
  }
}

export class PostNewPage {
  constructor(private browser: ProtractorBrowser) {
  }

  getParagraphText() {
    return this.browser.element(by.tagName('h2')).getText();
  }

  getNameInput() {
    return this.browser.element(by.id('name'));
  }

  getSummaryTextarea() {
    return this.browser.element(by.id('summary'));
  }

  getDescriptionEditor() {
    return this.browser.element(by.css('div.ui-editor-content div.ql-editor'));
  }

  getCheckboxLabel(label: String) {
    return this.browser.element(by.css('p-checkbox[ng-reflect-label="' + label + '"] div.ui-chkbox-box'));
  }

  getOrganizationNameInput() {
    return this.browser.element(by.id('organizationName'));
  }

  getLocationInput() {
    return this.browser.element(by.css('input[placeholder="e.g. London"]'));
  }

  getLocationAutocomplete(klass?: string) {
    return this.browser.element(by.css('b-places-autocomplete' + (klass ? '.' + klass : '')));
  }

  getLocationAutocompleteItemsList() {
    return this.browser.element.all(by.css('li.ui-autocomplete-list-item'));
  }

  getRadioButton(roleName) {
    return this.browser.element(by.css('p-radiobutton[ng-reflect-label="' + roleName + '"] label'));
  }

  getApplyWebsiteInput() {
    return this.browser.element(by.id('applyWebsite'));
  }

  getApplyEmailInput() {
    return this.browser.element(by.id('applyEmail'));
  }

  getExplanationTextarea() {
    return this.browser.element(by.id('existingRelationExplanation'));
  }

}

export class GenericResourcePage {
  constructor(private browser: ProtractorBrowser) {
  }

  getActiveTabItem() {
    return this.browser.element(by.css('p-tabMenu li.ui-state-active a span'));
  }

  getTabItem(label: string) {
    return this.browser.element.all(by.css('p-tabMenu li a'))
      .filter(finder => finder.element(by.css('span')).getText().then(text => text === label));
  }

  assertTabItems(...items: string[]) {
    expect(this.browser.element.all(by.css('p-tabMenu li a span')).getText()).toEqual(items);
  }

}

export class DepartmentViewPage {
  constructor(private browser: ProtractorBrowser) {
  }

  navigateTo(handle: string) {
    return browser.get('/' + handle);
  }

  assertDepartmentView(name: string, summary: string, categories: string[]) {
    expect(this.browser.element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    expect(this.browser.element(by.tagName('h1')).getText()).toEqual(name);
    expect(this.browser.element(by.css('div.summary-holder')).getText()).toEqual(summary);
    expect(this.browser.element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

}

export class DepartmentEditPage {
  constructor(private browser: ProtractorBrowser) {
  }

  getNameInput() {
    return this.browser.element(by.id('name'));
  }

  getSummaryTextarea() {
    return this.browser.element(by.id('summary'));
  }

  getCheckboxLabel(label: String) {
    return this.browser.element(by.css('p-checkbox[ng-reflect-label="' + label + '"] label'));
  }

  getHandleInput() {
    return this.browser.element(by.id('resourceHandle'));
  }
}

export class BoardViewPage {
  constructor(private browser: ProtractorBrowser) {
  }

  assertBoardView(name: string, summary: string, categories: string[], canEdit: boolean) {
    if (canEdit) {
      expect(this.browser.element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    }
    expect(this.browser.element(by.tagName('h1')).getText()).toEqual(name);
    expect(this.browser.element(by.css('div.summary-holder')).getText()).toEqual(summary);
    expect(this.browser.element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

  getNewPostButton() {
    return this.browser.element(by.css('a[label="New Post"] span.ui-button-text.ui-clickable'));
  }
}

export class DepartmentsPage {
  constructor(private browser: ProtractorBrowser) {
  }

  getDepartmentCard(handle: string) {
    return this.browser.element(by.css('mat-card#department_' + handle));
  }

  getDepartmentTitleUrl(handle: string) {
    return this.getDepartmentCard(handle).element(by.css('mat-card-header a'));
  }

}

export class ResourceUsersPage {
  constructor(private browser: ProtractorBrowser) {
  }

  getCannotFindUserButton() {
    return this.browser.element(by.css('button[label="Cannot find user?"]'));
  }

  getGivenNameInput() {
    return this.browser.element(by.id('givenName'));
  }

  getSurnameInput() {
    return this.browser.element(by.id('surname'));
  }

  getEmailInput() {
    return this.browser.element(by.id('email'));
  }

  getRoleRadioButton(roleName) {
    return this.browser.element(by.css('p-radiobutton[name="role"].' + roleName + ' label'));
  }

  getAddUserButton() {
    return this.browser.element(by.css('button[label="Add user"]'));
  }

}

export class AuthenticationDialog {

  constructor(private browser: ProtractorBrowser) {
  }

  getParagraphText() {
    return this.browser.element(by.tagName('mat-dialog-container h2')).getText();
  }

  getGivenNameInput() {
    return this.browser.element(by.css('input[ng-reflect-name="givenName"'));
  }

  getSurnameInput() {
    return this.browser.element(by.css('input[ng-reflect-name="surname"'));
  }

  getEmailInput() {
    return this.browser.element(by.css('input[ng-reflect-name="email"'));
  }

  getPasswordInput() {
    return this.browser.element(by.css('input[ng-reflect-name="password"'));
  }

  getSubmitButton() {
    return this.browser.element(by.css('mat-dialog-container button[label="Submit"]'));
  }

  performRegistration(email: string, givenName: string, surname: string, password: string) {
    expect(this.getParagraphText()).toEqual('Register');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getGivenNameInput(), givenName);
    this.sendKeysWithRetry(this.getSurnameInput(), surname);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  performLogin(email: string, password: string) {
    expect(this.getParagraphText()).toEqual('Login');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }


  private sendKeysWithRetry(input: ElementFinder, value: string) {
    input.clear();
    input.sendKeys(value);
    input.getAttribute('value').then(existingValue => {
      if (existingValue !== value) {
        this.sendKeysWithRetry(input, value);
      }
    })
  }

}

export class GenericPage {
  constructor(private browser: ProtractorBrowser) {
  }

  getLogoutButton() {
    return this.browser.element(by.id('logoutButton'));
  }

  getLoginButton() {
    return this.browser.element(by.id('loginButton'));
  }

  getPostsButton() {
    return this.browser.element(by.css('b-header header a[label="Posts"]'));
  }

  getBoardsButton() {
    return this.browser.element(by.css('b-header header a[label="Boards"]'));
  }

  getDepartmentsButton() {
    return this.browser.element(by.css('b-header header a[label="Departments"]'));
  }

  getDialog() {
    return this.browser.element(by.tagName('mat-dialog-container'));
  }

  getDoNotShowAgainButton() {
    return this.browser.element(by.css('button[label="Do not show it again"]'));
  }

  getDoItAgainButton() {
    return this.browser.element(by.css('button[label="I\'ll do it later"]'));
  }
}
