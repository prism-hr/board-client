import {browser, by, element, protractor} from 'protractor';

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
    return element(by.css('ul.ui-autocomplete-items'));
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

  performRegistration(email: string, givenName: string, surname: string, password: string) {
    this.getEmailInput().click();
    this.getEmailInput().sendKeys(email);
    this.getGivenNameInput().click();
    this.getGivenNameInput().sendKeys(givenName);
    this.getSurnameInput().click();
    this.getSurnameInput().sendKeys(surname);
    this.getPasswordInput().click();
    this.getPasswordInput().sendKeys(password);
    this.getPasswordInput().sendKeys(protractor.Key.ENTER);
  }

  getPasswordInput() {
    return element(by.id('password'));
  }

}

export class GenericPage {

  getLogoutButton() {
    return element(by.id('logoutButton'));
  }

}
