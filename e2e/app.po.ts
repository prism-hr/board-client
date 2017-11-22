import {browser, by, element, ElementFinder, protractor} from 'protractor';

const EC = browser.ExpectedConditions;

export class HomePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.tagName('h2')).getText();
  }

  getUniversityInput() {
    return element(by.id('university'));
  }

  getUniversityAutocompleteItemsList() {
    return element.all(by.css('.ui-autocomplete-list-item'));
  }

  getDepartmentNameInput() {
    return element(by.id('departmentName'));
  }
}

export class NewDepartmentPage {
  getParagraphText() {
    return element(by.tagName('h2')).getText();
  }

  getUniversityInput() {
    return element(by.id('university'));
  }

  getNameInput() {
    return element(by.id('name'));
  }

  getSummaryTextarea() {
    return element(by.id('summary'));
  }
}

export class GenericResourcePage {

  getActiveTabItem() {
    return element(by.css('p-tabMenu li.ui-state-active a span'));
  }

  getTabItem(label: string) {
    return element.all(by.css('p-tabMenu li a'))
      .filter(finder => finder.element(by.css('span')).getText().then(text => text === label));
  }

  assertTabItems(...items: string[]) {
    expect(element.all(by.css('p-tabMenu li a span')).getText()).toEqual(items);
  }

}

export class DepartmentViewPage {

  navigateTo(handle: string) {
    return browser.get('/' + handle);
  }

  assertDepartmentView(name: string, summary: string, categories: string[]) {
    expect(element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    expect(element(by.tagName('h1')).getText()).toEqual(name);
    expect(element(by.css('div.summary-holder')).getText()).toEqual(summary);
    expect(element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

}

export class DepartmentEditPage {

  getNameInput() {
    return element(by.id('name'));
  }

  getSummaryTextarea() {
    return element(by.id('summary'));
  }

  getCheckboxLabel(label: String) {
    return element(by.css('p-checkbox[ng-reflect-label="' + label + '"] label'));
  }

  getHandleInput() {
    return element(by.id('resourceHandle'));
  }
}

export class BoardViewPage {

  assertBoardView(name: string, summary: string, categories: string[], canEdit: boolean) {
    if(canEdit) {
      expect(element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    }
    expect(element(by.tagName('h1')).getText()).toEqual(name);
    expect(element(by.css('div.summary-holder')).getText()).toEqual(summary);
    expect(element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

}

export class DepartmentsPage {

  getDepartmentCard(handle: string) {
    return element(by.css('mat-card#department_' + handle));
  }

  getDepartmentTitleUrl(handle: string) {
    return this.getDepartmentCard(handle).element(by.css('mat-card-header a'));
  }

}

export class ResourceUsersPage {

  getCannotFindUserButton() {
    return element(by.css('button[label="Cannot find user?"]'));
  }

  getGivenNameInput() {
    return element(by.id('givenName'));
  }

  getSurnameInput() {
    return element(by.id('surname'));
  }

  getEmailInput() {
    return element(by.id('email'));
  }

  getRoleRadioButton(roleName) {
    return element(by.css('p-radiobutton[name="role"].' + roleName + ' label'));
  }

  getAddUserButton() {
    return element(by.css('button[label="Add user"]'));
  }

}

export class AuthenticationDialog {

  getParagraphText() {
    return element(by.tagName('mat-dialog-container h2')).getText();
  }

  getGivenNameInput() {
    return element(by.id('givenName'));
  }

  getSurnameInput() {
    return element(by.id('surname'));
  }

  getEmailInput() {
    return element(by.id('email'));
  }

  performRegistration(email: string, givenName: string, surname: string, password: string) {
    expect(this.getParagraphText()).toEqual('Register');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getGivenNameInput(), givenName);
    this.sendKeysWithRetry(this.getSurnameInput(), surname);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getPasswordInput().sendKeys(protractor.Key.ENTER);
  }

  performLogin(email: string, password: string) {
    expect(this.getParagraphText()).toEqual('Login');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getPasswordInput().sendKeys(protractor.Key.ENTER);
  }

  getPasswordInput() {
    return element(by.id('password'));
  }

  private sendKeysWithRetry(input: ElementFinder, value: string) {
    input.clear();
    input.sendKeys(value);
    input.getAttribute('value').then(existingValue => {
      if(existingValue !== value) {
        this.sendKeysWithRetry(input, value);
      }
    })
  }

}

export class GenericPage {

  getLogoutButton() {
    return element(by.id('logoutButton'));
  }

  getLoginButton() {
    return element(by.id('loginButton'));
  }

  getPostsButton() {
    return element(by.css('b-header header a[label="Posts"]'));
  }

  getBoardsButton() {
    return element(by.css('b-header header a[label="Boards"]'));
  }

  getDepartmentsButton() {
    return element(by.css('b-header header a[label="Departments"]'));
  }

  getDialog() {
    return element(by.tagName('mat-dialog-container'));
  }

  getDoNotShowAgainButton() {
    return element(by.css('button[label="Do not show it again"]'));
  }

  getDoItAgainButton() {
    return element(by.css('button[label="I\'ll do it later"]'));
  }
}
