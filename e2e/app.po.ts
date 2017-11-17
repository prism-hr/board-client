import {browser, by, element} from 'protractor';

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

  getUniversityAutocomplete(valid: boolean) {
    return element(by.css('p-autocomplete' + (valid ? '.ng-valid' : '.ng-invalid')));
  }

  getUniversityAutocompleteItems() {
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

export class DepartmentViewPage {

  getTitle() {
    return element(by.tagName('h1')).getText();
  }

  getActiveTabItem() {
    return element(by.css('p-tabMenu li.ui-state-active a'));
  }

  getTabItem(nth: number) {
    return element(by.css('p-tabMenu li:nth-child(' + nth + ') a'));
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
    return element(by.tagName('h2'));
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

  getPasswordInput() {
    return element(by.id('password'));
  }

}
