import {browser, by, ElementFinder, ProtractorBrowser} from 'protractor';

const EC = browser.ExpectedConditions;

export abstract class GenericPage {
  constructor(protected browser: ProtractorBrowser) {
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

  getSubmitButton() {
    return this.browser.element(by.css('button[label="Submit"]'));
  }

  openActivitiesPanel(expectedCount: number) {
    browser.wait(EC.presenceOf(this.getActivitiesButton()));
    if(expectedCount) {
      expect(this.getActivitiesCountBadge().getText()).toEqual('' + expectedCount);
    } else {
      expect(this.getActivitiesCountBadge().isPresent()).toBeFalsy();
    }
    this.getActivitiesButton().click();
    expect(this.getActivityItems().count()).toEqual(1);
  }

  getActivitiesButton() {
    return this.browser.element(by.css('b-header div.activity a'));
  }

  getActivitiesCountBadge() {
    return this.browser.element(by.css('b-header div.activity span.activity-badge'));
  }

  getActivityItems() {
    return this.browser.element.all(by.css('p-overlaypanel#activitiesPanel > div'));
  }

  getActivityButton(activityItem: ElementFinder) {
    return activityItem.element(by.css('div.activity-inner > a'));
  }

  getActivityCloseButton(activityItem: ElementFinder) {
    return activityItem.element(by.css('button[icon="fa-close"]'));
  }
}

export class HomePage extends GenericPage {
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
    this.sendKeysWithRetry(this.getGivenNameInput(), givenName);
    this.sendKeysWithRetry(this.getSurnameInput(), surname);
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  performLogin(email: string, password: string) {
    expect(this.getParagraphText()).toEqual('Login');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  getAlreadyRegisteredButton() {
    return this.browser.element(by.css('button[ng-reflect-label="Already Registered?"'));
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

